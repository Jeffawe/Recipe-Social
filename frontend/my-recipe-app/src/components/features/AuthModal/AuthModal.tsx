import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from "@/hooks/use-toast"

const { toast } = useToast()

const AuthModal = () => {
  const { login, register, googleLogin, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.username, formData.email, formData.password);
      }
      setIsOpen(false);
      toast({
        title: isLogin ? "Welcome back!" : "Account created successfully!",
        duration: 3000
      });
    } catch (error:any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 3000
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const auth = await google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
        scope: 'email profile',
        callback: async (response:any) => {
          try {
            await googleLogin(response.access_token);
            setIsOpen(false);
            toast({
              title: "Welcome!",
              duration: 3000
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "Google sign in failed",
              variant: "destructive",
              duration: 3000
            });
          }
        },
      });
      auth.requestAccessToken();
    } catch (error) {
      console.error('Google Sign In Error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex gap-2">
          <Button variant="outline">Login</Button>
          <Button>Register</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  username: e.target.value
                }))}
                disabled={isLoading}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                password: e.target.value
              }))}
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          <Button 
            type="button"
            variant="outline" 
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Mail className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-500 hover:underline"
              disabled={isLoading}
            >
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;