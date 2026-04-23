import { useState, useEffect, useCallback } from 'react';
import { i18n, Language } from '@core/i18n';

export const useLanguage = () => {
  const [language, setLanguageState] = useState<Language>(i18n.getLanguage());
  const [isArabic, setIsArabic] = useState(i18n.isArabic());

  const setLanguage = useCallback((lang: Language) => {
    i18n.setLanguage(lang);
    setLanguageState(lang);
    setIsArabic(lang === 'ar');
  }, []);

  const t = useCallback((key: string) => i18n.t(key), []);

  return {
    language,
    isArabic,
    setLanguage,
    t,
  };
};
