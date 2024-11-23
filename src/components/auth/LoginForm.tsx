import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Alert,
} from '@mui/material';
import { login } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [genericError, setGenericError] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading } = useSelector((state: RootState) => state.auth);

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!email) {
            errors.email = 'L\'email est requis';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'L\'email n\'est pas valide';
        }

        if (!password) {
            errors.password = 'Le mot de passe est requis';
        } else if (password.length < 5) {
            errors.password = 'Le mot de passe doit contenir au moins 5 caractères';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setGenericError(null);
            await dispatch(login({ email, password })).unwrap();
            navigate('/products');
        } catch (_error) {
            console.log(_error)
            setGenericError('Identifiants incorrects');
        }
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                textAlign: 'center',
            }}
        >
            <Box sx={{ width: '100%', maxWidth: 400 }}>
                <Typography component="h1" variant="h5">
                    Connexion
                </Typography>
                {genericError && <Alert severity="error">{genericError}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginForm;