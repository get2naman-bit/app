import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
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
  Users, 
  Search, 
  MessageCircle, 
  Plus, 
  Send, 
  UserPlus,
  Crown,
  Heart,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const CommunityPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('groups');
  const [groups, setGroups] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchUsers, setSearchUsers] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    group_type: 'support',
    is_public: true
  });

  useEffect(() => {
    fetchGroups();
    fetchConversations();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      toast.error('Failed to load groups');
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/messages/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupMessages = async (groupId) => {
    try {
      const response = await axios.get(`/groups/${groupId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const searchUsersHandler = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await axios.get(`/users/search?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  };

  const createGroup = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newGroup.name);
      formData.append('description', newGroup.description);
      formData.append('group_type', newGroup.group_type);
      formData.append('is_public', newGroup.is_public);

      await axios.post('/groups', formData);
      toast.success('Group created successfully!');
      setShowCreateGroup(false);
      setNewGroup({ name: '', description: '', group_type: 'support', is_public: true });
      fetchGroups();
    } catch (error) {
      console.error('Failed to create group:', error);
      toast.error('Failed to create group');
    }
  };

  const joinGroup = async (groupId) => {
    try {
      await axios.post(`/groups/${groupId}/join`);
      toast.success('Joined group successfully!');
      fetchGroups();
    } catch (error) {
      console.error('Failed to join group:', error);
      toast.error('Failed to join group');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const formData = new FormData();
      formData.append('content', newMessage);
      
      if (selectedGroup) {
        formData.append('group_id', selectedGroup.id);
      } else if (selectedConversation) {
        formData.append('receiver_id', selectedConversation.user.id);
      }

      await axios.post('/messages', formData);
      setNewMessage('');
      
      if (selectedGroup) {
        fetchGroupMessages(selectedGroup.id);
      } else {
        fetchConversations();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const startConversation = async (userId) => {
    try {
      const formData = new FormData();
      formData.append('content', 'Hi! I found you through the community search.');
      formData.append('receiver_id', userId);

      await axios.post('/messages', formData);
      toast.success('Conversation started!');
      fetchConversations();
      setActiveTab('messages');
    } catch (error) {
      console.error('Failed to start conversation:', error);
      toast.error('Failed to start conversation');
    }
  };

  const getGroupTypeIcon = (type) => {
    switch (type) {
      case 'support':
        return <Heart className="w-4 h-4" />;
      case 'therapy':
        return <Shield className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getGroupTypeBadge = (type) => {
    const colors = {
      support: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      therapy: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      general: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    
    return (
      <Badge className={colors[type] || colors.general}>
        {getGroupTypeIcon(type)}
        <span className="ml-1 capitalize">{type}</span>
      </Badge>
    );
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
          Community Hub
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Connect with peers, join support groups, and build meaningful relationships
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="search">Search</TabsTrigger>
            </TabsList>

            <TabsContent value="groups" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Support Groups</h3>
                <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Group</DialogTitle>
                      <DialogDescription>
                        Create a new support group for the community
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Group Name</label>
                        <Input
                          value={newGroup.name}
                          onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                          placeholder="Enter group name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Input
                          value={newGroup.description}
                          onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                          placeholder="Describe the group purpose"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Type</label>
                        <select
                          value={newGroup.group_type}
                          onChange={(e) => setNewGroup({ ...newGroup, group_type: e.target.value })}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="support">Support Group</option>
                          <option value="therapy">Therapy Group</option>
                          <option value="general">General Discussion</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={createGroup}>Create Group</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {groups.map((group) => (
                    <Card 
                      key={group.id} 
                      className={`cursor-pointer transition-colors ${
                        selectedGroup?.id === group.id 
                          ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => {
                        setSelectedGroup(group);
                        setSelectedConversation(null);
                        fetchGroupMessages(group.id);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">{group.name}</h4>
                          {getGroupTypeBadge(group.group_type)}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {group.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {group.members.length} members
                          </span>
                          {!group.members.includes(user.id) && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                joinGroup(group.id);
                              }}
                            >
                              Join
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="messages" className="space-y-4">
              <h3 className="text-lg font-semibold">Direct Messages</h3>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {conversations.map((conversation, index) => (
                    <Card 
                      key={index}
                      className={`cursor-pointer transition-colors ${
                        selectedConversation?.user?.id === conversation.user?.id 
                          ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => {
                        setSelectedConversation(conversation);
                        setSelectedGroup(null);
                        setMessages(conversation.messages || []);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={conversation.user?.profile_image} />
                            <AvatarFallback className="bg-purple-600 text-white">
                              {conversation.user?.full_name?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {conversation.user?.full_name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {conversation.last_message?.content}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="search" className="space-y-4">
              <h3 className="text-lg font-semibold">Find People</h3>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search users by name or username..."
                  value={searchUsers}
                  onChange={(e) => {
                    setSearchUsers(e.target.value);
                    searchUsersHandler(e.target.value);
                  }}
                />
              </div>
              
              <ScrollArea className="h-[350px]">
                <div className="space-y-2">
                  {searchResults.map((searchUser) => (
                    <Card key={searchUser.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={searchUser.profile_image} />
                              <AvatarFallback className="bg-purple-600 text-white">
                                {searchUser.full_name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{searchUser.full_name}</p>
                              <p className="text-xs text-gray-500">@{searchUser.username}</p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {searchUser.user_type === 'counsellor' && <Crown className="w-3 h-3 mr-1" />}
                                {searchUser.user_type}
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => startConversation(searchUser.id)}
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Connect
                          </Button>
                        </div>
                        {searchUser.bio && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 pl-13">
                            {searchUser.bio}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            {selectedGroup || selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    {selectedGroup ? (
                      <>
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                          {getGroupTypeIcon(selectedGroup.group_type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{selectedGroup.name}</CardTitle>
                          <CardDescription>
                            {selectedGroup.members.length} members • {selectedGroup.description}
                          </CardDescription>
                        </div>
                      </>
                    ) : (
                      <>
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={selectedConversation.user?.profile_image} />
                          <AvatarFallback className="bg-purple-600 text-white">
                            {selectedConversation.user?.full_name?.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{selectedConversation.user?.full_name}</CardTitle>
                          <CardDescription>@{selectedConversation.user?.username}</CardDescription>
                        </div>
                      </>
                    )}
                  </div>
                </CardHeader>

                <Separator />

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id}
                        className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] p-3 rounded-lg ${
                          message.sender_id === user.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender_id === user.id ? 'text-purple-200' : 'text-gray-500'
                          }`}>
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator />

                {/* Message Input */}
                <div className="p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Select a Conversation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Choose a group or direct message to start chatting
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;