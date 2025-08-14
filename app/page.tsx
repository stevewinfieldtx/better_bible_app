'use client';
import { useState, useEffect } from 'react';
import SubscriptionModal from './components/SubscriptionModal';
import SubscriptionManager from './components/SubscriptionManager';

type Age = '0-6' | '7-12' | '13-17' | 'Adult';

interface AgeGroup {
  age: Age;
  label: string;
  description: string;
  color: string;
  imageFolder: string;
  currentImage: string;
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

export default function Page() {
  const [selectedAge, setSelectedAge] = useState<Age>('7-12');
  const [bibleVerse, setBibleVerse] = useState('John 3:16');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showSubscriptionManager, setShowSubscriptionManager] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([
    {
      age: '0-6',
      label: '0-6 year olds',
      description: 'Simple stories and gentle lessons for the youngest hearts',
      color: '#FFB6C1',
      imageFolder: '/images/0-6',
      currentImage: ''
    },
    {
      age: '7-12',
      label: '7-12 year olds',
      description: 'Adventure-filled tales that spark imagination and faith',
      color: '#87CEEB',
      imageFolder: '/images/7-12',
      currentImage: ''
    },
    {
      age: '13-17',
      label: '13-17 year olds',
      description: 'Relevant insights for navigating the teen years with God',
      color: '#DDA0DD',
      imageFolder: '/images/13-17',
      currentImage: ''
    },
    {
      age: 'Adult',
      label: 'Adult',
      description: 'Deep wisdom and practical application for daily life',
      color: '#F0E68C',
      imageFolder: '/images/adult',
      currentImage: ''
    }
  ]);

