import Cookies from 'js-cookie';

export const AUTH_TOKEN_KEY = 'dugo-auth-token';

export const cookies = {
  setAuthToken: (token: string) => {
    if (!token) {
      console.error('Attempted to save empty token');
      return;
    }

    try {
      Cookies.set(AUTH_TOKEN_KEY, token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  },

  getAuthToken: () => {
    try {
      const token = Cookies.get(AUTH_TOKEN_KEY);
      console.log('Retrieved token:', token ? 'exists' : 'not found');
      return token;
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  },

  removeAuthToken: () => {
    try {
      Cookies.remove(AUTH_TOKEN_KEY, { path: '/' });
      console.log('Token removed successfully');
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  },
}; 