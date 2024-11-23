import { createTheme } from '@mui/material';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#2563eb',
            light: '#60a5fa',
            dark: '#1d4ed8',
        },
        secondary: {
            main: '#ec4899',
            light: '#f472b6',
            dark: '#db2777',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
            letterSpacing: '-0.02em',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: '8px',
                },
            },
        },
    },
});