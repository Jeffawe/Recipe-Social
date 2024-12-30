import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MyRecipes from './MyRecipes';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfilePage: React.FC = () => {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
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
            <div className="mx-auto px-4 py-8 bg-gradient-to-br from-orange-50 to-white">
                <div className="flex flex-col items-center space-y-4">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-16 w-96" />
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

    const isOwnProfile = currentUser?._id === profile._id;

    return (
        <div className="bg-gradient-to-br from-orange-50 to-white mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto p-6">
                <div className="flex flex-col items-center space-y-4">
                    {/* Profile Picture */}
                    <div className="relative">
                        <img
                            src={profile.profilePicture || '/api/placeholder/128/128'}
                            alt={profile.username}
                            className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
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