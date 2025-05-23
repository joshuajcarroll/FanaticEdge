// app/api/generate-summary/route.ts
import { NextResponse } from 'next/server';

// This is your Next.js API route. It acts as an intermediary.
// It will receive the request from your front-end and forward it to your AWS Lambda.

export async function POST(request: Request) {
  try {
    const { articleText } = await request.json();

    if (!articleText || typeof articleText !== 'string' || articleText.trim().length === 0) {
      return NextResponse.json({ error: 'Article text is required.' }, { status: 400 });
    }

    // --- IMPORTANT: This is where we will call your AWS Lambda function ---
    // For now, we'll use a placeholder URL. You'll replace this with your actual
    // AWS API Gateway URL once your Lambda is deployed.
    const lambdaEndpoint = process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'http://localhost:3000/api/mock-lambda'; // Fallback for local testing

    const lambdaResponse = await fetch(lambdaEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You might add an API key here later for extra security if not using AWS IAM/Cognito
      },
      body: JSON.stringify({ articleText }),
    });

    if (!lambdaResponse.ok) {
      const errorData = await lambdaResponse.json();
      console.error('Error from Lambda:', errorData);
      return NextResponse.json({ error: errorData.message || 'Failed to get response from Lambda.' }, { status: lambdaResponse.status });
    }

    const data = await lambdaResponse.json();
    return NextResponse.json(data); // Forward Lambda's response (summary, keywords)

  } catch (error) {
    console.error('Error in Next.js API route:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}