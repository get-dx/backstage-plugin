# DX Backstage Frontend Plugin

DX Backstage frontend plugin to display DX data in your Backstage app.

<img width="1636" alt="dora" src="https://github.com/user-attachments/assets/11e65a64-765c-47a2-93f3-3e2f6cf8c5c9">

## Setup

1. Ensure your backstage services are annotated with the `github.com/project-slug` [annotation](https://backstage.io/docs/features/software-catalog/well-known-annotations#githubcomproject-slug).

1. Ensure DX backend plugin is installed and working [@get-dx/backstage-backend-plugin](https://github.com/get-dx/backstage-backend-plugin).

1. Install this plugin in your backstage frontend —

   ```bash
   yarn --cwd packages/app add @get-dx/backstage-plugin
   ```

1. We provide an "all-in-one" DX dashboard component. Install that by adding a route to your service
   entity page —

```ts
// packages/app/src/components/catalog/EntityPage.tsx
import { EntityDXDashboardContent } from '@get-dx/backstage-plugin';

const serviceEntityPage = (
  <EntityLayout>
    {/* ... */}

    <EntityLayout.Route path="/dx" title="DX">
      <EntityDXDashboardContent />
    </EntityLayout.Route>

    {/* ... */}
  </EntityLayout>
)
```

> See the Components section below for other components offered.

## DX Core Components

We export a few Dashboard pages, as well as the individual components that make up
the dashboards so you can render them wherever you like.

They can be rendered on both `Component` and `Group` entity pages.

| Component                           | Description                                                           |
| ----------------------------------- | --------------------------------------------------------------------- |
| `<EntityDXDashboardContent />`      | Dashboard with all available DX Charts.                               |
| `<EntityDORAMetricsContent />`      | Dashboard with all the DORA metric charts.                            |
| `<EntityChangeFailureRateCard />`   | Line chart showing Change Failure Rate for the service.               |
| `<EntityDeploymentFrequencyCard />` | Line chart showing Deployment Frequency for the service.              |
| `<EntityOpenToDeployCard />`        | Line chart showing Open to Deploy time for the service.               |
| `<EntityTimeToRecoveryCard />`      | Line chart showing Time to Recovery for the service.                  |
| `<EntityTopContributorsTable />`    | Table showing top contributors by pull request count for the service. |

## DX Service Cloud Components

These components visualize Scorecards and Tasks for an entity.

| Component                  | Description                                                               |
| -------------------------- | ------------------------------------------------------------------------- |
| `<EntityScorecardsPage />` | Dashboard showing scorecard details for the service.                      |
| `<EntityTasksPage />`      | Dashboard showing outstanding tasks for the service, grouped by priority. |
| `<EntityScorecardsCard />` | Info card showing current scorecard levels and checks for the service.    |
| `<EntityTasksCard />`      | Info card showing outstanding tasks for the service.                      |

These components expect entities to have the same identifer in Backstage and DX. For example, if you have a Backstage entity with the `metadata.name` of `my-app`, then you must also have an entity in the DX Catalog with the identifier of `my-app` so the info cards can fetch the data successfully.

Install the full-page components by defining routes in the service entity page:

```ts
// packages/app/src/components/catalog/EntityPage.tsx
import { EntityScorecardsPage, EntityTasksPage } from '@get-dx/backstage-plugin';

const serviceEntityPage = (
  <EntityLayout>
    {/* ... */}

    <EntityLayout.Route path="/dx-scorecards" title="Scorecards">
      <EntityScorecardsPage />
    </EntityLayout.Route>

    <EntityLayout.Route path="/dx-tasks" title="Tasks">
      <EntityTasksPage />
    </EntityLayout.Route>

    {/* ... */}
  </EntityLayout>
)
```

### Additional setup

These components rely on the DX Web API, not the Data Cloud API. Generate a token on the [Web API Keys](https://app.getdx.com/admin/webapi) page that includes the `catalog:read` scope. Then configure a second proxy configuration in your app config to communicate with the Web API:

```diff
# app-config.yaml
proxy:
  endpoints:
    "/dx":
      target: ${DX_API_HOST_URL}
      headers:
        Authorization: Bearer ${DX_API_TOKEN}
+    "/dx-web":
+      target: ${DX_WEB_API_HOST}
+      headers:
+        Authorization: Bearer ${DX_WEB_API_TOKEN}
```

## Configuration

### Application Id

This plugin respects the same `appId` configuration as the backend plugin to distinguish multiple instances of backstage within DX.
Can be any string as long as it's unique within your DX account.

```yaml
# app-config.yaml
dx:
  appId: staging
```

## Development

`yarn install` and `yarn start` will start a local dev server showing the UI of this component. See `dev/index.tsx` for setup.

To see real data, link to a local backstage instance and use [`yalc`](https://github.com/wclr/yalc).
