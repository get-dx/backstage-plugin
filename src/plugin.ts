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

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
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

export const EntityScorecardsCard = dxPlugin.provide(
  createComponentExtension({
    name: "EntityScorecardsCard",
    component: {
      lazy: () =>
        import("./components/EntityScorecardsCard").then(
          (m) => m.EntityScorecardsCard,
        ),
    },
  }),
);

export const EntityTasksCard = dxPlugin.provide(
  createComponentExtension({
    name: "EntityTasksCard",
    component: {
      lazy: () =>
        import("./components/EntityTasksCard").then((m) => m.EntityTasksCard),
    },
  }),
);

export const EntityScorecardsPage = dxPlugin.provide(
  createComponentExtension({
    name: "EntityScorecardsPage",
    component: {
      lazy: () =>
        import("./components/EntityScorecardsPage").then(
          (m) => m.EntityScorecardsPage,
        ),
    },
  }),
);

export const EntityTasksPage = dxPlugin.provide(
  createComponentExtension({
    name: "EntityTasksPage",
    component: {
      lazy: () =>
        import("./components/EntityTasksPage").then((m) => m.EntityTasksPage),
    },
  }),
);

export const DXWidget = dxPlugin.provide(
  createComponentExtension({
    name: "DXWidget",
    component: {
      lazy: () => import("./components/DXWidget").then((m) => m.DXWidget),
    },
  }),
);