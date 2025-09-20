import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  MessageCircle, 
  Calendar, 
  Users, 
  BookOpen, 
  Heart, 
  Shield,
  Brain,
  Phone
} from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: MessageCircle,
      title: "AI Mental Health Assistant",
      description: "Get instant support and guidance from our AI-powered chatbot available 24/7"
    },
    {
      icon: Calendar,
      title: "Book Counselling Sessions",
      description: "Schedule one-on-one sessions with licensed mental health professionals"
    },
    {
      icon: Users,
      title: "Community Forum",
      description: "Connect with peers, join support groups, and share experiences safely"
    },
    {
      icon: BookOpen,
      title: "Resource Library",
      description: "Access therapeutic videos, guided meditations, and educational content"
    },
    {
      icon: Brain,
      title: "Mental Health Quizzes",
      description: "Take assessments to better understand your mental health needs"
    },
    {
      icon: Heart,
      title: "Mood Tracking",
      description: "Monitor your emotional wellbeing with daily mood check-ins"
    }
  ];

  const helplineNumbers = [
    { name: "National Suicide Prevention Lifeline", number: "988", available: "24/7" },
    { name: "Crisis Text Line", number: "Text HOME to 741741", available: "24/7" },
    { name: "Student Mental Health Crisis", number: "1-800-273-8255", available: "24/7" },
    { name: "Campus Counseling Center", number: "1-555-HELP-NOW", available: "Mon-Fri 9AM-5PM" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 sparkle-text">
              Your Mental Health Matters
            </h1>
            <p className="text-xl lg:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              A comprehensive platform designed specifically for students to access mental health 
              resources, connect with counsellors, and build supportive communities.
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Link to="/register">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            ) : (
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Mental Health Support
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to support your mental wellbeing in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="card hover:scale-105 transition-transform duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Helpline Section */}
      <section className="py-16 bg-red-50 dark:bg-red-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Phone className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">
                Emergency Support
              </h2>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              If you're in crisis, help is available immediately
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {helplineNumbers.map((helpline, index) => (
              <Card key={index} className="border-red-200 dark:border-red-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {helpline.name}
                      </h3>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                        {helpline.number}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Available: {helpline.available}
                      </p>
                    </div>
                    <Phone className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Start Your Mental Health Journey?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found support, community, and healing through MindMate.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Link to="/register">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          ) : (
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Link to="/dashboard">Continue to Platform</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">MindMate</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering students with comprehensive mental health resources, 
                professional counselling, and supportive communities.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="w-4 h-4" />
                <span>Your privacy and wellbeing are our top priority</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/resources" className="hover:text-white transition-colors">Resource Hub</Link></li>
                <li><Link to="/quiz" className="hover:text-white transition-colors">Mental Health Quizzes</Link></li>
                <li><Link to="/chatbot" className="hover:text-white transition-colors">AI Assistant</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="tel:988" className="hover:text-white transition-colors">Crisis Line: 988</a></li>
                <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link to="/booking" className="hover:text-white transition-colors">Book Session</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MindMate. Supporting student mental health with care and compassion.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;