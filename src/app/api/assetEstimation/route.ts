import { NextResponse } from 'next/server';
import { estimateAssetDetails } from '@/app/utils/assetEstimation';

export async function POST(request: Request) {
  try {
    const { name, type, estimationType } = await request.json();
    const estimatedDetails = await estimateAssetDetails(name, type, estimationType);
    return NextResponse.json(estimatedDetails);
  } catch (error) {
    console.error('Error in asset estimation:', error);
    return NextResponse.json({ error: 'An error occurred during asset estimation' }, { status: 500 });
  }
}