// src/pages/MoodPage.jsx - Updated for your FastAPI backend
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Music, Sparkles, LogOut, RefreshCw, Heart, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import LoadingSpinner from '../common/LoadingSpinner';
import SongCard from '../common/SongCard';
import GradientButton from '../common/GradientButton';
import PageLayout from '../layout/PageLayout';
import SpotifyService from '../../services/spotifyService';

const MoodPage = () => {
  const navigate = useNavigate();
  const { user, logout, setError } = useApp();
  const [moodText, setMoodText] = useState('');
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedMood, setDetectedMood] = useState('');

  const handleMoodSubmit = async () => {
    if (!moodText.trim()) return;

    setIsLoading(true);
    setDetectedMood('');
    setPlaylist(null);

    try {
      // Call your backend's /playlist endpoint
      const playlistData = await SpotifyService.getMoodPlaylist(moodText);
      
      setPlaylist(playlistData);
      
      // Extract mood from playlist name (e.g., "Happy Vibes" -> "Happy")
      const moodFromName = playlistData.playlist_name.replace(' Vibes', '');
      setDetectedMood(moodFromName);
      
    } catch (error) {
      console.error('Error getting mood playlist:', error);
      const errorMessage = SpotifyService.handleApiError(error);
      setError(errorMessage);
      
      // If session expired, redirect to login
      if (errorMessage.includes('session expired') || errorMessage.includes('log in again')) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setMoodText('');
    setPlaylist(null);
    setDetectedMood('');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && moodText.trim()) {
      e.preventDefault();
      handleMoodSubmit();
    }
  };

  // Mood suggestions that work well with your sentiment analysis
  const moodSuggestions = [
    "I'm feeling really happy and energetic today! 😊",
    "I'm sad and need some comforting music 😢",
    "Feeling neutral and relaxed, just want to chill 😌",
    "I'm excited and ready to conquer the world! 🚀",
    "Feeling a bit down and nostalgic 😔",
    "Super motivated and pumped up! 💪",
    "Just want to dance and have fun! 🕺",
    "Feeling peaceful and contemplative 🧘"
  ];

  const handleSuggestionClick = (suggestion) => {
    setMoodText(suggestion);
  };

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      'happy': '😊',
      'sad': '😢',
      'neutral': '😌',
      'excited': '🚀',
      'energetic': '⚡',
      'relaxed': '🧘',
      'motivated': '💪',
      'peaceful': '🕊️'
    };
    return moodEmojis[mood.toLowerCase()] || '🎵';
  };

  return (
    <PageLayout background="from-indigo-900 via-purple-900 to-pink-900">
      <div className="min-h-screen">
        {/* Header */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <User size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Welcome back!</p>
                <p className="text-purple-200 text-sm">
                  {user?.display_name || user?.name || `User ${user?.id?.substring(0, 8)}...`}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How are you feeling?
            </h1>
            <p className="text-purple-200 text-lg md:text-xl max-w-2xl mx-auto">
              Describe your current mood and our AI will analyze your feelings to create the perfect playlist
            </p>
          </div>

          {/* Mood Input Section */}
          <div className="max-w-3xl mx-auto">
            <div className="glass-card rounded-3xl p-6 md:p-8 shadow-2xl mb-8">
              <div className="mb-6">
                <label htmlFor="mood-input" className="block text-white font-semibold mb-3">
                  Tell us about your mood:
                </label>
                <textarea
                  id="mood-input"
                  value={moodText}
                  onChange={(e) => setMoodText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Express how you're feeling... (e.g., I'm feeling really happy and energetic today, or I'm sad and need some comfort)"
                  className="w-full h-32 bg-white/20 border border-white/30 rounded-xl p-4 text-white placeholder-purple-200 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-purple-300 text-sm">
                    {moodText.length}/500 characters
                  </span>
                  <span className="text-purple-300 text-sm">
                    Press Enter to submit
                  </span>
                </div>
              </div>

              {/* Mood Suggestions */}
              <div className="mb-6">
                <p className="text-white font-semibold mb-3">Or try one of these:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {moodSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <GradientButton
                onClick={handleMoodSubmit}
                disabled={!moodText.trim() || isLoading}
                variant="gradient"
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size={24} />
                    <span>Analyzing your mood...</span>
                  </>
                ) : (
                  <>
                    <Zap size={24} />
                    <span>Generate My Mood Playlist</span>
                  </>
                )}
              </GradientButton>
            </div>

            {/* Results Section */}
            {playlist && (
              <div className="glass-card rounded-3xl p-6 md:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                    <Heart className="mr-3 text-pink-400" />
                    {playlist.playlist_name}
                  </h2>
                  <button
                    onClick={handleTryAgain}
                    className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all duration-300"
                  >
                    <RefreshCw size={16} />
                    <span className="hidden sm:inline">Try Again</span>
                  </button>
                </div>

                {/* Mood Analysis Display */}
                {detectedMood && (
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <span className="text-3xl">{getMoodEmoji(detectedMood)}</span>
                      <h3 className="text-xl font-semibold text-white">
                        Detected Mood: {detectedMood}
                      </h3>
                    </div>
                    <p className="text-purple-100 text-center text-sm">
                      <span className="font-semibold">Your input:</span> "{moodText}"
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {playlist.tracks.map((song, index) => (
                    <SongCard 
                      key={song.id || index} 
                      song={song} 
                      index={index}
                      onPlay={(song) => {
                        // Handle play functionality if needed
                        console.log('Opening Spotify for:', song.name);
                      }}
                    />
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <p className="text-purple-200 text-sm mb-4">
                    Found {playlist.tracks.length} songs that match your {detectedMood.toLowerCase()} mood
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <GradientButton
                      onClick={handleTryAgain}
                      variant="secondary"
                      size="md"
                    >
                      <Music size={20} />
                      <span>Try Different Mood</span>
                    </GradientButton>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !playlist && (
              <div className="text-center py-12">
                <Music size={64} className="text-white/30 mx-auto mb-4" />
                <p className="text-purple-200 text-lg">
                  Share your mood above to discover your perfect AI-generated playlist
                </p>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-purple-300 text-sm">
                  <div className="text-center">
                    <Zap size={24} className="mx-auto mb-2 text-yellow-400" />
                    <p>AI-Powered Analysis</p>
                  </div>
                  <div className="text-center">
                    <Music size={24} className="mx-auto mb-2 text-green-400" />
                    <p>Spotify Integration</p>
                  </div>
                  <div className="text-center col-span-2 md:col-span-1">
                    <Heart size={24} className="mx-auto mb-2 text-pink-400" />
                    <p>Personalized Results</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MoodPage;