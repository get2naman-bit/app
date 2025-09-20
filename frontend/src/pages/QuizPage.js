import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { 
  Brain, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Heart,
  Shield,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const QuizPage = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
    setQuizResult(null);
  };

  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeQuiz = () => {
    // Calculate results based on quiz type
    let result = calculateQuizResult();
    setQuizResult(result);
    setQuizCompleted(true);
    toast.success('Quiz completed! Review your results below.');
  };

  const calculateQuizResult = () => {
    const totalQuestions = selectedQuiz.questions.length;
    const answerValues = Object.values(answers);
    
    // Simple scoring system (0-3 points per question)
    let totalScore = 0;
    answerValues.forEach(answer => {
      if (answer === 'Never') totalScore += 0;
      else if (answer === 'Sometimes' || answer === 'Rarely') totalScore += 1;
      else if (answer === 'Often' || answer === 'Somewhat') totalScore += 2;
      else if (answer === 'Always' || answer === 'Very much') totalScore += 3;
    });

    const percentage = (totalScore / (totalQuestions * 3)) * 100;
    
    let level, description, color, recommendations;
    
    if (selectedQuiz.category === 'anxiety') {
      if (percentage < 25) {
        level = 'Low';
        description = 'Your anxiety levels appear to be within normal range.';
        color = 'text-green-600';
        recommendations = [
          'Continue practicing good self-care',
          'Maintain regular exercise and sleep schedule',
          'Stay connected with supportive relationships'
        ];
      } else if (percentage < 50) {
        level = 'Mild';
        description = 'You may be experiencing mild anxiety symptoms.';
        color = 'text-yellow-600';
        recommendations = [
          'Consider learning stress management techniques',
          'Practice mindfulness and deep breathing',
          'Talk to friends, family, or a counselor'
        ];
      } else if (percentage < 75) {
        level = 'Moderate';
        description = 'You may be experiencing moderate anxiety symptoms.';
        color = 'text-orange-600';
        recommendations = [
          'Consider speaking with a mental health professional',
          'Explore therapy options like CBT',
          'Join support groups or communities'
        ];
      } else {
        level = 'High';
        description = 'You may be experiencing significant anxiety symptoms.';
        color = 'text-red-600';
        recommendations = [
          'We strongly recommend consulting a mental health professional',
          'Consider both therapy and medical evaluation',
          'Reach out to crisis resources if needed'
        ];
      }
    } else if (selectedQuiz.category === 'depression') {
      if (percentage < 25) {
        level = 'Minimal';
        description = 'Your mood appears to be stable.';
        color = 'text-green-600';
        recommendations = [
          'Keep up with healthy habits',
          'Stay socially connected',
          'Continue activities you enjoy'
        ];
      } else if (percentage < 50) {
        level = 'Mild';
        description = 'You may be experiencing mild depressive symptoms.';
        color = 'text-yellow-600';
        recommendations = [
          'Focus on self-care activities',
          'Maintain social connections',
          'Consider talking to someone you trust'
        ];
      } else if (percentage < 75) {
        level = 'Moderate';
        description = 'You may be experiencing moderate depressive symptoms.';
        color = 'text-orange-600';
        recommendations = [
          'Consider professional counseling',
          'Explore therapy options',
          'Don\'t hesitate to reach out for support'
        ];
      } else {
        level = 'Severe';
        description = 'You may be experiencing significant depressive symptoms.';
        color = 'text-red-600';
        recommendations = [
          'Please consult a mental health professional soon',
          'Consider both therapy and medical evaluation',
          'Reach out to support systems and crisis resources'
        ];
      }
    }

    return {
      score: totalScore,
      maxScore: totalQuestions * 3,
      percentage: Math.round(percentage),
      level,
      description,
      color,
      recommendations
    };
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
    setQuizResult(null);
  };

  const getQuizIcon = (category) => {
    switch (category) {
      case 'anxiety':
        return <AlertCircle className="w-6 h-6" />;
      case 'depression':
        return <Heart className="w-6 h-6" />;
      default:
        return <Brain className="w-6 h-6" />;
    }
  };

  const getQuizColor = (category) => {
    switch (category) {
      case 'anxiety':
        return 'from-orange-500 to-red-500';
      case 'depression':
        return 'from-blue-500 to-indigo-500';
      default:
        return 'from-purple-500 to-pink-500';
    }
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

  if (selectedQuiz && !quizCompleted) {
    const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;
    const question = selectedQuiz.questions[currentQuestion];

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Quiz Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={resetQuiz}>
              ← Back to Quizzes
            </Button>
            <Badge variant="secondary">
              Question {currentQuestion + 1} of {selectedQuiz.questions.length}
            </Badge>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {selectedQuiz.title}
          </h1>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQuestion] || ''}
              onValueChange={handleAnswerChange}
              className="space-y-4"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="text-lg cursor-pointer flex-1 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          <Button 
            onClick={nextQuestion}
            disabled={!answers[currentQuestion]}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            {currentQuestion === selectedQuiz.questions.length - 1 ? 'Complete Quiz' : 'Next'}
          </Button>
        </div>
      </div>
    );
  }

  if (quizCompleted && quizResult) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Completed!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Here are your {selectedQuiz.title} results
          </p>
        </div>

        {/* Results Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className={`text-6xl font-bold ${quizResult.color} mb-2`}>
              {quizResult.percentage}%
            </div>
            <CardTitle className="text-2xl mb-2">
              {quizResult.level} Level
            </CardTitle>
            <CardDescription className="text-lg">
              {quizResult.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Your Score</span>
                <span className="text-sm font-medium">{quizResult.score}/{quizResult.maxScore}</span>
              </div>
              <Progress value={quizResult.percentage} className="h-3" />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {quizResult.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {quizResult.percentage > 50 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                        Consider Professional Support
                      </h4>
                      <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                        Based on your results, it may be helpful to speak with a mental health professional. 
                        Remember, seeking help is a sign of strength, not weakness.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={resetQuiz} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Take Another Quiz
          </Button>
          
          {user.user_type === 'student' && (
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
              Book Counselling Session
            </Button>
          )}
          
          <Button variant="outline">
            Share with Counsellor
          </Button>
        </div>
      </div>
    );
  }

  // Quiz Selection View
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Mental Health Assessments
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Take evidence-based assessments to better understand your mental health. 
          These tools can help identify areas where you might benefit from additional support.
        </p>
      </div>

      {/* Disclaimer */}
      <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Important Notice
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                These assessments are for informational purposes only and do not constitute a medical diagnosis. 
                If you're experiencing mental health concerns, please consult with a qualified healthcare professional. 
                In case of emergency, contact your local crisis hotline or emergency services.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${getQuizColor(quiz.category)} rounded-lg flex items-center justify-center`}>
                  {getQuizIcon(quiz.category)}
                </div>
                <div>
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {quiz.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 mb-4">
                {quiz.description}
              </CardDescription>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  ~{Math.ceil(quiz.questions.length * 0.5)} min
                </div>
                <div>
                  {quiz.questions.length} questions
                </div>
              </div>
              
              <Button 
                onClick={() => startQuiz(quiz)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Need More Support?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          If you're concerned about your mental health, don't hesitate to reach out for professional help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600">
            Book Counselling Session
          </Button>
          <Button size="lg" variant="outline">
            Join Support Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;