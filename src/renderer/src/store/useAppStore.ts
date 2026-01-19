import { create } from 'zustand';
import { IPlugin } from '../types/plugin';

// Simple ID generator since uuid might not be installed
const generateId = () => Math.random().toString(36).substr(2, 9);

interface Tab {
  id: string;
  pluginId: string;
  title: string;
}

interface AppState {
  plugins: IPlugin[];
  tabs: Tab[];
  activeTabId: string | null;
  theme: 'light' | 'dark';

  registerPlugin: (plugin: IPlugin) => void;
  unregisterPlugin: (pluginId: string) => void;
  
  openTab: (pluginId: string) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  plugins: [],
  tabs: [],
  activeTabId: null,
  theme: 'light', // Default to light as per new requirement

  registerPlugin: (plugin) => set((state) => ({ 
    plugins: state.plugins.some(p => p.id === plugin.id)
      ? state.plugins
      : [...state.plugins, plugin] 
  })),

  unregisterPlugin: (pluginId) => set((state) => ({
    plugins: state.plugins.filter(p => p.id !== pluginId)
  })),

  openTab: (pluginId) => {
    const state = get();
    const plugin = state.plugins.find(p => p.id === pluginId);
    if (!plugin) return;

    // Check if tab already exists for this plugin? 
    // Requirement says "multi-tab support", so maybe allow multiple instances?
    // Let's allow multiple instances.
    const newTab: Tab = {
      id: generateId(),
      pluginId: pluginId,
      title: plugin.name
    };

    set((state) => ({
      tabs: [...state.tabs, newTab],
      activeTabId: newTab.id
    }));
  },

  closeTab: (tabId) => set((state) => {
    const newTabs = state.tabs.filter(t => t.id !== tabId);
    let newActiveId = state.activeTabId;
    
    if (state.activeTabId === tabId) {
      newActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
    }

    return {
      tabs: newTabs,
      activeTabId: newActiveId
    };
  }),

  setActiveTab: (tabId) => set({ activeTabId: tabId }),

  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
}));
