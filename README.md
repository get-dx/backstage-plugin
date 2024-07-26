# DX Backstage Frontend Plugin

DX Backstage frontend plugin to display DX data in your Backstage app.

<img width="1885" alt="backstage-demo" src="https://github.com/get-dx/backstage-plugin/assets/15827892/0115de07-70c5-4d4a-8ae5-0fdd1928e4b3">

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
    <EntityLayout.Route path="/dx" title="DX">
      <EntityDXDashboardContent />
    </EntityLayout.Route>
  </EntityLayout>
)
```

> See the Components section below for other components offered.

## Components

We export a few Dashboard pages, as well as the individual components that make up
the dashboards so you can place those wherever you'd like.

| Component                           | Description                                                           |
| ----------------------------------- | --------------------------------------------------------------------- |
| `<EntityDXDashboardContent />`      | Dashboard with all available DX Charts.                               |
| `<EntityDORAMetricsContent />`      | Dashboard with all the DORA metric charts.                            |
| `<EntityChangeFailureRateCard />`   | Line chart showing Change Failure Rate for the service.               |
| `<EntityDeploymentFrequencyCard />` | Line chart showing Deployment Frequency for the service.              |
| `<EntityLeadTimeCard />`            | Line chart showing Lead Time for the service.                         |
| `<EntityTimeToRecoveryCard />`      | Line chart showing Time to Recovery for the service.                  |
| `<EntityTopContributorsTable />`    | Table showing top contributors by pull request count for the service. |

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
