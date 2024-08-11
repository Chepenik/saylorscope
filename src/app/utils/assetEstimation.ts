import axios from 'axios';
import { Asset } from '../../types/asset';

type EstimationType = 'maintenance' | 'appreciation';

interface EstimatedAssetDetails {
  maintenance: number | null;
  appreciation: number | null;
  explanation: string;
  range: [number, number] | null;
}

interface ApiResponse {
  maintenance?: number | null;
  appreciation?: number | null;
  range: [number, number] | null;
  explanation: string;
}

export async function estimateAssetDetails(
  name: Asset['name'],
  type: Asset['type'],
  estimationType: EstimationType
): Promise<EstimatedAssetDetails> {
  if (!name || !type) {
    throw new Error('Please enter an asset name and type before requesting an estimate.');
  }

  try {
    const response = await axios.post<ApiResponse>('/api/assetEstimation', {
      name,
      type,
      estimationType
    });

    const { data } = response;

    return {
      maintenance: estimationType === 'maintenance' ? data.maintenance ?? null : null,
      appreciation: estimationType === 'appreciation' ? data.appreciation ?? null : null,
      explanation: data.explanation,
      range: data.range
    };
  } catch (error) {
    console.error('Error fetching asset estimation:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`An error occurred while estimating the asset details: ${error.message}`);
    } else {
      throw new Error('An unexpected error occurred while estimating the asset details. Please try again later.');
    }
  }
}