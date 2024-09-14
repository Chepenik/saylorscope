import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
  const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

  if (!CLAUDE_API_KEY) {
    return NextResponse.json({ error: 'CLAUDE_API_KEY is not set' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { name, type, estimationType } = body;

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

IMPORTANT: Your response should contain ONLY the JSON object, without any additional text before or after it.`
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

    return NextResponse.json(estimatedData);
  } catch (error) {
    console.error('Error in Claude API request:', error);
    return NextResponse.json({ error: 'An error occurred while processing the request' }, { status: 500 });
  }
}