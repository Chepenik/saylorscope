import axios from 'axios';
import { logger } from './logger';

export async function estimateAssetDetails(name: string, type: string, estimationType: 'maintenance' | 'appreciation') {
  try {
    logger.info(`Sending request to local API for ${name} (${type}) - ${estimationType}`);
    
    const response = await axios.post('/api/claude', {
      name,
      type,
      estimationType
    });

    logger.info(`Received response from local API for ${name} (${type}) - ${estimationType}`);
    const estimatedData = response.data;

    return {
      [estimationType]: estimatedData.value,
      range: estimatedData.range,
      explanation: estimatedData.explanation
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(`Axios error fetching asset estimation: ${error.message}`);
      logger.error(`Error details: ${JSON.stringify(error.response?.data)}`);
      throw new Error(`Error: ${error.message}. Please try again later.`);
    } else {
      logger.error('Error fetching asset estimation:', error);
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
}