# DX Backstage Frontend Plugin

DX Backstage frontend plugin to display DX data in your Backstage app.

## Setup

- Install this plugin in your backstage frontend:

  ```bash
  yarn --cwd packages/app add @get-dx/backstage-plugin
  ```

- Generate an API token on the [Web API Keys](https://app.getdx.com/admin/webapi) page that includes the `catalog:read` scope. Then configure a proxy in your app config file to communicate with the DX API:

  ```yaml
  # app-config.yaml
  proxy:
    endpoints:
      "/dx-web-api":
        target: https://api.getdx.com
        headers:
          Authorization: Bearer ${DX_WEB_API_TOKEN}
        allowedHeaders:
          # Forwards the plugin version to DX, to help us provide support and maintain API compatibility
          - X-Client-Type
          - X-Client-Version
  ```

## Add Components

### Service Cloud

These components visualize Scorecards and Tasks for an entity.

| Component                  | Description                                                               |
| -------------------------- | ------------------------------------------------------------------------- |
| `<EntityScorecardsPage />` | Dashboard showing scorecard details for the service.                      |
| `<EntityTasksPage />`      | Dashboard showing outstanding tasks for the service, grouped by priority. |
| `<EntityScorecardsCard />` | Info card showing current scorecard levels and checks for the service.    |
| `<EntityTasksCard />`      | Info card showing outstanding tasks for the service.                      |

Each of these components requires an `entityIdentifier` prop, in order to fetch the correct DX entity. If you use the Backstage catalog plugin, you can call Backstage's `useEntity` hook to get metadata to help map or construct the DX entity identifier.

Install the full-page components by defining routes in the service entity page:

```ts
// packages/app/src/components/catalog/EntityPage.tsx
import { EntityScorecardsPage, EntityTasksPage } from '@get-dx/backstage-plugin';

const serviceEntityPage = (
  <EntityLayout>
    {/* ... */}

    <EntityLayout.Route path="/dx-scorecards" title="Scorecards">
      <EntityScorecardsPage entityIdentifier="my-app" />
    </EntityLayout.Route>

    <EntityLayout.Route path="/dx-tasks" title="Tasks">
      <EntityTasksPage entityIdentifier="my-app" />
    </EntityLayout.Route>

    {/* ... */}
  </EntityLayout>
)
```

## Development

`yarn install` and `yarn start` will start a local dev server showing the UI of this component. See `dev/index.tsx` for setup.

To see real data, link to a local backstage instance and use [`yalc`](https://github.com/wclr/yalc).
