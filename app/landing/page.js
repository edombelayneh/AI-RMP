"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Stack, 
  Button, 
  TextField, 
  Typography, 
  ThemeProvider, 
  createTheme,
  CssBaseline,
  Paper,
  Avatar
} from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { keyframes } from '@emotion/react';
import Image from "next/image";

const theme = createTheme({
  palette: {
    primary: {
      main: "#eea7f2", 
    },
    secondary: {
      main: "#a7f2ee",
    },
    accent: {
      main: "#f2d4a7", 
    },
  },
});

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const shimmer = keyframes`
  0% {background-position: -1000px 0;}
  100% {background-position: 1000px 0;}
`;

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey there! I'm Proffy, your go-to source for professor info. What faculty member do you want the scoop on today?"
    },
  ]);
  const [message, setMessage] = useState("");
  const [bubbles, setBubbles] = useState([]);

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

  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    setMessage("");
    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = "";
      return reader.read().then(function processText({ done, value }) {
        if (done) return result;

        const text = decoder.decode(value || new Uint8Array(), {
          stream: true,
        });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });

        return reader.read().then(processText);
      });
    });
  };

  const handleClose = () => {
    router.push('/signin');  
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
        <Button
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 10,
            minWidth: 'auto',
            p: 1,
            color: 'text.secondary',
          }}
        >
          <ExitToAppIcon sx={{ fontSize: 40 }}/>
        </Button>
        <Paper elevation={5} sx={{ width: "500px", height: "600px", p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '8px',
              mb: 4,
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              align="center" 
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                position: 'relative',
                zIndex: 1,
              }}
            >
              Ask Proffy
            </Typography>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
                animation: `${shimmer} 20s infinite`,
                zIndex: 2,
              }}
            />
          </Box>
          <Stack
            direction="column"
            spacing={2}
            sx={{
              flexGrow: 1,
              overflow: "auto",
              mb: 2,
            }}
          >
            {messages.map((message, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={1}
                justifyContent={message.role === "assistant" ? "flex-start" : "flex-end"}
                alignItems="flex-start"
              >
                {message.role === "assistant" && (
                  <Avatar
                    sx={{ width: 40, height: 40, bgcolor: 'transparent' }}
                  >
                    <Image
                      src="/logo.png"
                      alt="Edom Belayneh"
                      width={30}
                      height={30}
                    />
                  </Avatar>
                )}
                <Box
                  bgcolor={message.role === "user" ? "secondary.main" : "accent.main"}
                  color="text.primary"
                  borderRadius={4}
                  p={2}
                  maxWidth="70%"
                >
                  <Typography variant="body1">{message.content}</Typography>
                </Box>
                {message.role === "user" && (
                  <Avatar
                    sx={{ width: 40, height: 40, bgcolor: 'transparent' }}
                  >
                    <Image
                      src="/you.png"  
                      alt="Edom Belayneh"
                      width={30}
                      height={30}
                    />
                  </Avatar>
                )}
              </Stack>
            ))}
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
            />
            <Button 
              variant="contained" 
              onClick={sendMessage}
              sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
            >
              Send
            </Button>
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}