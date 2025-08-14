'use client';
import { useState } from 'react';

interface Subscription {
  id: string;
  email: string;
  status: string;
  amount: number;
  currency: string;
  interval: string;
  createdAt: string;
  nextBillingDate: string;
}

interface SubscriptionManagerProps {
  subscription: Subscription;
  onClose: () => void;
  onCancel: () => void;
}

export default function SubscriptionManager({ subscription, onClose, onCancel }: SubscriptionManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      // In production, you'd call your payment processor's API to cancel
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onCancel();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100); // Convert cents to dollars
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">💳</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Subscription Management
          </h2>
          <p className="text-gray-600">
            Manage your Better Bible App subscription
          </p>
        </div>

        {/* Subscription Details */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-semibold text-green-600 capitalize">{subscription.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-semibold">{subscription.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold">{formatAmount(subscription.amount, subscription.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Billing Cycle:</span>
              <span className="font-semibold capitalize">{subscription.interval}ly</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Started:</span>
              <span className="font-semibold">{formatDate(subscription.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Next Billing:</span>
              <span className="font-semibold">{formatDate(subscription.nextBillingDate)}</span>
            </div>
          </div>
        </div>

        {/* Subscription Benefits */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Your Subscription Includes:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Unlimited AI-generated Bible content</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Custom AI images for every verse</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Age-appropriate learning materials</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Smart caching for faster responses</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!showCancelConfirm ? (
            <>
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                Cancel Subscription
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <p className="text-red-800 text-sm">
                  Are you sure you want to cancel? You'll lose access to all AI features at the end of your current billing period.
                </p>
              </div>
              <button
                onClick={handleCancelSubscription}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Cancelling...' : 'Yes, Cancel Subscription'}
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                No, Keep Subscription
              </button>
            </>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Need help? Contact support at help@betterbibleapp.com</p>
          <p className="mt-1">You can resubscribe at any time</p>
        </div>
      </div>
    </div>
  );
}
