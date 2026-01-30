import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IPlugin } from '../types/plugin';

// Simple ID generator
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
  
  // Persisted settings
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'zh';
  recentPluginIds: string[];
  favoritePluginIds: string[];
  
  // UI State
  isCommandPaletteOpen: boolean;

  // Actions
  registerPlugin: (plugin: IPlugin) => void;
  unregisterPlugin: (pluginId: string) => void;
  
  openTab: (pluginId: string) => void;
  closeTab: (tabId: string) => void;
  closeOtherTabs: (tabId: string) => void;
  closeAllTabs: () => void;
  setActiveTab: (tabId: string) => void;
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (lang: 'en' | 'zh') => void;
  toggleCommandPalette: (open?: boolean) => void;
  toggleFavorite: (pluginId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      plugins: [],
      tabs: [],
      activeTabId: null,
      
      theme: 'system',
      language: 'zh',
      recentPluginIds: [],
      favoritePluginIds: [],
      
      isCommandPaletteOpen: false,

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

        // Update recent tools
        const newRecents = [pluginId, ...state.recentPluginIds.filter(id => id !== pluginId)].slice(0, 10);

        // Check if tab already exists
        const existingTab = state.tabs.find(t => t.pluginId === pluginId);
        if (existingTab) {
          set({ activeTabId: existingTab.id, recentPluginIds: newRecents });
          return;
        }

        const newTab: Tab = {
          id: generateId(),
          pluginId: pluginId,
          title: plugin.name
        };

        set((state) => ({
          tabs: [...state.tabs, newTab],
          activeTabId: newTab.id,
          recentPluginIds: newRecents
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

      closeOtherTabs: (tabId) => set((state) => ({
        tabs: state.tabs.filter(t => t.id === tabId),
        activeTabId: tabId
      })),

      closeAllTabs: () => set({
        tabs: [],
        activeTabId: null
      }),

      setActiveTab: (tabId) => set({ activeTabId: tabId }),

      setTheme: (theme) => set({ theme }),
      
      setLanguage: (language) => set({ language }),

      toggleCommandPalette: (open) => set((state) => ({
        isCommandPaletteOpen: open !== undefined ? open : !state.isCommandPaletteOpen
      })),

      toggleFavorite: (pluginId) => set((state) => {
        const isFav = state.favoritePluginIds.includes(pluginId);
        return {
          favoritePluginIds: isFav 
            ? state.favoritePluginIds.filter(id => id !== pluginId)
            : [...state.favoritePluginIds, pluginId]
        };
      })
    }),
    {
      name: 'devboop-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        recentPluginIds: state.recentPluginIds,
        favoritePluginIds: state.favoritePluginIds
      })
    }
  )
);
