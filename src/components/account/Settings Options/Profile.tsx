import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Camera, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '@/components/context/AuthContext';
import ProfileAvatar from '../ProfileAvatar';
import ErrorToast from '@/components/ErrorToast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfileSettings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [error, setError] = useState('')
  const { user, setUser } = useAuth();

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const displayName = (document.getElementById('display-name') as HTMLInputElement).value;
    const bio = (document.getElementById('bio') as HTMLTextAreaElement).value;

    const updatedData = {
      username: displayName || user?.username,
      bio: bio || user?.bio
    };

    try {
      const response = await fetch(`${API_BASE_URL}/users/${user?._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();

      setUser(updatedUser);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
      setIsToastOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile Settings</h2>
        <p className="text-gray-500">Manage your public profile information</p>
      </div>

      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Profile Picture
          </CardTitle>
          <CardDescription>
            Choose a profile picture that will be visible to other users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <ProfileAvatar
              imageUrl={user?.profilePicture}
              name={user?.username || 'User'}
              size="lg"
            />
            <div className="space-y-2">
              <Button>Upload New Picture</Button>
              <p className="text-sm text-gray-500">
                Recommended: Square image, at least 400x400 pixels
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Tell others about yourself
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <Label htmlFor="display-name">Display Name</Label>
              <Input id="display-name" placeholder={user?.username || "Your display name"} />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder={user?.bio || "Tell us about yourself and your cooking journey..."}
                className="h-32"
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Social Links
          </CardTitle>
          <CardDescription>
            Connect your social media profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="website">Personal Website</Label>
              <Input id="website" type="url" placeholder="https://" />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" placeholder="@username" />
            </div>
            <div>
              <Label htmlFor="youtube">YouTube Channel</Label>
              <Input id="youtube" placeholder="Channel URL" />
            </div>
            <Button disabled={true}>Save Social Links</Button>
          </div>
        </CardContent>
      </Card>

      <ErrorToast
        message={error}
        isOpen={isToastOpen}
        onClose={() => setIsToastOpen(false)}
        duration={5000}
      />
    </div>
  );
};

export default ProfileSettings;