import { NextResponse } from 'next/server';
import { searchTendersWithAI, explainTenderWithAI, generateAdvisorConversation } from '@/lib/tenderMetadata';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, query, message, history, profile, tenderId } = body;

    // Conversational Chat Action
    if (action === 'chat') {
      const prompt = message || query || '';
      const response = generateAdvisorConversation(prompt, history || []);
      return NextResponse.json({
        success: true,
        action: 'chat',
        ...response,
      });
    }

    if (action === 'explain') {
      if (!tenderId) {
        return NextResponse.json({ error: 'tenderId is required for explain action' }, { status: 400 });
      }
      const explanation = explainTenderWithAI(tenderId);
      if (!explanation) {
        return NextResponse.json({ error: 'Tender not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        action: 'explain',
        data: explanation
      });
    }

    // Default action: match
    const results = searchTendersWithAI({
      userPrompt: query || '',
      profile: profile || {},
      limit: body.limit || 25,
      includeClosed: body.includeClosed || false,
    });

    return NextResponse.json({
      success: true,
      action: 'match',
      query: query || '',
      total: results.length,
      matches: results,
    });
  } catch (error: any) {
    console.error('Error in tender-copilot API:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
