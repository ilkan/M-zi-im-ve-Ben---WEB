import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Search, Volume2, VolumeX } from 'lucide-react';
import InstrumentGrid from './components/InstrumentGrid';
import InstrumentDetail from './components/InstrumentDetail';
import SearchBar from './components/SearchBar';
import LoadingScreen from './components/LoadingScreen';
import LanguageSwitcher from './components/LanguageSwitcher';
import { Instrument } from './types/Instrument';
import { loadInstruments } from './utils/dataLoader';

function App() {
  const { t, i18n } = useTranslation();
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
      const filtered = instruments.filter(instrument => {
        const searchText = searchQuery.toLowerCase();
        const instrumentName = instrument.name.toLowerCase();
        
        // Get the appropriate text based on current language
        const instrumentText = i18n.language === 'en' && instrument.text_en 
          ? instrument.text_en.toLowerCase()
          : instrument.text.toLowerCase();
        
        return instrumentName.includes(searchText) || instrumentText.includes(searchText);
      });
      setFilteredInstruments(filtered);
    }
  }, [searchQuery, instruments, i18n.language]);

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
                aria-label={t('navigation.home')}
              >
                <Home size={24} />
              </button>
              <h1 className="text-2xl font-bold text-white font-rounded">
                {t('app.title')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              
              <button
                onClick={toggleSearch}
                className={`btn-hover p-2 rounded-full transition-all duration-300 ${
                  showSearch 
                    ? 'bg-white text-purple-600' 
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
                aria-label={t('navigation.search')}
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
                aria-label={t('navigation.toggleSound')}
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
              placeholder={t('search.placeholder')}
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
                  "{searchQuery}" {t('search.resultsFor')} {filteredInstruments.length} {t('search.resultsFound')}
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
                    {t('search.noResults')}
                  </h3>
                  <p className="text-white/80">
                    {t('search.noResultsDescription')}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-6">
            <p className="text-white/80 text-sm text-center">
              {t('app.description')}
            </p>
            
            {/* Organization Logos */}
            <div className="w-full">
              <img 
                src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXdOR0jc9m-WTCsKIzMW8xDax4OCZ74pgs98ouFR9mJC0RZyn1eHLyKL68UGG6lAz1oMI47WUxEAlnCd5NzjO2RXnEkYNbOaLjuu3YezvzfA5Q-i6LJmVPvoqNyqmac3IizBWcqF?key=7bjogBi_oMEDz1XlscuDmD4U"
                alt="Partner Organizations"
                className="w-full max-w-4xl mx-auto h-auto object-contain"
                loading="lazy"
              />
            </div>
            
            {/* Made by bolt.new Logo */}
            <div className="flex items-center space-x-2 text-white/60 hover:text-white/80 transition-colors duration-300">
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
                <span className="text-xs font-medium">{t('app.supportedBy')}</span>
                <span className="text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  bolt.new
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;