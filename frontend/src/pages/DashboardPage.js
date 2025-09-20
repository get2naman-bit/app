import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Calendar, 
  MessageCircle, 
  Users, 
  BookOpen, 
  Brain, 
  Heart,
  Clock,
  TrendingUp,
  Activity,
  Award
} from 'lucide-react';
import axios from 'axios';
import { format, isToday, isTomorrow, addDays } from 'date-fns';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    upcomingSessions: 0,
    completedSessions: 0,
    communityGroups: 0,
    quizzesCompleted: 0
  });
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentMoodEntries, setRecentMoodEntries] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [sessionsRes, groupsRes, moodRes] = await Promise.all([
        axios.get('/sessions'),
        axios.get('/groups'),
        axios.get('/mood/history')
      ]);

      const sessions = sessionsRes.data;
      const userGroups = groupsRes.data.filter(group => 
        group.members.includes(user.id)
      );

      setUpcomingSessions(
        sessions
          .filter(session => 
            session.status === 'scheduled' && 
            new Date(session.session_date) > new Date()
          )
          .slice(0, 3)
      );

      setGroups(userGroups.slice(0, 4));
      setRecentMoodEntries(moodRes.data.slice(0, 7));

      setStats({
        upcomingSessions: sessions.filter(s => s.status === 'scheduled').length,
        completedSessions: sessions.filter(s => s.status === 'completed').length,
        communityGroups: userGroups.length,
        quizzesCompleted: 5 // Mock data
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSessionDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd');
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      'very-happy': '😄',
      'happy': '😊',
      'neutral': '😐',
      'sad': '😔',
      'very-sad': '😢',
      'anxious': '😰',
      'stressed': '😫',
      'calm': '😌'
    };
    return moodMap[mood] || '😐';
  };

  const quickActions = [
    {
      title: 'Book Session',
      description: 'Schedule a counselling session',
      icon: Calendar,
      href: '/booking',
      color: 'from-blue-600 to-blue-700',
      available: user?.user_type === 'student'
    },
    {
      title: 'Join Community',
      description: 'Connect with peers and support groups',
      icon: Users,
      href: '/community',
      color: 'from-green-600 to-green-700',
      available: true
    },
    {
      title: 'Take Quiz',
      description: 'Assess your mental health',
      icon: Brain,
      href: '/quiz',
      color: 'from-purple-600 to-purple-700',
      available: true
    },
    {
      title: 'AI Assistant',
      description: 'Chat with our mental health bot',
      icon: MessageCircle,
      href: '/chatbot',
      color: 'from-pink-600 to-pink-700',
      available: true
    }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.profile_image} />
            <AvatarFallback className="bg-purple-600 text-white text-xl">
              {user.full_name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.full_name.split(' ')[0]}!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              How are you feeling today? Let's check in on your mental health journey.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Upcoming Sessions
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.upcomingSessions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed Sessions
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.completedSessions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Community Groups
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.communityGroups}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-pink-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Quizzes Completed
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.quizzesCompleted}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Access key features to support your mental health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions
                  .filter(action => action.available)
                  .map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <Link key={index} to={action.href}>
                        <Card className="hover:scale-105 transition-transform cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                                <IconComponent className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {action.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {action.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          {upcomingSessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>
                  Your scheduled counselling appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {session.title}
                          </h4>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatSessionDate(session.session_date)} • {format(new Date(session.session_date), 'h:mm a')}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {session.session_type}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to="/booking">
                    <Button variant="outline" className="w-full">
                      View All Sessions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest interactions with the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Activity className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Joined "Anxiety Support Group"</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Completed Depression Screening Quiz</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <div>
                    <p className="text-sm font-medium">Logged mood: Feeling optimistic</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mood Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Mood Tracker</CardTitle>
              <CardDescription>
                Your emotional journey this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">This week's average</span>
                  <span className="text-2xl">😊</span>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = addDays(new Date(), -6 + i);
                    const moodEntry = recentMoodEntries.find(entry => 
                      format(new Date(entry.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                    );
                    
                    return (
                      <div key={i} className="text-center">
                        <div className="text-xs text-gray-500 mb-1">
                          {format(date, 'EEE').charAt(0)}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm">
                          {moodEntry ? getMoodEmoji(moodEntry.mood) : '·'}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <Link to="/about">
                  <Button variant="outline" className="w-full">
                    Log Today's Mood
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Community Groups */}
          {groups.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Groups</CardTitle>
                <CardDescription>
                  Active community participation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {groups.map((group) => (
                    <div key={group.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{group.name}</p>
                        <p className="text-xs text-gray-500">{group.members.length} members</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to="/community">
                    <Button variant="outline" className="w-full">
                      View All Groups
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mental Health Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>
                Mental health journey milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sessions Completed</span>
                    <span className="text-sm font-medium">{stats.completedSessions}/10</span>
                  </div>
                  <Progress value={(stats.completedSessions / 10) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Weekly Check-ins</span>
                    <span className="text-sm font-medium">5/7</span>
                  </div>
                  <Progress value={71} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Community Engagement</span>
                    <span className="text-sm font-medium">Good</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;