import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './useAppStore';
import { IPlugin } from '../types/plugin';

describe('useAppStore', () => {
  const mockPlugin: IPlugin = {
    id: 'test-plugin',
    name: 'Test Plugin',
    description: 'A test plugin',
    version: '1.0.0',
    author: 'Test Author',
    component: () => null
  };

  beforeEach(() => {
    useAppStore.setState({
      plugins: [],
      tabs: [],
      activeTabId: null
    });
  });

  it('should register a plugin', () => {
    useAppStore.getState().registerPlugin(mockPlugin);
    expect(useAppStore.getState().plugins).toHaveLength(1);
    expect(useAppStore.getState().plugins[0]).toEqual(mockPlugin);
  });

  it('should open a tab for a registered plugin', () => {
    useAppStore.getState().registerPlugin(mockPlugin);
    useAppStore.getState().openTab(mockPlugin.id);
    
    const state = useAppStore.getState();
    expect(state.tabs).toHaveLength(1);
    expect(state.tabs[0].pluginId).toBe(mockPlugin.id);
    expect(state.activeTabId).toBe(state.tabs[0].id);
  });

  it('should not open a new tab if the plugin is already open', () => {
    useAppStore.getState().registerPlugin(mockPlugin);
    
    // First open
    useAppStore.getState().openTab(mockPlugin.id);
    const firstTabId = useAppStore.getState().tabs[0].id;
    
    // Create another dummy tab to switch focus away
    const dummyTab = { id: 'dummy', pluginId: 'dummy', title: 'Dummy' };
    useAppStore.setState(state => ({ tabs: [...state.tabs, dummyTab], activeTabId: 'dummy' }));
    
    // Second open of the same plugin
    useAppStore.getState().openTab(mockPlugin.id);
    
    const state = useAppStore.getState();
    // Should still have 2 tabs (original + dummy), didn't add a 3rd one
    expect(state.tabs).toHaveLength(2); 
    // Active tab should be the first one again
    expect(state.activeTabId).toBe(firstTabId);
  });

  it('should allow opening multiple different plugins', () => {
    const mockPlugin2: IPlugin = { ...mockPlugin, id: 'test-plugin-2', name: 'Test Plugin 2' };
    
    useAppStore.getState().registerPlugin(mockPlugin);
    useAppStore.getState().registerPlugin(mockPlugin2);

    useAppStore.getState().openTab(mockPlugin.id);
    useAppStore.getState().openTab(mockPlugin2.id);

    const state = useAppStore.getState();
    expect(state.tabs).toHaveLength(2);
    expect(state.activeTabId).toBe(state.tabs[1].id);
  });
});
