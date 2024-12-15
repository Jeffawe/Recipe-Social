import React, { useState } from 'react';
import { 
  ChefHat, 
  User, 
  LogOut, 
  Settings, 
  BookOpen 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const NavBar: React.FC = () => {
  const [userImage, setUserImage] = useState('/api/placeholder/40/40');

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <ChefHat className="text-orange-500" size={32} />
          <span className="text-xl font-bold text-gray-800">RecipeHub</span>
        </div>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <img 
              src={userImage} 
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
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavBar;