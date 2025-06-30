import React, { useState, useEffect } from 'react';
import { Home, Search, Volume2, VolumeX } from 'lucide-react';
import InstrumentGrid from './components/InstrumentGrid';
import InstrumentDetail from './components/InstrumentDetail';
import SearchBar from './components/SearchBar';
import LoadingScreen from './components/LoadingScreen';
import { Instrument } from './types/Instrument';
import { loadInstruments } from './utils/dataLoader';

function App() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [filteredInstruments, setFilteredInstruments] = useState<Instrument[]>([]);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const data = await loadInstruments();
        setInstruments(data);
        setFilteredInstruments(data);
      } catch (error) {
        console.error('Error loading instruments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredInstruments(instruments);
    } else {
      const filtered = instruments.filter(instrument =>
        instrument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instrument.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredInstruments(filtered);
    }
  }, [searchQuery, instruments]);

  const handleInstrumentSelect = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
  };

  const handleBackToHome = () => {
    setSelectedInstrument(null);
    setSearchQuery('');
    setShowSearch(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      {/* Header */}
      <header className="bg-white/20 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToHome}
                className="btn-hover bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300"
                aria-label="Ana sayfa"
              >
                <Home size={24} />
              </button>
              <h1 className="text-2xl font-bold text-white font-rounded">
                Müziğim ve Ben
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSearch}
                className={`btn-hover p-2 rounded-full transition-all duration-300 ${
                  showSearch 
                    ? 'bg-white text-purple-600' 
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
                aria-label="Arama"
              >
                <Search size={24} />
              </button>
              
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`btn-hover p-2 rounded-full transition-all duration-300 ${
                  audioEnabled 
                    ? 'bg-white/20 hover:bg-white/30 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
                aria-label={audioEnabled ? 'Sesi kapat' : 'Sesi aç'}
              >
                {audioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
          <div className="max-w-7xl mx-auto">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Müzik aleti ara..."
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {selectedInstrument ? (
          <InstrumentDetail
            instrument={selectedInstrument}
            onBack={handleBackToHome}
            audioEnabled={audioEnabled}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {searchQuery && (
              <div className="mb-6">
                <p className="text-white/80 text-lg">
                  "{searchQuery}" için {filteredInstruments.length} sonuç bulundu
                </p>
              </div>
            )}
            
            <InstrumentGrid
              instruments={filteredInstruments}
              onInstrumentSelect={handleInstrumentSelect}
            />
            
            {filteredInstruments.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto">
                  <Search size={48} className="text-white/60 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Sonuç bulunamadı
                  </h3>
                  <p className="text-white/80">
                    Aradığınız müzik aleti bulunamadı. Farklı bir terim deneyin.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/80 text-sm">
            Çocuklar için eğitici müzik aletleri uygulaması
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;