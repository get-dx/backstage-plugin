import {
  configApiRef,
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
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

export const EntityDXDashboardContent = dxPlugin.provide(
  createRoutableExtension({
    name: "EntityDXDashboardContent",
    component: () =>
      import("./components/EntityDXDashboardContent").then(
        (m) => m.EntityDXDashboardContent,
      ),
    mountPoint: rootRouteRef,
  }),
);

export const EntityDORAMetricsContent = dxPlugin.provide(
  createRoutableExtension({
    name: "EntityDORAMetricsContent",
    component: () =>
      import("./components/EntityDORAMetricsContent").then(
        (m) => m.EntityDORAMetricsContent,
      ),
    mountPoint: rootRouteRef,
  }),
);

export const EntityChangeFailureRateCard = dxPlugin.provide(
  createComponentExtension({
    name: "EntityChangeFailureRateCard",
    component: {
      lazy: () =>
        import("./components/EntityChangeFailureRateCard").then(
          (m) => m.EntityChangeFailureRateCard,
        ),
    },
  }),
);

export const EntityDeploymentFrequencyCard = dxPlugin.provide(
  createComponentExtension({
    name: "EntityDeploymentFrequencyCard",
    component: {
      lazy: () =>
        import("./components/EntityDeploymentFrequencyCard").then(
          (m) => m.EntityDeploymentFrequencyCard,
        ),
    },
  }),
);

export const EntityOpenToDeployCard = dxPlugin.provide(
  createComponentExtension({
    name: "EntityOpenToDeployCard",
    component: {
      lazy: () =>
        import("./components/EntityOpenToDeployCard").then(
          (m) => m.EntityOpenToDeployCard,
        ),
    },
  }),
);

export const EntityLeadTimeCard = dxPlugin.provide(
  createComponentExtension({
    name: "EntityLeadTimeCard",
    component: {
      lazy: () =>
        import("./components/EntityOpenToDeployCard").then(
          (m) => m.EntityOpenToDeployCard,
        ),
    },
  }),
);

export const EntityTimeToRecoveryCard = dxPlugin.provide(
  createComponentExtension({
    name: "EntityTimeToRecoveryCard",
    component: {
      lazy: () =>
        import("./components/EntityTimeToRecoveryCard").then(
          (m) => m.EntityTimeToRecoveryCard,
        ),
    },
  }),
);

export const EntityTopContributorsTable = dxPlugin.provide(
  createComponentExtension({
    name: "EntityTopContributorsTable",
    component: {
      lazy: () =>
        import("./components/EntityTopContributorsTable").then(
          (m) => m.EntityTopContributorsTable,
        ),
    },
  }),
);
