import {
  configApiRef,
  createApiFactory,
  createComponentExtension,
  createPlugin,
  discoveryApiRef,
  fetchApiRef,
} from "@backstage/core-plugin-api";

import { rootRouteRef } from "./routes";
import { DXApiClient, dxApiRef } from "./api";

export const dxPlugin = createPlugin({
  id: "dx",
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: dxApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        configApi: configApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, configApi, fetchApi }) =>
        new DXApiClient({ discoveryApi, configApi, fetchApi }),
    }),
  ],
});

export const EntityScorecardsCard = dxPlugin.provide(
  createComponentExtension({
    name: "EntityScorecardsCard",
    component: {
      lazy: () =>
        import("./components/EntityScorecardsCard").then(
          (m) => m.EntityScorecardsCard
        ),
    },
  })
);

export const EntityTasksCard = dxPlugin.provide(
  createComponentExtension({
    name: "EntityTasksCard",
    component: {
      lazy: () =>
        import("./components/EntityTasksCard").then((m) => m.EntityTasksCard),
    },
  })
);

export const EntityScorecardsPage = dxPlugin.provide(
  createComponentExtension({
    name: "EntityScorecardsPage",
    component: {
      lazy: () =>
        import("./components/EntityScorecardsPage").then(
          (m) => m.EntityScorecardsPage
        ),
    },
  })
);

export const EntityTasksPage = dxPlugin.provide(
  createComponentExtension({
    name: "EntityTasksPage",
    component: {
      lazy: () =>
        import("./components/EntityTasksPage").then((m) => m.EntityTasksPage),
    },
  })
);
