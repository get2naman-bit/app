import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar } from '../components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../components/ui/dialog';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Phone, 
  MessageCircle, 
  User, 
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { format, addDays, isBefore, startOfDay } from 'date-fns';

const BookingPage = () => {
  const { user } = useAuth();
  const [counsellors, setCounsellors] = useState([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [sessionType, setSessionType] = useState('video');
  const [bookingData, setBookingData] = useState({
    title: '',
    description: '',
    duration_minutes: 60
  });
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('book');

  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  useEffect(() => {
    fetchCounsellors();
    fetchMyBookings();
  }, []);

  const fetchCounsellors = async () => {
    try {
      const response = await axios.get('/users/counsellors');
      setCounsellors(response.data);
    } catch (error) {
      console.error('Failed to fetch counsellors:', error);
      toast.error('Failed to load counsellors');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const response = await axios.get('/sessions');
      setMyBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Failed to load your bookings');
    }
  };

  const createBooking = async () => {
    if (!selectedCounsellor || !selectedDate || !selectedTime || !bookingData.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const sessionDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      sessionDateTime.setHours(parseInt(hours), parseInt(minutes));

      const bookingPayload = {
        counsellor_id: selectedCounsellor.id,
        title: bookingData.title,
        description: bookingData.description,
        session_date: sessionDateTime.toISOString(),
        duration_minutes: parseInt(bookingData.duration_minutes),
        session_type: sessionType
      };

      await axios.post('/sessions', bookingPayload);
      toast.success('Session booked successfully!');
      
      // Reset form
      setSelectedCounsellor(null);
      setSelectedDate(null);
      setSelectedTime('');
      setBookingData({ title: '', description: '', duration_minutes: 60 });
      setSessionType('video');
      setShowBookingDialog(false);
      
      fetchMyBookings();
    } catch (error) {
      console.error('Failed to create booking:', error);
      toast.error('Failed to book session. Please try again.');
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

  const isDateDisabled = (date) => {
    return isBefore(date, startOfDay(new Date()));
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Counselling Sessions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Book sessions with qualified mental health professionals
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setActiveTab('book')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'book'
              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Book Session
        </button>
        <button
          onClick={() => setActiveTab('my-bookings')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'my-bookings'
              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          My Bookings ({myBookings.length})
        </button>
      </div>

      {activeTab === 'book' ? (
        /* Book Session Tab */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Counsellors List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Available Counsellors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {counsellors.map((counsellor) => (
                <Card 
                  key={counsellor.id}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedCounsellor?.id === counsellor.id 
                      ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                      : ''
                  }`}
                  onClick={() => setSelectedCounsellor(counsellor)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={counsellor.profile_image} />
                        <AvatarFallback className="bg-purple-600 text-white">
                          {counsellor.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{counsellor.full_name}</CardTitle>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                            4.8 (24 reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {counsellor.bio && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {counsellor.bio.length > 100 
                          ? `${counsellor.bio.substring(0, 100)}...` 
                          : counsellor.bio
                        }
                      </p>
                    )}
                    
                    {counsellor.specializations && counsellor.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {counsellor.specializations.slice(0, 3).map((spec, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {counsellor.specializations.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{counsellor.specializations.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Available today</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Online
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Book Your Session</CardTitle>
                <CardDescription>
                  {selectedCounsellor 
                    ? `Booking with ${selectedCounsellor.full_name}`
                    : 'Select a counsellor to continue'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedCounsellor ? (
                  <>
                    {/* Calendar */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Select Date</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={isDateDisabled}
                        className="rounded-md border"
                      />
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Available Times</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              size="sm"
                              variant={selectedTime === time ? "default" : "outline"}
                              onClick={() => setSelectedTime(time)}
                              className="text-xs"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Session Type */}
                    {selectedTime && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Session Type</Label>
                        <Select value={sessionType} onValueChange={setSessionType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">
                              <div className="flex items-center">
                                <Video className="w-4 h-4 mr-2" />
                                Video Call
                              </div>
                            </SelectItem>
                            <SelectItem value="audio">
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2" />
                                Phone Call
                              </div>
                            </SelectItem>
                            <SelectItem value="chat">
                              <div className="flex items-center">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Text Chat
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Book Button */}
                    {selectedTime && (
                      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                        <DialogTrigger asChild>
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Book Session
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Complete Your Booking</DialogTitle>
                            <DialogDescription>
                              Provide session details to complete your booking
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="title">Session Title *</Label>
                              <Input
                                id="title"
                                value={bookingData.title}
                                onChange={(e) => setBookingData({...bookingData, title: e.target.value})}
                                placeholder="e.g., Anxiety Management Session"
                              />
                            </div>
                            <div>
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={bookingData.description}
                                onChange={(e) => setBookingData({...bookingData, description: e.target.value})}
                                placeholder="Describe what you'd like to discuss..."
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="duration">Duration (minutes)</Label>
                              <Select 
                                value={bookingData.duration_minutes.toString()} 
                                onValueChange={(value) => setBookingData({...bookingData, duration_minutes: parseInt(value)})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="30">30 minutes</SelectItem>
                                  <SelectItem value="45">45 minutes</SelectItem>
                                  <SelectItem value="60">60 minutes</SelectItem>
                                  <SelectItem value="90">90 minutes</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={createBooking} className="bg-gradient-to-r from-purple-600 to-pink-600">
                              Confirm Booking
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Select a counsellor to start booking</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* My Bookings Tab */
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Scheduled Sessions</h2>
          
          {myBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Sessions Booked
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You haven't booked any counselling sessions yet.
                </p>
                <Button onClick={() => setActiveTab('book')}>
                  Book Your First Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{booking.title}</CardTitle>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status === 'scheduled' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {booking.status === 'cancelled' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {format(new Date(booking.session_date), 'PPP')}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        {format(new Date(booking.session_date), 'p')} • {booking.duration_minutes} min
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        {getSessionTypeIcon(booking.session_type)}
                        <span className="ml-2 capitalize">{booking.session_type} Session</span>
                      </div>
                      
                      {booking.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {booking.description}
                        </p>
                      )}
                      
                      {booking.status === 'scheduled' && (
                        <div className="pt-3 border-t">
                          <Button size="sm" className="w-full">
                            Join Session
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingPage;