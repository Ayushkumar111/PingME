import { create } from "zustand";

// Get the theme from localStorage or use default
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("chat-theme");
  return savedTheme || "coffee";
};

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
    
    // This will trigger a rerender in components using this state
    set(state => ({ ...state, theme }));
    
    // Apply theme directly to document (fallback approach)
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme); 
  },
  getTheme: () => get().theme
}));