import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBX4Q3dZXzdHIoHDSHX6i5Qhp8jS01wUds';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// In-memory cache (in production, you'd want to use Redis or a database)
const contentCache = new Map<string, any>();

interface GenerateRequest {
  verse: string;
  ageGroup: string;
}

interface GeneratedContent {
  verse: string;
  ageGroup: string;
  paraphrase: string;
  story: string;
  prayer: string;
  activities: string[];
  keyPoints: string[];
  timestamp: string;
}

function generateCacheKey(verse: string, ageGroup: string): string {
  return `${verse.toLowerCase().trim()}_${ageGroup.toLowerCase().trim()}`;
}

function createPrompt(verse: string, ageGroup: string): string {
  const ageSpecificInstructions = {
    '0-6': 'Use very simple language, short sentences, and focus on basic concepts like love, kindness, and God\'s care. Include gentle, comforting themes.',
    '7-12': 'Use engaging, adventure-style language that captures imagination. Include relatable scenarios and clear moral lessons.',
    '13-17': 'Address real-life challenges teens face, use contemporary language, and connect biblical principles to modern situations.',
    'adult': 'Provide deeper theological insights, practical applications for daily life, and connections to broader biblical themes.'
  };

  const instructions = ageSpecificInstructions[ageGroup.toLowerCase() as keyof typeof ageSpecificInstructions] || ageSpecificInstructions.adult;

  return `Create age-appropriate Bible content for ${verse} for ${ageGroup} year olds.

${instructions}

Please provide the following in JSON format:
{
  "paraphrase": "A simple explanation of the verse in age-appropriate language",
  "story": "A short, engaging story that illustrates the verse's meaning",
  "prayer": "A simple prayer related to the verse",
  "activities": ["3-4 fun, age-appropriate activities to help understand the verse"],
  "keyPoints": ["3-4 main points to remember from the verse"]
}

Keep all content family-friendly and biblically accurate.`;
}

export async function POST(request: NextRequest) {
  try {
    const { verse, ageGroup }: GenerateRequest = await request.json();

    if (!verse || !ageGroup) {
      return NextResponse.json(
        { error: 'Verse and ageGroup are required' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = generateCacheKey(verse, ageGroup);
    const cachedContent = contentCache.get(cacheKey);
    
    if (cachedContent) {
      console.log('Content retrieved from cache for:', cacheKey);
      return NextResponse.json({
        content: cachedContent,
        cached: true
      });
    }

    // Generate new content using Gemini AI
    console.log('Generating new content for:', verse, ageGroup);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = createPrompt(verse, ageGroup);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse the JSON response
    let parsedContent;
    try {
      // Extract JSON from the response (sometimes AI adds extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback: create structured content from the raw response
      parsedContent = {
        paraphrase: text.substring(0, 200) + '...',
        story: 'The AI generated a response but it couldn\'t be properly formatted. Please try again.',
        prayer: 'Dear God, help us understand this verse better. Amen.',
        activities: ['Read the verse together', 'Talk about what it means', 'Draw a picture about it'],
        keyPoints: ['God loves us', 'We should love others', 'Faith is important']
      };
    }

    // Create the final content object
    const generatedContent: GeneratedContent = {
      verse: verse.trim(),
      ageGroup: ageGroup,
      paraphrase: parsedContent.paraphrase || 'Content could not be generated.',
      story: parsedContent.story || 'Story could not be generated.',
      prayer: parsedContent.prayer || 'Prayer could not be generated.',
      activities: Array.isArray(parsedContent.activities) ? parsedContent.activities : ['Activity could not be generated.'],
      keyPoints: Array.isArray(parsedContent.keyPoints) ? parsedContent.keyPoints : ['Key point could not be generated.'],
      timestamp: new Date().toISOString()
    };

    // Cache the generated content
    contentCache.set(cacheKey, generatedContent);
    console.log('Content cached for:', cacheKey);

    return NextResponse.json({
      content: generatedContent,
      cached: false
    });

  } catch (error) {
    console.error('Error generating content:', error);
    
    // Return a fallback response
    const fallbackContent: GeneratedContent = {
      verse: 'Unknown',
      ageGroup: 'Unknown',
      paraphrase: 'We encountered an error while generating content. Please try again later.',
      story: 'The AI service is temporarily unavailable. Please try again in a few minutes.',
      prayer: 'Dear God, please help us understand your Word. Amen.',
      activities: ['Try refreshing the page', 'Check your internet connection', 'Try again later'],
      keyPoints: ['God is always with us', 'His Word is important', 'Keep trying'],
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      content: fallbackContent,
      cached: false,
      error: 'Failed to generate content'
    }, { status: 500 });
  }
}

// GET endpoint to retrieve existing content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const verse = searchParams.get('verse');
    const ageGroup = searchParams.get('ageGroup');

    if (!verse || !ageGroup) {
      return NextResponse.json({ 
        error: 'Verse and age group parameters are required' 
      }, { status: 400 });
    }

    const storageKey = `${verse.toLowerCase().replace(/\s+/g, '-')}-${ageGroup}`;
    const existingContent = contentCache.get(storageKey);

    if (existingContent) {
      return NextResponse.json({
        content: existingContent,
        found: true
      });
    } else {
      return NextResponse.json({
        content: null,
        found: false
      });
    }

  } catch (error) {
    console.error('Error retrieving content:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve content' 
    }, { status: 500 });
  }
}
