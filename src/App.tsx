import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { theme } from './theme';

// Composants
import { Navbar } from './components/layout/Navbar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import { ProductList } from './components/products/ProductList';

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Box
                        sx={{
                            minHeight: '100vh',
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            paddingTop: '64px', // Ajuster la hauteur en fonction de la taille de la barre de navigation
                        }}
                    >
                        <Navbar />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center', // Centre verticalement
                                alignItems: 'center', // Centre horizontalement
                                flex: 1, // Prend tout l'espace restant disponible
                                padding: '2rem',
                            }}
                        >
                            <Box sx={{ width: '100%', maxWidth: '1200px' }}>
                                <Routes>
                                    <Route path="/login" element={<LoginForm />} />
                                    <Route path="/register" element={<RegisterForm />} />
                                    <Route
                                        path="/products"
                                        element={
                                            <ProtectedRoute>
                                                <ProductList />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route path="/" element={<Navigate to="/products" replace />} />
                                </Routes>
                            </Box>
                        </Box>
                    </Box>
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    );
}

export default App;