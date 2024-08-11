"use server"

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { Asset } from '../../types/asset';
import { rateLimit } from '../../app/utils/rateLimit';
import { logger } from '../../app/utils/logger';

type EstimationType = 'maintenance' | 'appreciation';

interface RequestBody {
  name: Asset['name'];
  type: Asset['type'];
  estimationType: EstimationType;
}

interface EstimatedData {
  value: number | null;
  range: [number, number] | null;
  explanation: string;
}

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const limiter = rateLimit({
    interval: 24 * 60 * 60 * 1000,
    uniqueTokenPerInterval: 500,
  });
  
  try {
    await limiter.check(req, 7, 'CACHE_TOKEN');
  } catch {
    return NextResponse.json({ message: 'Daily limit exceeded. Please try again tomorrow.' }, { status: 429 });
  }

  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const body: RequestBody = await req.json();
  const { name, type, estimationType } = body;

  if (!name || !type || !estimationType) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
  const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

  if (!CLAUDE_API_KEY) {
    logger.error('CLAUDE_API_KEY is not set');
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }

  try {
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: 'claude-3-opus-20240229',
        messages: [
          {
            role: 'user',
            content: `Please provide an estimate for the following asset:
Name: ${name}
Type: ${type}

Provide an estimate for:
${estimationType === 'maintenance' 
  ? 'Monthly maintenance cost (in USD)' 
  : 'Annual appreciation rate (as a percentage)'}

Always try to provide a numeric estimate or range. If the asset is volatile or speculative, give a reasonable range based on historical data or expert predictions.

Format your response as a JSON object with three keys: 
"value" (a single numeric estimate or the midpoint of a range), 
"range" (an array with two numbers representing the low and high estimates, or null if not applicable), 
and "explanation" (a brief explanation of the estimate or range).

IMPORTANT: Your response should contain ONLY the JSON object, without any additional text before or after it.

Example responses:
{"value": 500, "range": null, "explanation": "Based on average maintenance costs for similar assets."}
{"value": 25, "range": [-50, 100], "explanation": "Bitcoin's annual appreciation rate is highly volatile. Historical data suggests a range of -50% to 100% annual growth, with 25% as a midpoint estimate."}
{"value": 0, "range": null, "explanation": "This asset typically does not have any direct maintenance costs."}`
          }
        ],
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
      }
    );

    const assistantMessage = response.data.content[0].text;
    logger.info(`Raw Claude API response: ${assistantMessage}`);

    let estimatedData: EstimatedData;
    try {
      const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        estimatedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON found in the response");
      }
    } catch (parseError) {
      logger.error('Failed to parse Claude API response:', parseError);
      return NextResponse.json({ 
        message: 'Failed to parse the AI response. Please try again.',
        rawResponse: assistantMessage
      }, { status: 500 });
    }

    if (!estimatedData.value && estimatedData.value !== 0 && !estimatedData.range && !estimatedData.explanation) {
      logger.error('Invalid data structure in Claude API response:', estimatedData);
      return NextResponse.json({ 
        message: 'The AI provided an invalid response. Please try again.',
        rawResponse: assistantMessage
      }, { status: 500 });
    }

    logger.info(`Asset estimation successful for ${name} (${type})`);

    return NextResponse.json({
      [estimationType]: estimatedData.value,
      range: estimatedData.range,
      explanation: estimatedData.explanation
    }, { status: 200 });
  } catch (error) {
    logger.error('Error fetching asset estimation:', error);
    
    if (axios.isAxiosError(error)) {
      logger.error('Axios error details:', error.response?.data);
      return NextResponse.json({ 
        message: 'An error occurred while estimating the asset details.',
        errorDetails: error.response?.data
      }, { status: 500 });
    } else {
      return NextResponse.json({ 
        message: 'An unexpected error occurred while estimating the asset details.',
        errorDetails: (error as Error).message
      }, { status: 500 });
    }
  }
}