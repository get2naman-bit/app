import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '../App';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Moon, Sun, User, LogOut, MessageCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-purple-100 dark:border-purple-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">MindMate</span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/community" 
                className={`nav-link ${isActive('/community') ? 'active' : ''}`}
              >
                Community
              </Link>
              {user.user_type === 'student' && (
                <Link 
                  to="/booking" 
                  className={`nav-link ${isActive('/booking') ? 'active' : ''}`}
                >
                  Book Session
                </Link>
              )}
              {user.user_type === 'counsellor' && (
                <Link 
                  to="/counsellor-dashboard" 
                  className={`nav-link ${isActive('/counsellor-dashboard') ? 'active' : ''}`}
                >
                  My Sessions
                </Link>
              )}
              <Link 
                to="/resources" 
                className={`nav-link ${isActive('/resources') ? 'active' : ''}`}
              >
                Resources
              </Link>
              <Link 
                to="/quiz" 
                className={`nav-link ${isActive('/quiz') ? 'active' : ''}`}
              >
                Quizzes
              </Link>
              <Link 
                to="/chatbot" 
                className={`nav-link ${isActive('/chatbot') ? 'active' : ''}`}
              >
                AI Chat
              </Link>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="theme-toggle"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>

            {user ? (
              /* User Menu */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profile_image} alt={user.full_name} />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {user.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 capitalize">
                      {user.user_type}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/about')}>
                    <User className="mr-2 h-4 w-4" />
                    About
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Auth Buttons */
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <div className="px-4 py-2 space-y-1">
            <Link 
              to="/dashboard" 
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/dashboard') 
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/50'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/community" 
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/community') 
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/50'
              }`}
            >
              Community
            </Link>
            {user.user_type === 'student' && (
              <Link 
                to="/booking" 
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/booking') 
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/50'
                }`}
              >
                Book Session
              </Link>
            )}
            <Link 
              to="/resources" 
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/resources') 
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/50'
              }`}
            >
              Resources
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;