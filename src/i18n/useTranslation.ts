import { useTheme } from '../context/ThemeContext';
import locales from './locales';

const useTranslation = () => {
  const { language } = useTheme();

  const t = (key: string, fallback: string = key): string => {
    const currentLocale = locales[language] || locales['zh-CN'];
    return currentLocale[key] || fallback;
  };

  return { t, language };
};

export default useTranslation;