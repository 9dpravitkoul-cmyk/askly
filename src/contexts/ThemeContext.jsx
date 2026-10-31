import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'system',
  setTheme: () => {},
  isDark: false,
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem('askly-theme') || 'system';
    } catch {
      return 'system';
    }
  });

  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem('askly-theme') || 'system';
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const applyTheme = (preference) => {
    const root = document.documentElement;
    const dark = preference === 'dark' || (preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.add('theme-switching');
    root.classList.toggle('dark', dark);
    root.dataset.theme = dark ? 'dark' : 'light';
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
    setIsDark(dark);
  };

  const setTheme = (nextTheme) => {
    if (!['light', 'dark', 'system'].includes(nextTheme)) return;
    // Apply before updating React state so the root changes in the same click event.
    applyTheme(nextTheme);
    setThemeState(nextTheme);
    try { localStorage.setItem('askly-theme', nextTheme); } catch {}
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    applyTheme(theme);

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    if (theme !== 'system') return undefined;
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
