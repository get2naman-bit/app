import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Users, 
  MessageCircle,
  Video,
  Phone,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Star,
  Activity
} from 'lucide-react';
import axios from 'axios';
import { format, isToday, isTomorrow, addDays } from 'date-fns';

const CounsellorDashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    todaySessions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('/sessions');
      const counsellorSessions = response.data;
      setSessions(counsellorSessions);

      // Calculate stats
      const today = new Date();
      const todayStr = format(today, 'yyyy-MM-dd');
      
      setStats({
        totalSessions: counsellorSessions.length,
        upcomingSessions: counsellorSessions.filter(s => 
          s.status === 'scheduled' && new Date(s.session_date) > new Date()
        ).length,
        completedSessions: counsellorSessions.filter(s => s.status === 'completed').length,
        todaySessions: counsellorSessions.filter(s => 
          format(new Date(s.session_date), 'yyyy-MM-dd') === todayStr
        ).length
      });

    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSessionTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Phone className="w-4 h-4" />;
      case 'chat':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatSessionDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd');
  };

  const getUpcomingSessions = () => {
    return sessions
      .filter(session => 
        session.status === 'scheduled' && 
        new Date(session.session_date) > new Date()
      )
      .sort((a, b) => new Date(a.session_date) - new Date(b.session_date))
      .slice(0, 5);
  };

  const getTodaySessions = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return sessions.filter(session => 
      format(new Date(session.session_date), 'yyyy-MM-dd') === today
    ).sort((a, b) => new Date(a.session_date) - new Date(b.session_date));
  };

  const getRecentSessions = () => {
    return sessions
      .filter(session => session.status === 'completed')
      .sort((a, b) => new Date(b.session_date) - new Date(a.session_date))
      .slice(0, 10);
  };

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
      {/* Header */}
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
              Welcome, Dr. {user.full_name.split(' ')[0]}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Counsellor Dashboard - Manage your sessions and support students
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <CheckCircle className="w-3 h-3 mr-1" />
                Available
              </Badge>
              {user.specializations && user.specializations.length > 0 && (
                <Badge variant="outline">
                  Specializes in {user.specializations.join(', ')}
                </Badge>
              )}
            </div>
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
                  Today's Sessions
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.todaySessions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-600" />
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
              <CheckCircle className="w-8 h-8 text-green-600" />
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
              <Star className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Average Rating
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  4.8
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="today" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Today's Schedule</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="recent">Recent Sessions</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Sessions</CardTitle>
                  <CardDescription>
                    {getTodaySessions().length} sessions scheduled for today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {getTodaySessions().length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No sessions scheduled for today</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getTodaySessions().map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                              {getSessionTypeIcon(session.session_type)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {session.title}
                              </h4>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Clock className="w-4 h-4 mr-1" />
                                {format(new Date(session.session_date), 'h:mm a')} • {session.duration_minutes} min
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(session.status)}>
                              {session.status}
                            </Badge>
                            <Button size="sm">Join Session</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                  <CardDescription>
                    Your next {getUpcomingSessions().length} scheduled sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {getUpcomingSessions().length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No upcoming sessions</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getUpcomingSessions().map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                              {getSessionTypeIcon(session.session_type)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {session.title}
                              </h4>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatSessionDate(session.session_date)} • {format(new Date(session.session_date), 'h:mm a')}
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sessions</CardTitle>
                  <CardDescription>
                    Your recently completed sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {getRecentSessions().length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No completed sessions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getRecentSessions().map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                              {getSessionTypeIcon(session.session_type)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {session.title}
                              </h4>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4 mr-1" />
                                {format(new Date(session.session_date), 'MMM dd, yyyy')} • {session.duration_minutes} min
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                View All Students
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Community Messages
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Session Analytics
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Activity className="w-4 h-4 mr-2" />
                Update Availability
              </Button>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
              <CardDescription>
                Your counselling performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sessions Completed</span>
                <span className="font-semibold">{stats.completedSessions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Average Session Rating</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-semibold">4.8</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Students Helped</span>
                <span className="font-semibold">32</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                <span className="font-semibold">&lt; 2 hours</span>
              </div>
            </CardContent>
          </Card>

          {/* Student Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    "Very helpful session. Dr. Smith provided excellent coping strategies for managing anxiety."
                  </p>
                  <p className="text-xs text-gray-500 mt-1">- Anonymous Student</p>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    "Great listener and provided practical advice. Feeling much better after our session."
                  </p>
                  <p className="text-xs text-gray-500 mt-1">- Anonymous Student</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CounsellorDashboard;