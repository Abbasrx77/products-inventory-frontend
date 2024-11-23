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
    Grid,
} from '@mui/material';
import { register } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nom: '',
        prenom: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { error, loading } = useSelector((state: RootState) => state.auth);

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.email) {
            errors.email = 'L\'email est requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'L\'email n\'est pas valide';
        }

        if (!formData.password) {
            errors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 5) { // Changement 6 à 5
            errors.password = 'Le mot de passe doit contenir au moins 5 caractères';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        if (!formData.nom) {
            errors.nom = 'Le nom est requis';
        }

        if (!formData.prenom) {
            errors.prenom = 'Le prénom est requis';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Effacer l'erreur du champ modifié
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            // Utiliser _ pour indiquer que confirmPassword est intentionnellement non utilisé
            const { confirmPassword: _, ...registerData } = formData;
            console.log(_)
            await dispatch(register(registerData)).unwrap();
            navigate('/products');
        } catch (_error) {
            console.log(_error)
        }
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Centre verticalement
                alignItems: 'center', // Centre horizontalement
                height: '100%', // Prend toute la hauteur disponible
                textAlign: 'center', // S'assure que le texte est centré
            }}
        >
            <Box sx={{ width: '100%', maxWidth: 400 }}>
                <Typography component="h1" variant="h5">
                    Inscription
                </Typography>
                {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="prenom"
                                required
                                fullWidth
                                label="Prénom"
                                autoFocus
                                value={formData.prenom}
                                onChange={handleChange}
                                error={!!formErrors.prenom}
                                helperText={formErrors.prenom}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="nom"
                                required
                                fullWidth
                                label="Nom"
                                value={formData.nom}
                                onChange={handleChange}
                                error={!!formErrors.nom}
                                helperText={formErrors.nom}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="email"
                                required
                                fullWidth
                                label="Adresse email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!formErrors.email}
                                helperText={formErrors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="password"
                                required
                                fullWidth
                                label="Mot de passe"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!formErrors.password}
                                helperText={formErrors.password}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="confirmPassword"
                                required
                                fullWidth
                                label="Confirmer le mot de passe"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={!!formErrors.confirmPassword}
                                helperText={formErrors.confirmPassword}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        onClick={() => navigate('/login')}
                    >
                        Déjà un compte ? Se connecter
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterForm;