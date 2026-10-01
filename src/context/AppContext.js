import { createContext, useContext } from 'react';

export const AppContext = createContext({
  ready: false,
  lenis: null,
  theme: 'dark',
  toggleTheme: () => {},
  menuOpen: false,
  setMenuOpen: () => {},
  introDelay: () => 0,
});

export const useApp = () => useContext(AppContext);
