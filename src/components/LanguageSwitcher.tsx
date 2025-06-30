import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'tr', name: t('languages.tr') },
    { code: 'en', name: t('languages.en') }
  ];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="relative group">
      <button
        className="btn-hover bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 flex items-center space-x-2"
        aria-label="Change language"
      >
        <Globe size={24} />
        <span className="text-sm font-medium hidden sm:block">
          {languages.find(lang => lang.code === i18n.language)?.name || 'TR'}
        </span>
      </button>
      
      <div className="absolute right-0 top-full mt-2 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[120px] z-50">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`w-full px-4 py-3 text-left hover:bg-white/20 transition-colors duration-200 first:rounded-t-2xl last:rounded-b-2xl ${
              i18n.language === language.code 
                ? 'bg-purple-500/20 text-purple-700 font-semibold' 
                : 'text-gray-700'
            }`}
          >
            {language.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;