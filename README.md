# DX Backstage Frontend Plugin

⚠️ BETA - This plugin is in a closed beta right now. Functionality and API of this plugin is certain to change. Please reach out to DX if you are interested! developers@getdx.com

DX Backstage frontend plugin to display DX data in your Backstage app.

<img width="1565" alt="Screenshot 2024-03-05 at 10 11 13 AM" src="https://github.com/get-dx/backstage-plugin/assets/15827892/22a5e743-4602-4af5-8750-b69bf34cb7ad">

## Setup

1. Ensure DX backend plugin is installed and working [@get-dx/backstage-backend-plugin](https://github.com/get-dx/backstage-backend-plugin).

2. Install this plugin in your backstage frontend —

```bash
yarn --cwd packages/app add @get-dx/backstage-plugin
```

3. We provide an "all-in-one" DX dashboard component. Install that by adding a route to your service
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
| `<EntityDXDashboardConent />`       | Dashboard with all available DX Charts.                               |
| `<EntityDORAMetricsConent />`       | Dashboard with all the DORA metric charts.                            |
| `<EntityChangeFailureRateCard />`   | Line chart showing Change Failure Rate for the service.               |
| `<EntityDeploymentFrequencyCard />` | Line chart showing Deployment Frequency for the service.              |
| `<EntityLeadTimeCard />`            | Line chart showing Lead Time for the service.                         |
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
