import { NextRequest, NextResponse } from 'next/server';

interface SubscriptionRequest {
  email: string;
  name?: string;
}

// In production, you'd integrate with Stripe, PayPal, or another payment processor
// For now, this is a mock implementation
export async function POST(request: NextRequest) {
  try {
    const { email, name }: SubscriptionRequest = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Mock subscription creation
    // In production, you would:
    // 1. Create a customer in your payment processor
    // 2. Set up a recurring $1/month subscription
    // 3. Store user data in your database
    // 4. Send welcome email
    
    console.log('New subscription request:', { email, name, timestamp: new Date().toISOString() });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Subscription created successfully',
      subscription: {
        id: `sub_${Date.now()}`,
        email,
        name: name || 'Anonymous',
        status: 'active',
        amount: 100, // $1.00 in cents
        currency: 'usd',
        interval: 'month',
        createdAt: new Date().toISOString(),
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      }
    });

  } catch (error) {
    console.error('Subscription creation failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create subscription',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Mock subscription check
    // In production, you'd query your database/payment processor
    const mockSubscription = {
      id: `sub_${Date.now()}`,
      email,
      status: 'active',
      amount: 100,
      currency: 'usd',
      interval: 'month',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days from now
    };

    return NextResponse.json({
      success: true,
      subscription: mockSubscription
    });

  } catch (error) {
    console.error('Subscription check failed:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}
