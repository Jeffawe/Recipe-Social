import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from "@/hooks/use-toast"
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';

const AuthModal = () => {
  const { login, register, googleLogin, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const { toast } = useToast();
  const MIN_PASSWORD_LENGTH = 6;

  const validateForm = () => {
    setError('');
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    
    if (!isLogin && !formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    
    if (formData.password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({
          title: "Welcome back!",
          duration: 3000
        });
      } else {
        await register(formData.username, formData.email, formData.password);
        toast({
          title: "Account created successfully!",
          duration: 3000
        });
      }
      setIsOpen(false);
    } catch (error:any) {
      const errorMessage = error?.message || (isLogin ? 
        'Invalid email or password' : 
        'Registration failed. Please try again.');
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 3000
      });
      setError(errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const auth = await google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: async (response) => {
          try {
            await googleLogin(response.access_token);
            setIsOpen(false);
            toast({
              title: "Welcome!",
              duration: 3000
            });
          } catch (error) {
            const errorMessage = "Google sign in failed. Please try again.";
            toast({
              title: "Error",
              description: errorMessage,
              variant: "destructive",
              duration: 3000
            });
            setError(errorMessage);
          }
        },
      });
      auth.requestAccessToken();
    } catch (error) {
      //console.error('Google Sign In Error:', error);
      setError('Google sign in failed. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="text-black"
            onClick={() => setIsLogin(true)}
          >
            Login
          </Button>
          <Button
            onClick={() => setIsLogin(false)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Register
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md text-center text-bold"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle className="text-black text-xl font-bold mb-4">
          {isLogin ? 'Login' : 'Register'}
        </DialogTitle>
        <DialogDescription></DialogDescription>
        <form 
          onSubmit={handleSubmit} 
          className="space-y-4" 
          autoComplete={isLogin ? "on" : "off"}
        >
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username" className="text-black">Username</Label>
              <Input
                id="username"
                className="text-black"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  username: e.target.value.trim()
                }))}
                disabled={isLogin ? isLoading : true}
                autoComplete="username"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-black">Email</Label>
            <Input
              id="email"
              type="email"
              className="text-black"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                email: e.target.value.trim()
              }))}
              disabled={isLogin ? isLoading : true}
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-black">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="text-black pr-10"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
                disabled={isLogin ? isLoading : true}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                minLength={MIN_PASSWORD_LENGTH}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            {!isLogin && (
              <p className="text-sm text-gray-500">
                Password must be at least {MIN_PASSWORD_LENGTH} characters long
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
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
            className="w-full text-black"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Mail className="mr-2 h-4 w-4 text-black" />
            Continue with Google
          </Button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ username: '', email: '', password: '' });
                setShowPassword(false);
              }}
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