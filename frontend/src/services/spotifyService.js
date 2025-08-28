// src/services/spotifyService.js - Integrated with your FastAPI backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/';
const API_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://192.168.11.105:5173/';

class SpotifyService {
  // Start the Spotify OAuth flow
  static async initiateLogin() {
    try {
      window.location.href = `${API_BASE_URL}/login`;
    } catch (error) {
      throw new Error('Failed to initiate login: ' + error.message);
    }
  }

  // Handle the callback from Spotify (this would be called by your callback page)
  static async handleCallback(code, state) {
    console.log('Handling callback with code:', code, 'and state:', state);
    try {
      const response = await fetch(`${API_BASE_URL}/callback?code=${code}&state=${state}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Authentication failed');
      }

      const data = await response.json();
      console.log('Callback response:', data);
      
      // Store the JWT token
      if (data.access_token) {
        localStorage.setItem('jwt_token', data.access_token);
      }

      return {
        message: data.message,
        accessToken: data.access_token,
        tokenType: data.token_type
      };
    } catch (error) {
      throw new Error('Authentication failed: ' + error.message);
    }
  }

  // Generate mood-based playlist using your /playlist endpoint
  static async getMoodPlaylist(moodText) {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/playlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          text: moodText 
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, redirect to login
          localStorage.removeItem('jwt_token');
          throw new Error('Session expired. Please log in again.');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to generate playlist');
      }

      const playlistData = await response.json();
      
      // Transform the data to match frontend expectations
      return {
        playlist_name: playlistData.playlist_name,
        tracks: playlistData.songs.map(song => ({
          id: song.spotify_url.split('/').pop(), // Extract ID from URL
          name: song.title,
          artists: [{ name: song.artist }],
          album: { name: 'Unknown Album' }, // Your backend doesn't return album info
          duration_ms: 180000, // Default duration since not provided
          external_urls: { spotify: song.spotify_url }
        })),
        total: playlistData.songs.length
      };
    } catch (error) {
      console.error('Mood playlist API error:', error);
      throw error;
    }
  }

  // Logout user
  static async logout() {
    try {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always remove token from localStorage
      localStorage.removeItem('jwt_token');
    }
  }

  // Check if user is authenticated
  static isAuthenticated() {
    const token = localStorage.getItem('jwt_token');
    if (!token) return false;

    try {
      // Basic JWT expiration check (you can make this more robust)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        localStorage.removeItem('jwt_token');
        return false;
      }
      
      return true;
    } catch (error) {
      localStorage.removeItem('jwt_token');
      return false;
    }
  }

  // Get current user info from JWT token
  static getCurrentUserInfo() {
    const token = localStorage.getItem('jwt_token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        spotifyId: payload.sub,
        // Add any other user info you want to display
      };
    } catch (error) {
      return null;
    }
  }

  // Utility function to format duration (in case you add it later)
  static formatDuration(durationMs) {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Utility function to format artists
  static formatArtists(artists) {
    if (!artists || !Array.isArray(artists)) return 'Unknown Artist';
    return artists.map(artist => artist.name).join(', ');
  }

  // Error handling helper
  static handleApiError(error) {
    console.error('Spotify API Error:', error);
    
    if (error.message.includes('Session expired') || error.message.includes('401')) {
      return 'Your session has expired. Please log in again.';
    }
    
    if (error.message.includes('Network')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    if (error.message.includes('Failed to generate')) {
      return 'Unable to generate playlist. Please try a different mood description.';
    }
    
    return error.message || 'An unexpected error occurred. Please try again.';
  }

  // Get user's Spotify profile (if you want to add this endpoint later)
  static async getUserProfile() {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // This would require a new endpoint in your backend: /user/profile
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user profile');
      }

      return await response.json();
    } catch (error) {
      // Return mock data based on JWT for now
      return this.getCurrentUserInfo();
    }
  }
}

export default SpotifyService;