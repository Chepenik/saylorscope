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
            
            If you can provide a numeric estimate, format your response as a JSON object with two keys: "value" (the numeric estimate) and "explanation" (a brief explanation of the estimate).
            
            If you cannot provide a specific numeric estimate, format your response as a JSON object with two keys: "value" (set to null) and "explanation" (a detailed explanation of why a specific estimate can't be provided and what factors influence this asset's ${estimationType}).
            
            Example responses:
            {"value": 500, "explanation": "Based on average maintenance costs for similar assets."}
            {"value": null, "explanation": "It's difficult to estimate the appreciation rate for Bitcoin due to its high volatility. Factors influencing its value include market demand, regulatory changes, and technological advancements."}
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