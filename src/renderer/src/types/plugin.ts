import React from 'react';

export interface IPlugin {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactElement;
  component: React.ComponentType;
  version: string;
  author: string;
}
