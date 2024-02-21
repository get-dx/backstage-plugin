import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const dxPluginPlugin = createPlugin({
  id: 'dx-plugin',
  routes: {
    root: rootRouteRef,
  },
});

export const DxPluginPage = dxPluginPlugin.provide(
  createRoutableExtension({
    name: 'DxPluginPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
