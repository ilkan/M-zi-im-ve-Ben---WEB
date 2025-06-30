import React from 'react';
import { Music } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-pulse-slow">
            <Music size={48} className="text-white" />
          </div>
          <div className="absolute inset-0 w-24 h-24 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4 font-rounded">
          Müziğim ve Ben
        </h1>
        
        <p className="text-white/80 text-lg mb-8">
          Müzik aletleri yükleniyor...
        </p>
        
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;