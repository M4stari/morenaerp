import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF43A3', // brand-pink
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F58634', // brand-orange
      contrastText: '#ffffff',
    },
    background: {
      default: '#161314', // brand-ink
      paper: '#211d1f', // brand-panel
    },
    text: {
      primary: '#f4efef', // brand-text
      secondary: '#bdbfc1', // brand-muted
    },
    divider: 'rgba(255, 255, 255, 0.08)', // brand-line
  },
  typography: {
    fontFamily: "'Manrope', 'Segoe UI', sans-serif",
    h1: {
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h2: {
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h3: {
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h4: {
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h5: {
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h6: {
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '0.12em',
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #FF43A3 0%, #F58634 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #e0328b 0%, #db7123 100%)',
          },
        },
        outlinedPrimary: {
          borderColor: 'rgba(255, 67, 163, 0.5)',
          color: '#FF43A3',
          '&:hover': {
            borderColor: '#FF43A3',
            backgroundColor: 'rgba(255, 67, 163, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '28px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(180deg, rgba(39, 34, 36, 0.94), rgba(24, 21, 22, 0.96))',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.24)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '28px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(180deg, rgba(39, 34, 36, 0.98), rgba(24, 21, 22, 0.99))',
          padding: '16px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.08)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF43A3',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          borderRadius: '16px',
        },
      },
    },
  },
});

export default theme;
