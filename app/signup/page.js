"use client";

import { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  ThemeProvider, 
  createTheme,
  CssBaseline,
  Stack
} from '@mui/material';
import { keyframes } from '@emotion/react';
import { useRouter } from 'next/navigation';

const theme = createTheme({
  palette: {
    primary: {
      main: "#eea7f2", // Pastel purple
    },
    secondary: {
      main: "#a7f2ee", // Pastel cyan
    },
    accent: {
      main: "#f2d4a7", // Pastel orange
    },
  },
});

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailSignIn, setIsEmailSignIn] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [bubbles, setBubbles] = useState([]);
  const [error, setError] = useState('');

  const handleSignUp = async (event) => {
      event.preventDefault();
      if (password.length <= 5) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    
      try {
          await createUserWithEmailAndPassword(auth, email, password);
          router.push('/landing'); 
      } catch (error) {
        let errorMessage = 'An error occurred. Please try again.';
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak. Please choose a stronger password.';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'An account already exists with this email address.';
            break;
          default:
            errorMessage = 'Failed to sign up. Please check your details and try again.';
        }
        setError(errorMessage);
      }
    };

    const handleSignIn = async (event) => {
      router.push('/signin')
    }

    useEffect(() => {
      createBubbles();
      window.addEventListener('resize', createBubbles);
      return () => window.removeEventListener('resize', createBubbles);
    }, []);

    const createBubbles = () => {
      const newBubbles = [];
      const bubbleCount = Math.floor(window.innerWidth / 50);
      for (let i = 0; i < bubbleCount; i++) {
        newBubbles.push({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          size: `${Math.random() * 40 + 20}px`,
          animationDuration: `${Math.random() * 10 + 5}s`,
        });
      }
      setBubbles(newBubbles);
    };

    const handleGoogleSignIn = async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        console.log('User signed in with Google:', result.user);
        router.push('/landing');
      } catch (error) {
        console.error('Error signing in with Google:', error);
      }
    };

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            width: '100vw',
            bgcolor: 'primary.main',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {bubbles.map((bubble) => (
            <Box
              key={bubble.id}
              sx={{
                position: 'absolute',
                borderRadius: '50%',
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                animation: `${float} ${bubble.animationDuration} infinite ease-in-out`,
                left: bubble.left,
                top: bubble.top,
                width: bubble.size,
                height: bubble.size,
              }}
            />
          ))}
          <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center" width="auto" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb:2, ml:4 }} >
                <img 
                  src="/logo.png"
                  alt="Edom Belayneh"
                  style={{
                    width: '50px',
                    height: 'auto',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.5)'
                  }} 
                  />
                  <Typography variant="h4" component="h1" align="center" color="primary" gutterBottom>
                    ProffyAI Sign Up
                  </Typography>
              </Stack>
              
              {!isEmailSignIn ? (
                <Button 
                  variant="contained" 
                  color="secondary" 
                  fullWidth 
                  onClick={handleGoogleSignIn}
                  sx={{ mb: 2 }}
                >
                  Sign In with Google
                </Button>
              ) : (
                <Box component="form" onSubmit={handleSignUp} noValidate sx={{ mt: 1 }}>
                  
                
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                  />
                  {error && <Typography color="error">{error}</Typography>}
                  <Button
                    onClick={handleSignUp}
                    type="button"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
              <Button
                fullWidth
                variant="contained"
                sx={{ bgcolor: 'accent.main', '&:hover': { bgcolor: 'accent.dark' } }}
                onClick={() => setIsEmailSignIn(!isEmailSignIn)}
              >
                {isEmailSignIn ? 'Sign in with Google' : 'Sign up with Email/Password'}
              </Button>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  color="secondary"
                  onMouseEnter={() => setShowTip(true)}
                  onMouseLeave={() => setShowTip(false)}
                >
                  Need Help?
                </Button>
                {showTip && (
                  <Paper sx={{ p: 1, mt: 1 }}>
                    <Typography variant="body2" color="white">
                      Tip: Make sure to use a strong, unique password!
                    </Typography>
                  </Paper>
                )}
              </Box>
              <Button
                    fullWidth
                    variant="text"
                    onClick={handleSignIn}
                    >
                    Already have an account? Sign In
                  </Button> 
            </Paper>
          </Container>
          <Box sx={{ mt: 2, color: 'white', textAlign: 'center', zIndex: 10 }}>
            <Typography variant="body2">
              © 2024 ProffyAI. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    );
}

export default SignUpPage;
