import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { KeyRound, Mail, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/context/AuthContext';
import ErrorToast from '@/components/ErrorToast';
import DeleteRecipeModal from '@/components/pages/RecipeShowcasePage/DeleteRecipeModal';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const AccountSettings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { user, logout } = useAuth();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Add your password change logic here
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setErrorMessage('Authorization token is missing');
        setIsToastOpen(true);
        return;
      }

      // Make a DELETE request to the API
      const response: any = await axios.delete(`${API_BASE_URL}/auth/delete/${user?._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'api-key': API_KEY,
        },
      });

      console.log('User deleted successfully:', response.data.message);
    logout();
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to delete user');
      setIsToastOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Account & Security</h2>
        <p className="text-gray-500">Manage your account security and preferences</p>
      </div>

      {/* Password Change Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Keep your account secure by using a strong password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input type="password" id="current-password" />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input type="password" id="new-password" />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input type="password" id="confirm-password" />
            </div>
            <Button type="submit" disabled={true}>
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Settings
          </CardTitle>
          <CardDescription>
            Manage your email address and communication preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input type="email" id="email" defaultValue={user?.email} />
            </div>
            <Button disabled={true}>Update Email</Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription>
            Permanently delete your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This action cannot be undone. This will permanently delete your
              account.
            </AlertDescription>
          </Alert>
          <Button variant="destructive" className="mt-4" onClick={(e) => {
            e.stopPropagation();
            setIsDeleteModalOpen(true);
          }}>
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <DeleteRecipeModal
        isOpen={isDeleteModalOpen}
        deleteAction={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      {errorMessage &&
        <ErrorToast
          message={errorMessage}
          isOpen={isToastOpen}
          onClose={() => setIsToastOpen(false)}
          duration={5000} // Toast will disappear after 5 seconds
        />
      }
    </div>
  );
};

export default AccountSettings;