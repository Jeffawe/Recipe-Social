import React from 'react';
import { useAuth } from './context/AuthContext';
import AuthModal from './features/AuthModal/AuthModal';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import {
  ChefHat,
  User,
  BookOpen,
  Settings,
  LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo Section - Always visible */}
        <Link to="/" className="flex items-center space-x-2">
          <ChefHat className="text-orange-500" size={32} />
          <span className="text-xl font-bold text-gray-800">RecipeSocial</span>
        </Link>

        {/* Authentication Section */}
        {isAuthenticated ? (
          // User is logged in - Show profile dropdown
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <img
                src={user?.profilePicture || '/api/placeholder/40/40'}
                alt="User Profile"
                className="w-10 h-10 rounded-full border-2 border-orange-500 hover:ring-2 hover:ring-orange-300 transition-all"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white shadow-lg rounded-md border">
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                <BookOpen className="mr-2 h-4 w-4" />
                <span>My Recipes</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-50 text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // User is not logged in - Show login/register buttons
          <AuthModal />
        )}
      </div>
    </nav>
  );
};

export default NavBar;