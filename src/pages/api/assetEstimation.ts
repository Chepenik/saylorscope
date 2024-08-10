"use server"

import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, type, estimationType } = req.body;

  if (!name || !type || !estimationType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const CLAUDE_API_KEY = process.env.NEXT_PUBLIC_CLAUDE_API_KEY;
  const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

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
            
            Example responses:
            {"value": 500, "range": null, "explanation": "Based on average maintenance costs for similar assets."}
            {"value": 25, "range": [-50, 100], "explanation": "Bitcoin's annual appreciation rate is highly volatile. Historical data suggests a range of -50% to 100% annual growth, with 25% as a midpoint estimate."}
            {"value": null, "range": null, "explanation": "Cannot provide an estimate for 'Food' as an asset. Food is typically a consumable item, not an investment asset."}
            `
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
    const estimatedData = JSON.parse(assistantMessage);

    return res.status(200).json({
      [estimationType]: estimatedData.value,
      range: estimatedData.range,
      explanation: estimatedData.explanation
    });
  } catch (error) {
    console.error('Error fetching asset estimation:', error);
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return res.status(500).json({ 
        message: 'An error occurred while estimating the asset details.',
        error: axiosError.response?.data || axiosError.message
      });
    } else {
      return res.status(500).json({ 
        message: 'An unexpected error occurred while estimating the asset details.',
        error: (error as Error).message
      });
    }
  }
}