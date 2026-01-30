import React from 'react';

export interface IPlugin {
  id: string;
  name: string;
  description: string;
  category?: string;
  tags?: string[];
  icon?: React.ReactElement;
  component: React.ComponentType;
  version: string;
  author: string;
}
