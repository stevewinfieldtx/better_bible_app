import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const SYSTEM = `You generate structured Christian educational content for a given Bible verse and age group. Return ONLY valid JSON matching the BibleContent schema. No commentary. No markdown. Rules: Paraphrase at the chosen reading level; be factual about context; neutral tone; write vivid image prompts; 2 stories with 2 image prompts and a short relevance section each; 2 short poems with 1 image prompt each; 1 short prayer; related lists.`;

export async function POST(req: NextRequest) {
  const { verseRef, ageGroup, styles } = await req.json();
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: JSON.stringify({ verseRef, ageGroup, styles }) }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  };

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify(body)
  });

  if (!r.ok) return NextResponse.json({ error: 'LLM error' }, { status: 500 });
  const j = await r.json();
  const content = j.choices?.[0]?.message?.content;
  try {
    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON returned' }, { status: 500 });
  }
}
