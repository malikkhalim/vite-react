import { create } from 'soap';
import { AERODILI_CONFIG } from '../config';
import { logger } from './logging';

export async function testWsdlConnection(): Promise<{
  success: boolean;
  message: string;
  services?: string[];
}> {
  try {
    logger.log('info', 'WSDL_TEST', 'Testing WSDL connectivity...');
    
    const client = await create(AERODILI_CONFIG.WSDL_URL, {
      wsdl_options: {
        timeout: 10000 // 10 second timeout for initial connection
      }
    });

    // Get available services
    const services = Object.keys(client.describe());
    
    logger.log('info', 'WSDL_TEST', 'WSDL connection successful', {
      services,
      endpoint: AERODILI_CONFIG.WSDL_URL
    });

    return {
      success: true,
      message: 'Successfully connected to WSDL endpoint',
      services
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    logger.log('error', 'WSDL_TEST', 'WSDL connection failed', {
      error: errorMessage,
      endpoint: AERODILI_CONFIG.WSDL_URL
    });

    return {
      success: false,
      message: `Failed to connect to WSDL endpoint: ${errorMessage}`
    };
  }
}