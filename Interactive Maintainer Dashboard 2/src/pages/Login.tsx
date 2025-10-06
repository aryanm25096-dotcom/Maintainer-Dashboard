import { useState } from 'react';
import { Github, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Simulate OAuth login
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
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
            Sign in with your GitHub account to access your maintainer analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-12"
            size="lg"
          >
            {loading ? (
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
          
          <p className="text-center text-muted-foreground mt-6 text-sm">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
