import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import SpotifyService from '../../services/spotifyService';

const SongCard = ({ song, index, onPlay }) => {
  const artistNames = song.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist';
  const duration = SpotifyService.formatDuration(song.duration_ms);

  const handleSpotifyOpen = () => {
    if (song.external_urls?.spotify) {
      window.open(song.external_urls.spotify, '_blank');
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-between group">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <div className="bg-purple-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold flex-shrink-0">
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-semibold truncate">{song.name}</h3>
          <p className="text-purple-200 text-sm truncate">{artistNames} • {song.album?.name}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 flex-shrink-0">
        <span className="text-purple-200 text-sm hidden sm:inline">{duration}</span>
        <div className="flex space-x-2">
          {onPlay && (
            <button 
              onClick={() => onPlay(song)}
              className="bg-green-500 hover:bg-green-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
              title="Play preview"
            >
              <Play size={16} className="text-white" />
            </button>
          )}
          <button 
            onClick={handleSpotifyOpen}
            className="bg-green-500 hover:bg-green-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
            title="Open in Spotify"
          >
            <ExternalLink size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
