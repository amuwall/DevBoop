import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimestampPlugin } from './index';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import React from 'react';

// Wrapper for Fluent UI
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <FluentProvider theme={webLightTheme}>
    {children}
  </FluentProvider>
);

describe('TimestampConverter', () => {
  it('renders correctly', () => {
    const Component = TimestampPlugin.component;
    render(<Component />, { wrapper: Wrapper });
    expect(screen.getByText('Unix Timestamp Converter')).toBeTruthy();
  });

  it('updates timestamp when "Now" is clicked', () => {
    const Component = TimestampPlugin.component;
    render(<Component />, { wrapper: Wrapper });
    
    const nowButton = screen.getByText('Now');
    fireEvent.click(nowButton);
    
    // Check if input has a value
    const input = screen.getByPlaceholderText('Enter timestamp...') as HTMLInputElement;
    expect(input.value).toBeTruthy();
  });
});
