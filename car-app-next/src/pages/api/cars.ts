import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface CarResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CarResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { active } = req.body;

    if (!active) {
      return res.status(400).json({
        success: false,
        error: 'Active parameter is required',
      });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;

    const response = await axios.post(
      apiUrl as string,
      { active },
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    console.error('Error calling external API:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch car data',
    });
  }
}
