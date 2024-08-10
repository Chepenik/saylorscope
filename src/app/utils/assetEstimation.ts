import axios from 'axios';

interface EstimatedAssetDetails {
  maintenance: number | null;
  appreciation: number | null;
  explanation: string;
  range?: [number, number]; // Adding the optional range property
}

export async function estimateAssetDetails(
  name: string, 
  type: string, 
  estimationType: 'maintenance' | 'appreciation'
): Promise<EstimatedAssetDetails> {
  if (!name || !type) {
    throw new Error('Please enter an asset name and type before requesting an estimate.');
  }

  try {
    const response = await axios.post('/api/assetEstimation', {
      name,
      type,
      estimationType
    });

    return {
      maintenance: estimationType === 'maintenance' ? response.data.maintenance : null,
      appreciation: estimationType === 'appreciation' ? response.data.appreciation : null,
      explanation: response.data.explanation,
      range: response.data.range // Include range if it exists in the response
    };
  } catch (error) {
    console.error('Error fetching asset estimation:', error);
    throw new Error('An error occurred while estimating the asset details. Please try again later.');
  }
}