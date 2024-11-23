import api from './api';
import axios from "axios";

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    email: string;
    password: string;
    nom: string;
    prenom: string;
}

interface AuthResponse {
    user: {
        id: string;
        email: string;
        nom: string;
        prenom: string;
    };
    token: string;
}

const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try {
            const response = await api.post<AuthResponse>('/users/authentication', credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Échec de la connexion');
            }
            throw new Error('Erreur de connexion au serveur');
        }
    },

    register: async (userData: RegisterData): Promise<AuthResponse> => {
        try {
            const response = await api.post<AuthResponse>('/users', userData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Échec de l\'inscription');
            }
            throw new Error('Erreur de connexion au serveur');
        }
    },

    logout: async (): Promise<void> => {
        try {
            await api.post('/api/v1/users/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    getCurrentUser: (): { id: string; email: string; nom: string; prenom: string } | null => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    isAuthenticated: (): boolean => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return !!(token && user);
    }
};

export default authService;