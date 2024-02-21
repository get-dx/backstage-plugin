import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { dxPluginPlugin, DxPluginPage } from '../src/plugin';

createDevApp()
  .registerPlugin(dxPluginPlugin)
  .addPage({
    element: <DxPluginPage />,
    title: 'Root Page',
    path: '/dx-plugin'
  })
  .render();
