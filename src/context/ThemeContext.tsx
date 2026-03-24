import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  clearTheme: () => void;
  resolvedTheme: ResolvedTheme;
  language: 'zh-CN' | 'en-US';
  setLanguage: (lang: 'zh-CN' | 'en-US') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const resolveTheme = (theme: Theme): ResolvedTheme => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme;
      return saved || 'light';
    }
    return 'light';
  });
  
  const [language, setLanguage] = useState<'zh-CN' | 'en-US'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as 'zh-CN' | 'en-US';
      return saved || 'zh-CN';
    }
    return 'zh-CN';
  });

  const resolvedTheme = resolveTheme(theme);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  const clearTheme = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('theme');
      setTheme('light');
    }
  };

  const handleLanguageChange = (newLang: 'zh-CN' | 'en-US') => {
    setLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLang);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(getSystemTheme());
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, clearTheme, resolvedTheme, language, setLanguage: handleLanguageChange }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
