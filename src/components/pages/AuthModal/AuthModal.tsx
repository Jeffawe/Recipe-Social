import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from "@/hooks/use-toast"
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';

const AuthModal = () => {
  const { login, register, googleLogin, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!isLogin && formData.password.length < 6) {
        toast({
          title: "Error",
          description: "Password must be at least 6 characters long.",
          variant: "destructive",
          duration: 3000
        });
        setError("Password must be at least 6 characters long.");
        return;
      }

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
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 3000
      });
      setError("Wrong Username or Password");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const auth = await google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: async (response: any) => {
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

  const setIsLoginTrue = () => {
    setIsLogin(true);
  }

  const setIsLoginFalse = () => {
    setIsLogin(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex gap-2">
          <Button variant="outline" className='text-black' onClick={setIsLoginTrue}>Login</Button>
          <Button onClick={setIsLoginFalse} className='bg-orange-500 hover:bg-orange-600'>Register</Button>
        </div>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md text-center text-bold"
        onClick={(e) => e.stopPropagation()} // Prevent event bubbling
      >
        <DialogTitle className='text-black'>{isLogin ? 'Login' : 'Register'}</DialogTitle>
        <DialogDescription></DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete={isLogin ? "on" : "off"} >
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username" className='text-black'>Username</Label>
              <Input
                id="username"
                className='text-black'
                value={formData.username}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  username: e.target.value
                }))}
                disabled={isLogin ? isLoading : true}
                autoComplete="username"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className='text-black'>Email</Label>
            <Input
              id="email"
              type="email"
              className='text-black'
              value={formData.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))}
              disabled={isLogin ? isLoading : true}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className='text-black'>Password</Label>
            <Input
              id="password"
              type="password"
              className='text-black'
              value={formData.password}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                password: e.target.value
              }))}
              disabled={isLogin ? isLoading : true}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            {formData.password && formData.password.length < 6 && (
              <p className="text-sm text-red-500">
                Password must be at least 7 characters long.
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || formData.password.length < 6}
          >
            {isLoading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
          </Button>
          {error &&
            <p className='text-center text-red-500'>{error}</p>
          }

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
            className="w-full text-black"
            onClick={handleGoogleSignIn}
            disabled={isLogin ? isLoading : true}
          >
            <Mail className="mr-2 h-4 w-4 text-black" />
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