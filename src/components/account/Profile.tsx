import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MyRecipes from './MyRecipes';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '../types/auth';
import ProfileAvatar from './ProfileAvatar';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfilePage: React.FC = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [profile, setProfile] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserProfile = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/auth/${id}`);
            if (!response.ok) throw new Error('Failed to fetch user profile');
            const data = await response.json();
            setProfile(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [id]);

    if (isLoading) {
        return (
            <div className="mx-auto px-10 py-8 bg-gradient-to-br from-orange-50 to-white w-full">
                <div className="flex flex-col items-center space-y-4 max-w-screen-xl mx-auto">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <Skeleton className="h-8 w-full sm:w-1/2 md:w-1/3 lg:w-1/4" />
                    <Skeleton className="h-16 w-full sm:w-3/4 md:w-2/3 lg:w-1/2" />
                </div>
            </div>
        );
    }


    if (error || !profile) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-500">Failed to load profile: {error}</p>
            </div>
        );
    }

    const isOwnProfile = user?._id === profile._id;

    return (
        <div className="bg-gradient-to-br from-orange-50 to-white mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto p-6">
                <div className="flex flex-col items-center space-y-4">
                    {/* Profile Picture */}
                    <div className="relative">
                        <ProfileAvatar
                            imageUrl={user?.profilePicture}
                            name={user?.username || 'User'}
                            size="lg"
                        />
                    </div>

                    {/* User Info */}
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold">{profile.username}</h1>
                        <p className="text-gray-600">{profile.bio}</p>
                        <p className="text-sm text-gray-500">
                            Member since {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Recipes Section */}
            <div className="mt-8">
                <MyRecipes userId={profile._id} isOwnProfile={isOwnProfile} />
            </div>
        </div>
    );
};

export default ProfilePage;