// src/pages/LoginPage.jsx - Updated for your FastAPI backend
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Heart, Headphones, Sparkles, ArrowRight, Zap, Brain, Radio } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GradientButton from '../common/GradientButton';
import PageLayout from '../layout/PageLayout';
import FloatingNotes from '../layout/FloatingNotes';
import SpotifyService from '../../services/spotifyService';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setLoading, setError } = useApp();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/mood');
    }
  }, [isAuthenticated, navigate]);

  const handleSpotifyLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      // This will redirect to your backend's /login endpoint
      await SpotifyService.initiateLogin();
    } catch (error) {
      setError(SpotifyService.handleApiError(error));
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="absolute inset-0 bg-black/20"></div>
      <FloatingNotes />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-lg w-full">
          <div className="glass-card rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-full">
                  <Headphones size={48} className="text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="gradient-text">MoodTunes</span>
              </h1>
              <p className="text-blue-200 text-lg">
                AI-powered music that matches your soul
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-4 text-blue-200">
                <Brain size={20} />
                <span>Smart Mood Analysis</span>
                <Sparkles size={20} />
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center space-x-3 mb-2">
                    <Zap className="text-yellow-400" size={20} />
                    <span className="text-white font-semibold text-sm">AI Sentiment Analysis</span>
                  </div>
                  <p className="text-blue-200 text-xs">
                    Our AI analyzes your mood description to understand exactly how you feel
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center space-x-3 mb-2">
                    <Music className="text-green-400" size={20} />
                    <span className="text-white font-semibold text-sm">Spotify Integration</span>
                  </div>
                  <p className="text-blue-200 text-xs">
                    Get real songs from Spotify that perfectly match your current mood
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center space-x-3 mb-2">
                    <Heart className="text-pink-400" size={20} />
                    <span className="text-white font-semibold text-sm">Personalized Playlists</span>
                  </div>
                  <p className="text-blue-200 text-xs">
                    Every playlist is unique, crafted based on your specific emotions
                  </p>
                </div>
              </div>

              {/* Login Button */}
              <GradientButton 
                onClick={handleSpotifyLogin} 
                className="w-full"
                variant="primary"
                size="lg"
              >
                <Music size={24} />
                <span>Connect with Spotify</span>
                <ArrowRight size={20} />
              </GradientButton>

              <p className="text-blue-300 text-sm leading-relaxed">
                Connect your Spotify account to start getting AI-powered mood-based music recommendations
              </p>

              {/* How it works */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-white font-semibold mb-4 text-sm">How it works:</h3>
                <div className="space-y-3 text-xs text-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
                    <span>Describe how you're feeling in your own words</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
                    <span>Our AI analyzes your mood (happy, sad, neutral, etc.)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
                    <span>Get a curated playlist from Spotify matching your vibe</span>
                  </div>
                </div>
              </div>

              {/* Privacy note */}
              <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-blue-200 text-xs">
                  <span className="font-semibold">Privacy:</span> We only access your Spotify profile and music preferences. Your mood descriptions help us create better playlists just for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LoginPage;