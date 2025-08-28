// src/pages/CallbackPage.jsx - Fixed version
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Music, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import LoadingSpinner from '../common/LoadingSpinner';
import PageLayout from '../layout/PageLayout';
import SpotifyService from '../../services/spotifyService';

const CallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setError, setLoading } = useApp();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('');
  const [hasProcessed, setHasProcessed] = useState(false); // Prevent multiple runs

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed) return;

    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      console.log('Processing callback with:', { code, state, error });

      // Handle OAuth errors
      if (error) {
        setStatus('error');
        setMessage(`Spotify authorization failed: ${error}`);
        setError(`Spotify authorization failed: ${error}`);
        setHasProcessed(true);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Handle missing code
      if (!code) {
        setStatus('error');
        setMessage('Authorization code not received');
        setError('Authorization code not received');
        setHasProcessed(true);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        setLoading(true);
        
        // Your backend handles the token exchange
        const authData = await SpotifyService.handleCallback(code, state);
        console.log('Auth data received:', authData);
        
        // Get user info from the JWT token using your existing method
        const userInfo = SpotifyService.getCurrentUserInfo();
        console.log('User info from JWT:', userInfo);
        
        if (userInfo && userInfo.id) {
          setUser({
            id: userInfo.id,
            spotifyId: userInfo.spotifyId,
            name: userInfo.spotifyId,
            display_name: userInfo.spotifyId,
            accessToken: authData.accessToken
          });
        } else {
          // Fallback: just store the token and minimal user info
          setUser({
            id: 'user',
            spotifyId: 'user', 
            name: 'Spotify User',
            display_name: 'Spotify User',
            accessToken: authData.accessToken
          });
        }
        
        setStatus('success');
        setMessage('Successfully connected to Spotify!');
        setHasProcessed(true);
        
        // Redirect to mood page after success
        setTimeout(() => navigate('/mood'), 1500);
        
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        const errorMessage = error.message || 'Authentication failed';
        setMessage(errorMessage);
        setError(errorMessage);
        setHasProcessed(true);
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, []); // Empty dependency array - only run once

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <>
            <div className="mb-8">
              <div className="mb-4 flex justify-center">
                <LoadingSpinner size={64} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Connecting to Spotify</h2>
              <p className="text-green-200">Authorizing your account...</p>
            </div>
            <div className="flex justify-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-green-100 text-sm">
                Processing your Spotify authorization...
              </p>
            </div>
          </>
        );

      case 'success':
        return (
          <>
            <div className="mb-8">
              <div className="mb-4 flex justify-center">
                <div className="bg-green-500 p-4 rounded-full animate-pulse">
                  <CheckCircle size={64} className="text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Successfully Connected!</h2>
              <p className="text-green-200">Redirecting you to create your mood playlist...</p>
            </div>
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-100 text-sm">
                {message}
              </p>
              <p className="text-green-100 text-xs mt-2">
                You can now get personalized music recommendations based on your mood!
              </p>
            </div>
          </>
        );

      case 'error':
        return (
          <>
            <div className="mb-8">
              <div className="mb-4 flex justify-center">
                <div className="bg-red-500 p-4 rounded-full">
                  <AlertCircle size={64} className="text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Connection Failed</h2>
              <p className="text-red-200">There was an issue connecting your Spotify account.</p>
            </div>
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-100 text-sm">
                <strong>Error:</strong> {message}
              </p>
              <p className="text-red-100 text-xs mt-2">
                Redirecting you back to login page in a few seconds...
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300"
            >
              Return to Login Now
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <PageLayout background="from-green-600 via-blue-600 to-purple-600">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md glass-card rounded-3xl p-8 shadow-2xl">
          {renderContent()}
        </div>
      </div>
    </PageLayout>
  );
};

export default CallbackPage;