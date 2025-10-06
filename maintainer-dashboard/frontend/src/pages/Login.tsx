import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Loader2, Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useApp } from '../contexts/AppContext';
import apiService from '../services/apiService';

export function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMethod, setLoginMethod] = useState('github'); // 'github' or 'credentials'
  const navigate = useNavigate();
  const { login, setUser } = useApp();

  // Handle GitHub OAuth login
  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // For demo purposes, use the demo login
      // In production, this would redirect to GitHub OAuth
      const response = await apiService.demoLogin();
      
      if (response.success) {
        setUser(response.user);
        navigate('/overview');
      } else {
        setError('GitHub login failed');
      }
    } catch (err) {
      setError('GitHub login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle credentials login
  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // For demo purposes, use mock credentials
      if (credentials.username === 'maintainer' && credentials.password === 'password') {
        const response = await apiService.demoLogin();
        if (response.success) {
          setUser(response.user);
          navigate('/overview');
        } else {
          setError('Login failed');
        }
      } else {
        setError('Invalid credentials. Use username: maintainer, password: password');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-chart-1/5">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <Github className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Maintainer Dashboard</CardTitle>
          <CardDescription>
            Sign in to access your maintainer analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Login Method Toggle */}
          <div className="flex space-x-2 mb-4">
            <Button
              variant={loginMethod === 'github' ? 'default' : 'outline'}
              onClick={() => setLoginMethod('github')}
              className="flex-1"
              size="sm"
            >
              GitHub
            </Button>
            <Button
              variant={loginMethod === 'credentials' ? 'default' : 'outline'}
              onClick={() => setLoginMethod('credentials')}
              className="flex-1"
              size="sm"
            >
              Credentials
            </Button>
          </div>

          {loginMethod === 'github' ? (
            // GitHub OAuth Login
            <Button
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className="w-full h-12"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Github className="mr-2 h-5 w-5" />
                  Sign in with GitHub
                </>
              )}
            </Button>
          ) : (
            // Credentials Login Form
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    className="pl-10"
                    value={credentials.username}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={credentials.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          )}
          
          {/* Demo credentials info */}
          {loginMethod === 'credentials' && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Demo Credentials:</strong><br />
                Username: maintainer<br />
                Password: password
              </p>
            </div>
          )}
          
          <p className="text-center text-muted-foreground mt-6 text-sm">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