  // Check subscription status on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setUserEmail(savedEmail);
      checkSubscriptionStatus(savedEmail);
    }
  }, []);

  // Function to check subscription status
  const checkSubscriptionStatus = async (email: string) => {
    try {
      const response = await fetch(`/api/subscribe?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setIsSubscribed(data.subscription.status === 'active');
        setCurrentSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Failed to check subscription:', error);
    }
  };

  // Function to handle subscription
  const handleSubscribe = async (email: string) => {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserEmail(email);
        setIsSubscribed(true);
        localStorage.setItem('userEmail', email);
        setShowSubscriptionModal(false);
        console.log('Subscription successful:', data);
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Subscription failed. Please try again.');
    }
  };

  // Function to get a random image from a folder
  const getRandomImage = async (folderPath: string): Promise<string> => {
    try {
      const response = await fetch(`/api/random-image?folder=${folderPath.split('/').pop()}`);
      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      }
    } catch (error) {
      console.error('Error fetching random image:', error);
    }
    
    // Fallback to placeholder
    return '/api/placeholder-image';
  };

  // Function to refresh all images
  const refreshImages = async () => {
    const updatedGroups = await Promise.all(
      ageGroups.map(async (group) => ({
        ...group,
        currentImage: await getRandomImage(group.imageFolder)
      }))
    );
    setAgeGroups(updatedGroups);
  };

  // Function to refresh a specific age group's image
  const refreshAgeGroupImage = async (age: Age) => {
    setAgeGroups(prev => prev.map(group => 
      group.age === age 
        ? { ...group, currentImage: '' } // Clear current image while loading
        : group
    ));
    
    const group = ageGroups.find(g => g.age === age);
    if (group) {
      const newImage = await getRandomImage(group.imageFolder);
      setAgeGroups(prev => prev.map(g => 
        g.age === age 
          ? { ...g, currentImage: newImage }
          : g
      ));
    }
  };

  // Function to generate content for selected verse and age group
  const generateContent = async (age: Age) => {
    if (!bibleVerse.trim()) {
      alert('Please enter a Bible verse first!');
      return;
    }

    // Check subscription status
    if (!isSubscribed) {
      setShowSubscriptionModal(true);
      return;
    }

    setIsLoading(true);
    setSelectedAge(age);
    setShowContent(true);

    try {
      // Generate both content and image in parallel
      const [contentResponse, imageResponse] = await Promise.all([
        fetch('/api/generate-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            verse: bibleVerse.trim(),
            ageGroup: age
          }),
        }),
        fetch('/api/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            verse: bibleVerse.trim(),
            ageGroup: age
          }),
        })
      ]);

      if (!contentResponse.ok) {
        throw new Error('Failed to generate content');
      }

      const contentData = await contentResponse.json();
      setGeneratedContent(contentData.content);
      
      if (contentData.cached) {
        console.log('Content retrieved from cache!');
      } else {
        console.log('New content generated!');
      }

      // Handle image generation result
      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        if (imageData.success) {
          console.log('Custom image generated successfully!');
          // You can store or display the generated image here
          // For now, we'll just log it
          console.log('Generated image:', imageData.image);
        } else {
          console.log('Image generation failed:', imageData.error);
        }
      } else {
        console.log('Image generation request failed');
      }

    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize images on component mount
  useEffect(() => {
    refreshImages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-purple-600">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-xl">
            Better Bible App
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="/pricing" 
              className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/10"
            >
              Pricing
            </a>
            {isSubscribed ? (
              <div className="flex items-center space-x-3">
                <div className="inline-flex items-center bg-green-500 text-white px-3 py-2 rounded-full text-sm">
                  <span className="mr-2">✓</span>
                  Subscribed
                </div>
                <button
                  onClick={() => setShowSubscriptionManager(true)}
                  className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-full text-sm transition-colors"
                >
                  <span className="mr-2">⚙️</span>
                  Manage
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSubscriptionModal(true)}
                className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full transition-colors"
              >
                <span className="mr-2">🔒</span>
                Subscribe
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="text-center py-8 pt-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Better Bible App
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto px-4">
          Discover God's Word in ways that speak to every age and stage of life
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
        {/* Central Bible Verse */}
        <div className="text-center mb-12">
          <div className="inline-block bg-teal-700 rounded-2xl px-8 py-4 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <input
              type="text"
              value={bibleVerse}
              onChange={(e) => setBibleVerse(e.target.value)}
              placeholder="Enter Bible verse (e.g., John 3:16)"
              className="text-3xl md:text-4xl font-bold text-white bg-transparent border-none outline-none text-center w-full max-w-xs placeholder-white/70"
            />
          </div>
        </div>

        {/* Age Group Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {ageGroups.map((group) => (
            <div
              key={group.age}
              onClick={() => generateContent(group.age)}
              className={`
                relative overflow-hidden rounded-3xl shadow-2xl cursor-pointer transform transition-all duration-300
                ${selectedAge === group.age ? 'scale-105 ring-4 ring-white/50' : 'hover:scale-102'}
                ${!isSubscribed ? 'opacity-75' : ''}
              `}
              style={{ background: `linear-gradient(135deg, ${group.color}20, ${group.color}40)` }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-full"></div>
                <div className="absolute bottom-8 right-8 w-12 h-12 bg-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full"></div>
              </div>

              {/* Content */}
              <div className="relative p-8 text-center">
                {/* Age Label */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {group.label}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {group.description}
                  </p>
                </div>

                {/* Random Image Display */}
                <div className="mb-6 relative">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
                    {group.currentImage ? (
                      <img
                        src={group.currentImage}
                        alt={`${group.label} illustration`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjY0IiB5PSI2NCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjY2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-white/30 flex items-center justify-center">
                        <div className="text-4xl">👼</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Refresh Image Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      refreshAgeGroupImage(group.age);
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-teal-500 hover:bg-teal-600 rounded-full flex items-center justify-center text-white text-sm shadow-lg transition-colors duration-200"
                    title="Get new random image"
                  >
                    🔄
                  </button>
                </div>

                {/* Action Button */}
                <button
                  className={`
                    px-6 py-3 rounded-full font-semibold text-white transition-all duration-300
                    ${selectedAge === group.age 
                      ? 'bg-teal-600 shadow-lg' 
                      : 'bg-teal-500 hover:bg-teal-600 hover:shadow-md'
                    }
                  `}
                >
                  {isLoading && selectedAge === group.age ? 'Generating...' : 'Generate Content'}
                </button>

                {/* Subscription Required Notice */}
                {!isSubscribed && (
                  <div className="mt-3 text-xs text-gray-600">
                    🔒 Subscription required for AI features
                  </div>
                )}
              </div>

              {/* Decorative Wings */}
              <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="absolute top-4 left-4 w-8 h-12 bg-white rounded-full transform rotate-45"></div>
                <div className="absolute top-4 right-4 w-8 h-12 bg-white rounded-full transform -rotate-45"></div>
                <div className="absolute bottom-4 left-4 w-8 h-12 bg-white rounded-full transform -rotate-45"></div>
                <div className="absolute bottom-4 right-4 w-8 h-12 bg-white rounded-full transform rotate-45"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Refresh All Images Button */}
        <div className="text-center mt-8">
          <button
            onClick={refreshImages}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 backdrop-blur-sm"
          >
            🔄 Refresh All Images
          </button>
        </div>

        {/* Generated Content Display */}
        {showContent && (
          <div className="mt-16 bg-white/20 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            {isLoading ? (
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-4">
                  Generating Content for {bibleVerse}...
                </div>
                <div className="text-white/90">
                  Creating age-appropriate content and custom image for {selectedAge} year olds
                </div>
                <div className="mt-4 text-4xl">⏳</div>
              </div>
            ) : generatedContent ? (
              <div className="text-white">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">
                    {bibleVerse} for {generatedContent.ageGroup}
                  </h2>
                  <p className="text-white/90">
                    ✨ AI-generated content and custom image
                  </p>
                </div>

                {/* Generated Image Display */}
                <div className="mb-8 p-6 bg-white/10 rounded-xl text-center">
                  <h3 className="text-xl font-bold mb-3">Custom AI-Generated Image</h3>
                  <div className="w-64 h-64 mx-auto bg-white/20 rounded-lg flex items-center justify-center">
                    <div className="text-4xl">🎨</div>
                    <div className="text-sm text-white/70 ml-2">
                      Image generated for this verse
                    </div>
                  </div>
                  <p className="text-sm text-white/70 mt-2">
                    A unique image created specifically for "{bibleVerse}" and {selectedAge} year olds
                  </p>
                </div>

                {/* Paraphrase */}
                <div className="mb-8 p-6 bg-white/10 rounded-xl">
                  <h3 className="text-xl font-bold mb-3">Simple Explanation</h3>
                  <p className="text-lg leading-relaxed">{generatedContent.paraphrase}</p>
                </div>

                {/* Story */}
                <div className="mb-8 p-6 bg-white/10 rounded-xl">
                  <h3 className="text-xl font-bold mb-3">Story</h3>
                  <p className="text-lg leading-relaxed">{generatedContent.story}</p>
                </div>

                {/* Key Points */}
                <div className="mb-8 p-6 bg-white/10 rounded-xl">
                  <h3 className="text-xl font-bold mb-3">Key Points</h3>
                  <ul className="space-y-2">
                    {generatedContent.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-teal-300 mr-2">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Activities */}
                <div className="mb-8 p-6 bg-white/10 rounded-xl">
                  <h3 className="text-xl font-bold mb-3">Activities</h3>
                  <ul className="space-y-2">
                    {generatedContent.activities.map((activity, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-teal-300 mr-2">🎯</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prayer */}
                <div className="mb-8 p-6 bg-white/10 rounded-xl">
                  <h3 className="text-xl font-bold mb-3">Prayer</h3>
                  <p className="text-lg leading-relaxed italic">{generatedContent.prayer}</p>
                </div>

                {/* Timestamp */}
                <div className="text-center text-white/70 text-sm">
                  Generated on: {new Date(generatedContent.timestamp).toLocaleString()}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Call to Action */}
        {!showContent && (
          <div className="text-center mt-16">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Begin Your Journey?
              </h3>
              <p className="text-white/90 mb-6">
                {isSubscribed 
                  ? 'Enter a Bible verse above, then click on an age group to generate personalized content!'
                  : 'Subscribe for just $1/month to unlock unlimited AI-generated Bible content and custom images!'
                }
              </p>
              {!isSubscribed && (
                <div className="space-y-4 mb-4">
                  <button 
                    onClick={() => setShowSubscriptionModal(true)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg"
                  >
                    🔓 Subscribe Now - $1/month
                  </button>
                  <div>
                    <a 
                      href="/pricing" 
                      className="text-white/80 hover:text-white underline text-sm"
                    >
                      View detailed pricing and features →
                    </a>
                  </div>
                </div>
              )}
              <button className="bg-white text-teal-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                Get Started
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-white/70">
        <p>© 2024 Better Bible App. Making God's Word accessible to all ages.</p>
        {isSubscribed && (
          <p className="mt-2 text-sm">
            Subscribed as: {userEmail} • Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </p>
        )}
      </footer>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscribe={handleSubscribe}
      />

      {/* Subscription Manager */}
      {currentSubscription && showSubscriptionManager && (
        <SubscriptionManager
          subscription={currentSubscription}
          onClose={() => setShowSubscriptionManager(false)}
          onCancel={() => {
            setIsSubscribed(false);
            setCurrentSubscription(null);
            setShowSubscriptionManager(false);
            localStorage.removeItem('userEmail');
          }}
        />
      )}
    </div>
  );
}
