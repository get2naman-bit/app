import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Heart, 
  Smile, 
  Meh, 
  Frown, 
  Brain,
  Activity,
  Users,
  Shield,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const AboutPage = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [todayMoodLogged, setTodayMoodLogged] = useState(false);

  const moods = [
    { 
      id: 'very-happy', 
      emoji: '😄', 
      label: 'Very Happy', 
      description: 'Feeling fantastic and energetic!',
      color: 'from-green-400 to-green-600'
    },
    { 
      id: 'happy', 
      emoji: '😊', 
      label: 'Happy', 
      description: 'Feeling good and positive',
      color: 'from-green-300 to-green-500'
    },
    { 
      id: 'calm', 
      emoji: '😌', 
      label: 'Calm', 
      description: 'Peaceful and relaxed',
      color: 'from-blue-300 to-blue-500'
    },
    { 
      id: 'neutral', 
      emoji: '😐', 
      label: 'Neutral', 
      description: 'Feeling okay, nothing special',
      color: 'from-gray-300 to-gray-500'
    },
    { 
      id: 'anxious', 
      emoji: '😰', 
      label: 'Anxious', 
      description: 'Feeling worried or nervous',
      color: 'from-yellow-300 to-yellow-500'
    },
    { 
      id: 'sad', 
      emoji: '😔', 
      label: 'Sad', 
      description: 'Feeling down or low',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      id: 'stressed', 
      emoji: '😫', 
      label: 'Stressed', 
      description: 'Feeling overwhelmed',
      color: 'from-orange-400 to-orange-600'
    },
    { 
      id: 'very-sad', 
      emoji: '😢', 
      label: 'Very Sad', 
      description: 'Feeling really down',
      color: 'from-red-400 to-red-600'
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "Mental Health Assessments",
      description: "Professional-grade quizzes and screenings to help understand your mental health status"
    },
    {
      icon: Users,
      title: "Peer Support Community",
      description: "Connect with other students, share experiences, and find support in our safe community spaces"
    },
    {
      icon: Activity,
      title: "Progress Tracking",
      description: "Monitor your mental health journey with mood tracking, session logs, and progress insights"
    },
    {
      icon: Shield,
      title: "Professional Counselling",
      description: "Access licensed mental health professionals for one-on-one counselling sessions"
    }
  ];

  const contacts = [
    {
      icon: Phone,
      title: "Crisis Hotline",
      detail: "988 (24/7 Support)",
      description: "Immediate help for mental health emergencies"
    },
    {
      icon: Mail,
      title: "Support Email",
      detail: "support@mindmate.com",
      description: "General inquiries and platform support"
    },
    {
      icon: MapPin,
      title: "Campus Office",
      detail: "Student Health Center, Room 205",
      description: "In-person support and consultations"
    }
  ];

  useEffect(() => {
    checkTodayMood();
  }, []);

  const checkTodayMood = async () => {
    try {
      const response = await axios.get('/mood/history');
      const today = new Date().toISOString().split('T')[0];
      const todayEntry = response.data.find(entry => 
        entry.date.split('T')[0] === today
      );
      if (todayEntry) {
        setTodayMoodLogged(true);
        setSelectedMood(todayEntry.mood);
        setSelectedEmoji(todayEntry.emoji);
      }
    } catch (error) {
      console.error('Failed to check today mood:', error);
    }
  };

  const logMood = async (mood) => {
    try {
      const formData = new FormData();
      formData.append('mood', mood.id);
      formData.append('emoji', mood.emoji);

      await axios.post('/mood', formData);
      
      setSelectedMood(mood.id);
      setSelectedEmoji(mood.emoji);
      setTodayMoodLogged(true);
      
      toast.success(`Mood logged: ${mood.label}. Thank you for checking in!`);
    } catch (error) {
      console.error('Failed to log mood:', error);
      toast.error('Failed to log mood. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About MindMate
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Your comprehensive platform for student mental health support, 
          designed to provide accessible resources, professional guidance, 
          and a supportive community for your wellness journey.
        </p>
      </div>

      {/* Mood Check-in Section */}
      <Card className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-purple-800 dark:text-purple-200">
            How are you feeling today?
          </CardTitle>
          <CardDescription className="text-purple-600 dark:text-purple-300">
            {todayMoodLogged 
              ? "Thanks for checking in today! Your mood has been logged." 
              : "Take a moment to check in with yourself"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayMoodLogged ? (
            <div className="text-center space-y-4">
              <div className="text-6xl">{selectedEmoji}</div>
              <p className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                Today you're feeling: {moods.find(m => m.id === selectedMood)?.label}
              </p>
              <p className="text-purple-600 dark:text-purple-300">
                {moods.find(m => m.id === selectedMood)?.description}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => logMood(mood)}
                  className="mood-emoji p-4 text-center hover:scale-105 transition-all duration-200 rounded-xl border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600"
                >
                  <div className="text-4xl mb-2">{mood.emoji}</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {mood.label}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          <div className="text-center mt-6">
            <p className="text-sm text-purple-600 dark:text-purple-400 mb-4">
              Want to learn more about yourself?
            </p>
            <Link to="/quiz">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Brain className="w-4 h-4 mr-2" />
                Take a Quiz to Know More
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Mission Statement */}
      <Card className="mb-12">
        <CardContent className="p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              At MindMate, we believe that mental health support should be accessible, 
              comprehensive, and tailored to the unique challenges faced by students. 
              Our platform combines evidence-based therapeutic resources, professional counselling services, 
              and peer support communities to create a holistic approach to mental wellness. 
              We're committed to reducing stigma, promoting awareness, and empowering students 
              to take control of their mental health journey with confidence and support.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Get Help When You Need It
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contacts.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {contact.title}
                  </h3>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {contact.detail}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {contact.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Privacy and Safety */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-8">
          <div className="flex items-start space-x-4">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-3">
                Your Privacy & Safety Matter
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                We take your privacy seriously. All conversations, assessments, and personal information 
                are protected with industry-standard encryption and security measures. Our platform 
                complies with FERPA and HIPAA guidelines to ensure your data remains confidential.
              </p>
              <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                <li>• End-to-end encryption for all communications</li>
                <li>• Secure data storage with regular backups</li>
                <li>• Anonymous options for community participation</li>
                <li>• 24/7 crisis intervention protocols</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Explore our resources and connect with our supportive community
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/community">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Users className="w-5 h-5 mr-2" />
              Join Community
            </Button>
          </Link>
          <Link to="/booking">
            <Button size="lg" variant="outline">
              <Activity className="w-5 h-5 mr-2" />
              Book Session
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;