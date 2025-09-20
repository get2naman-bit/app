import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Heart,
  Brain,
  Lightbulb,
  Clock,
  RefreshCw
} from 'lucide-react';

const ChatbotPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello ${user?.full_name.split(' ')[0]}! I'm MindBot, your AI mental health companion. I'm here to provide support, resources, and a listening ear whenever you need it. How are you feeling today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample conversation starters
  const conversationStarters = [
    "I'm feeling anxious today",
    "Can you help me with stress management?",
    "I'm having trouble sleeping",
    "I feel overwhelmed with school",
    "Tell me about mindfulness exercises",
    "I need motivation tips"
  ];

  // Sample bot responses based on keywords
  const botResponses = {
    anxiety: [
      "I understand that anxiety can be overwhelming. Here are some quick techniques that might help: Try the 4-7-8 breathing technique - breathe in for 4 counts, hold for 7, exhale for 8. This can help calm your nervous system.",
      "Anxiety is very common among students. Have you tried grounding techniques? Try naming 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
      "When anxiety strikes, remember that it's temporary. Consider practicing mindfulness or reaching out to a counselor if these feelings persist. Would you like me to share some specific coping strategies?"
    ],
    stress: [
      "Stress management is crucial for mental wellbeing. Some effective strategies include: regular exercise, maintaining a consistent sleep schedule, breaking large tasks into smaller ones, and practicing relaxation techniques.",
      "It sounds like you're dealing with a lot right now. Remember, it's okay to ask for help. Have you considered time management techniques like the Pomodoro method or prioritizing tasks by urgency and importance?",
      "Stress can affect both your mind and body. Make sure you're taking care of basic needs - proper nutrition, hydration, and rest. Sometimes a short walk or deep breathing can provide immediate relief."
    ],
    sleep: [
      "Sleep issues are incredibly common, especially among students. Here are some tips for better sleep hygiene: avoid screens 1 hour before bed, keep your room cool and dark, and try to maintain consistent sleep and wake times.",
      "Trouble sleeping can often be related to stress or anxiety. Consider creating a relaxing bedtime routine - perhaps some light reading, gentle stretching, or meditation. Avoid caffeine after 2 PM.",
      "Poor sleep can affect your mental health significantly. If sleep problems persist, it might be worth speaking with a healthcare provider. In the meantime, try progressive muscle relaxation or guided sleep meditations."
    ],
    overwhelmed: [
      "Feeling overwhelmed is a sign that you're taking on a lot. Let's break this down - what are the main things causing you to feel this way? Sometimes writing them down can help you see what's manageable.",
      "When everything feels like too much, focus on one thing at a time. What's the most urgent task you need to handle today? Start there, and remember that it's okay to ask for extensions or help when needed.",
      "Being overwhelmed often means you care deeply about doing well. That's admirable, but don't forget to be kind to yourself. Consider what you can delegate, postpone, or remove from your plate entirely."
    ],
    mindfulness: [
      "Mindfulness is a wonderful practice for mental health! Start with just 5 minutes a day. Try focusing on your breath - notice the sensation of air entering and leaving your body without trying to change it.",
      "Here's a simple mindfulness exercise: Sit comfortably and observe your thoughts without judgment, like clouds passing in the sky. When your mind wanders (and it will!), gently bring attention back to the present moment.",
      "Mindfulness can be practiced anywhere! Try mindful walking - focus on each step, the feeling of your feet touching the ground, and the sounds around you. Even washing dishes can become a mindfulness practice."
    ],
    motivation: [
      "Motivation can be tricky - it comes and goes. Instead of relying only on motivation, try building small, consistent habits. What's one tiny step you could take toward your goal today?",
      "Remember why you started. Sometimes reconnecting with your deeper 'why' can reignite motivation. Also, celebrate small wins - they compound over time and build momentum.",
      "It's normal for motivation to fluctuate. During low periods, focus on self-compassion and maintaining basic routines. Sometimes the best thing you can do is rest and recharge."
    ],
    default: [
      "Thank you for sharing that with me. It takes courage to reach out when you're struggling. Can you tell me more about what's on your mind?",
      "I hear you, and I want you to know that your feelings are valid. What would be most helpful for you to talk about right now?",
      "It sounds like you're going through something difficult. Remember that seeking support is a sign of strength. Would you like some specific strategies to help with what you're experiencing?",
      "I'm here to listen and support you. Sometimes just talking through our thoughts and feelings can provide relief. What's been weighing on your mind lately?"
    ]
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('anxiety') || message.includes('anxious') || message.includes('worried')) {
      return botResponses.anxiety[Math.floor(Math.random() * botResponses.anxiety.length)];
    } else if (message.includes('stress') || message.includes('overwhelmed') || message.includes('pressure')) {
      return message.includes('overwhelmed') 
        ? botResponses.overwhelmed[Math.floor(Math.random() * botResponses.overwhelmed.length)]
        : botResponses.stress[Math.floor(Math.random() * botResponses.stress.length)];
    } else if (message.includes('sleep') || message.includes('insomnia') || message.includes('tired')) {
      return botResponses.sleep[Math.floor(Math.random() * botResponses.sleep.length)];
    } else if (message.includes('mindful') || message.includes('meditation') || message.includes('calm')) {
      return botResponses.mindfulness[Math.floor(Math.random() * botResponses.mindfulness.length)];
    } else if (message.includes('motivation') || message.includes('lazy') || message.includes('procrastination')) {
      return botResponses.motivation[Math.floor(Math.random() * botResponses.motivation.length)];
    } else {
      return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const useConversationStarter = (starter) => {
    setInputMessage(starter);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: `Hello ${user?.full_name.split(' ')[0]}! I'm MindBot, your AI mental health companion. I'm here to provide support, resources, and a listening ear whenever you need it. How are you feeling today?`,
        timestamp: new Date()
      }
    ]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          AI Mental Health Assistant
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Chat with MindBot for 24/7 mental health support and resources
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with conversation starters */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Quick Topics
              </CardTitle>
              <CardDescription>
                Click to start a conversation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {conversationStarters.map((starter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start text-sm h-auto py-2 px-3"
                    onClick={() => useConversationStarter(starter)}
                  >
                    {starter}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 text-sm mb-1">
                    Remember
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 text-xs">
                    This is an AI assistant for support and information only. 
                    For urgent concerns, please contact a crisis hotline or mental health professional.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            {/* Chat Header */}
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">MindBot</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <CardDescription>Always available to help</CardDescription>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={clearChat}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear Chat
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-[80%] ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-purple-600' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' 
                            ? 'text-purple-200' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Press Enter to send • This AI provides general support and information only
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Features Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">24/7 Availability</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get support anytime, day or night
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Evidence-Based</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Responses based on mental health best practices
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Personalized Support</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tailored responses to your specific needs
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatbotPage;