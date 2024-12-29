import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import {
  Shield,
  User,
  Palette,
  HelpCircle,
  ChefHat
} from 'lucide-react';

const SettingsLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navigationItems = [
    {
      name: 'Account & Security',
      path: '/settings/account',
      icon: Shield,
      description: 'Manage your account details and security preferences'
    },
    {
      name: 'Profile',
      path: '/settings/profile',
      icon: User,
      description: 'Edit your public profile information'
    },
    {
      name: 'Cooking Preferences',
      path: '/settings/cooking',
      icon: ChefHat,
      description: 'Set your dietary restrictions and cooking preferences'
    },
    {
      name: 'Appearance',
      path: '/settings/appearance',
      icon: Palette,
      description: 'Customize how RecipeSocial looks'
    },
    {
      name: 'Help & Support',
      path: '/settings/help',
      icon: HelpCircle,
      description: 'Get help and contact support'
    }
  ];

  useEffect(() => {
    if (location.pathname === '/settings') {
      navigate('/settings/account');
    }
  }, [location.pathname, navigate]);

  return (
    <div className="mx-auto px-4 py-8 bg-gradient-to-br from-orange-50 to-white">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-colors duration-200
                    ${isActive 
                      ? 'bg-orange-50 text-orange-600' 
                      : 'hover:bg-gray-50 text-gray-700'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm text-gray-500 hidden md:inline">
                      {item.description}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          <Card className="p-6">
            <Outlet />
          </Card>
        </main>
      </div>
    </div>
  );
};

export default SettingsLayout;