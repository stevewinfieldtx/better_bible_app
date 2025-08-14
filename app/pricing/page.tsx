'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');

  const monthlyPrice = 1;
  const annualPrice = 10; // $10/year = ~$0.83/month (17% savings)

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-purple-600">
      {/* Header */}
      <header className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto px-4">
          Choose the plan that works best for your family's Bible learning journey
        </p>
      </header>

      {/* Pricing Toggle */}
      <div className="text-center mb-12">
        <div className="inline-flex bg-white/20 backdrop-blur-sm rounded-full p-1">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              selectedPlan === 'monthly'
                ? 'bg-white text-blue-600 shadow-lg'
                : 'text-white hover:text-white/80'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedPlan('annual')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              selectedPlan === 'annual'
                ? 'bg-white text-blue-600 shadow-lg'
                : 'text-white hover:text-white/80'
            }`}
          >
            Annual
            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4">🆓</div>
            <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
            <div className="text-4xl font-bold text-white mb-6">$0</div>
            
            <div className="space-y-3 mb-8 text-left">
              <div className="flex items-center">
                <span className="text-green-400 mr-3">✓</span>
                <span className="text-white">Basic app access</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-3">✓</span>
                <span className="text-white">Sample content</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-3">✓</span>
                <span className="text-white">Random images</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 mr-3">✗</span>
                <span className="text-white/70">AI-generated content</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 mr-3">✗</span>
                <span className="text-white/70">Custom AI images</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 mr-3">✗</span>
                <span className="text-white/70">Unlimited verses</span>
              </div>
            </div>

            <Link
              href="/"
              className="inline-block w-full bg-white/30 hover:bg-white/40 text-white py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              Get Started Free
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-2xl relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-8 left-8 w-16 h-16 bg-white rounded-full"></div>
              <div className="absolute bottom-8 right-8 w-12 h-12 bg-white rounded-full"></div>
            </div>

            <div className="relative">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <div className="text-4xl font-bold text-white mb-2">
                ${selectedPlan === 'monthly' ? monthlyPrice : annualPrice}
              </div>
              <div className="text-white/90 mb-6">
                per {selectedPlan === 'monthly' ? 'month' : 'year'}
              </div>
              
              <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  <span className="text-white">Everything in Free</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  <span className="text-white">Unlimited AI-generated content</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  <span className="text-white">Custom AI images for every verse</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  <span className="text-white">Age-appropriate learning materials</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  <span className="text-white">Smart caching for faster responses</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  <span className="text-white">Priority support</span>
                </div>
              </div>

              <button
                onClick={() => {
                  // Redirect to main page with subscription modal
                  window.location.href = '/?subscribe=true';
                }}
                className="w-full bg-white text-orange-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                Start Premium Trial
              </button>

              <p className="text-xs text-white/80 mt-3">
                Cancel anytime • No hidden fees
              </p>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mt-16 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">
              Why Choose Premium?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-semibold text-white mb-2">Personalized Learning</h4>
                <p className="text-white/80 text-sm">
                  AI-generated content tailored to each age group and specific Bible verse
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">🖼️</div>
                <h4 className="font-semibold text-white mb-2">Custom Visuals</h4>
                <p className="text-white/80 text-sm">
                  Unique AI-generated images that bring each Bible story to life
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="font-semibold text-white mb-2">Smart Technology</h4>
                <p className="text-white/80 text-sm">
                  Advanced caching and AI optimization for the best learning experience
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white/10 rounded-2xl">
              <h4 className="font-semibold text-white mb-3">Perfect for Families</h4>
              <p className="text-white/90">
                At just ${monthlyPrice}/month, Premium gives your entire family unlimited access to 
                personalized Bible learning. That's less than the cost of a coffee! 
                Start your family's faith journey today.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-6 text-left">
              <div>
                <h4 className="font-semibold text-white mb-2">Can I cancel anytime?</h4>
                <p className="text-white/80">
                  Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">What if I'm not satisfied?</h4>
                <p className="text-white/80">
                  We offer a 30-day money-back guarantee. If you're not completely satisfied, we'll refund your subscription.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Is my payment secure?</h4>
                <p className="text-white/80">
                  Absolutely! We use industry-standard encryption and secure payment processors to protect your information.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Can I use it on multiple devices?</h4>
                <p className="text-white/80">
                  Yes! Your subscription works on all your devices - phones, tablets, and computers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Bible Learning?
            </h3>
            <p className="text-white/90 mb-6">
              Join thousands of families who are already using Better Bible App to grow in faith together.
            </p>
            <button
              onClick={() => {
                window.location.href = '/?subscribe=true';
              }}
              className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg"
            >
              Start Your $1/month Journey Today
            </button>
            <p className="text-xs text-white/80 mt-3">
              No commitment • Cancel anytime • 30-day guarantee
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-white/70">
        <p>© 2024 Better Bible App. Making God's Word accessible to all ages.</p>
        <div className="mt-2 space-x-4">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <a href="mailto:support@betterbibleapp.com" className="hover:text-white transition-colors">
            Support
          </a>
        </div>
      </footer>
    </div>
  );
}
