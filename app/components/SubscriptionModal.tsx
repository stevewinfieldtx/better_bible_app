'use client';
import { useState } from 'react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (email: string) => void;
}

export default function SubscriptionModal({ isOpen, onClose, onSubscribe }: SubscriptionModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'intro' | 'payment' | 'success'>('intro');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await onSubscribe(email);
      setStep('success');
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
        {step === 'intro' && (
          <>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🌟</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Unlock Unlimited Bible Learning
              </h2>
              <p className="text-gray-600">
                Get personalized AI-generated content for every Bible verse, custom images, and more!
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">$1</div>
                <div className="text-gray-600">per month</div>
                <div className="text-sm text-gray-500 mt-1">Cancel anytime</div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Unlimited AI-generated content</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Custom AI images for every verse</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Age-appropriate learning materials</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Smart caching saves API costs</span>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Start $1/month Subscription'}
              </button>
            </form>

            <button
              onClick={onClose}
              className="w-full text-gray-500 py-2 hover:text-gray-700 transition-colors"
            >
              Maybe later
            </button>
          </>
        )}

        {step === 'payment' && (
          <div className="text-center">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-bold mb-4">Complete Your Subscription</h3>
            <p className="text-gray-600 mb-6">
              You'll be redirected to our secure payment processor to complete your $1/month subscription.
            </p>
            <button
              onClick={() => setStep('intro')}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-4">Welcome to Better Bible App!</h3>
            <p className="text-gray-600 mb-6">
              Your subscription is active. You now have unlimited access to all features!
            </p>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Start Learning
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
