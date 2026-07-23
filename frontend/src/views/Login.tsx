import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        `Erro ao fazer login: ${err.response?.data?.detail || err.message || 'Verifique suas credenciais'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '80vh',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Grid container spacing={4} sx={{ maxWidth: '1100px', width: '100%' }}>
        {/* Left column - Branding Info */}
        <Grid item xs={12} lg={6.5} sx={{ display: { xs: 'none', lg: 'block' } }}>
          <Box
            sx={{
              height: '100%',
              borderRadius: '36px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background:
                'linear-gradient(135deg, rgba(255, 67, 163, 0.14), rgba(245, 134, 52, 0.12) 34%, rgba(17, 15, 16, 0.96) 72%)',
              p: 6,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.45em',
                  color: '#FF43A3',
                  fontWeight: 700,
                }}
              >
                Morena Concept
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  mt: 4,
                  fontSize: '3.5rem',
                  lineHeight: 1.05,
                  color: '#ffffff',
                }}
              >
                Imagine a Place com uma operação à altura da marca.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mt: 3,
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.7,
                }}
              >
                Painel redesenhado com atmosfera escura, contraste sofisticado e a paleta oficial do brandbook aplicada em toda a experiência.
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box
                  sx={{
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    background: 'linear-gradient(180deg, rgba(48, 42, 45, 0.92), rgba(28, 24, 26, 0.94))',
                    p: 2.5,
                  }}
                >
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.32em', color: 'rgba(255, 255, 255, 0.4)' }}>
                    Base
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1.5, color: '#ffffff' }}>
                    #373435
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box
                  sx={{
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    background: 'linear-gradient(180deg, rgba(48, 42, 45, 0.92), rgba(28, 24, 26, 0.94))',
                    p: 2.5,
                  }}
                >
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.32em', color: 'rgba(255, 255, 255, 0.4)' }}>
                    Accent
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1.5, color: '#FF43A3' }}>
                    #FF43A3
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box
                  sx={{
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    background: 'linear-gradient(180deg, rgba(48, 42, 45, 0.92), rgba(28, 24, 26, 0.94))',
                    p: 2.5,
                  }}
                >
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.32em', color: 'rgba(255, 255, 255, 0.4)' }}>
                    Energy
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1.5, color: '#F58634' }}>
                    #F58634
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Right column - Login Form Card */}
        <Grid item xs={12} lg={5.5}>
          <Card sx={{ p: { xs: 4, sm: 5 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ mb: 5 }}>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.35em',
                  color: '#FF43A3',
                  fontWeight: 700,
                }}
              >
                Sistema ERP
              </Typography>
              <Typography variant="h3" sx={{ mt: 2, fontSize: '2.5rem', color: '#ffffff' }}>
                Entrar
              </Typography>
              <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary', lineHeight: 1.6 }}>
                Use as credenciais configuradas no backend para acessar a operação da marca.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 4, borderRadius: '16px' }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography
                    sx={{
                      mb: 1,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.26em',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      mb: 1,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.26em',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    Senha
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="password"
                    required
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{
                    mt: 2,
                    py: 1.8,
                    borderRadius: '16px',
                  }}
                >
                  {loading ? 'Conectando...' : 'Acessar painel'}
                </Button>
              </Box>
            </form>

            <Box
              sx={{
                mt: 4,
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.03)',
                p: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3em',
                  color: 'text.secondary',
                  fontWeight: 700,
                }}
              >
                Identidade aplicada
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                Logo, tagline e atmosfera visual alinhadas ao brandbook da MORENA CONCEPT, agora com leitura mais premium e contraste mais escuro.
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
