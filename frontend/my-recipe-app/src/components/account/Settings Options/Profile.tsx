import React from 'react';
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

const ProfileSettings = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { user } = useAuth();

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Add your profile update logic here
    setTimeout(() => setIsSubmitting(false), 1000);
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
            <img
              src={user?.profilePicture || '/api/placeholder/128/128'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
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
    </div>
  );
};

export default ProfileSettings;