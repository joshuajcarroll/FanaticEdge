// app/api/mock-lambda/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('Mock Lambda hit!');
  const { articleText } = await request.json();

  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Return a mock summary and keywords
  const mockSummary = `This is a mock summary of your article, which had ${articleText.length} characters. The real summary will come from the LLM!`;
  const mockKeywords = 'mock, test, nextjs, lambda';

  return NextResponse.json({
    summary: mockSummary,
    keywords: mockKeywords,
  });
}