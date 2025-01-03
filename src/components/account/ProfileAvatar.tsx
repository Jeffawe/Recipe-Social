import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface ProfileAvatarProps {
  imageUrl?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

// Size mapping type for better type safety
type SizeMap = {
  [K in Required<ProfileAvatarProps>['size']]: string;
};

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  imageUrl, 
  name = '', 
  size = 'md',
  className = '',
  onClick
}) => {
  // Convert name to initials
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Size classes mapping
  const sizeClasses: SizeMap = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  return (
    <Avatar 
      className={`${sizeClasses[size]} bg-gray-200 ${className}`}
      onClick={onClick}
    >
      <AvatarImage 
        src={imageUrl || undefined} 
        alt={`${name}'s profile picture`}
      />
      <AvatarFallback className="flex items-center justify-center bg-gray-100">
        {name ? (
          <span className="text-gray-600 font-medium">
            {getInitials(name)}
          </span>
        ) : (
          <User className="text-gray-400" />
        )}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;