import React from "react";
import { createDevApp, EntityGridItem } from "@backstage/dev-utils";
import { dxPlugin } from "../src/plugin";
import { DxDataChartCard } from "../src/components/DxDataChartCard";
import { Entity } from "@backstage/catalog-model";
import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
import { useEntity } from "@backstage/plugin-catalog-react";

import { Content, Header, Page } from "@backstage/core-components";

const mockComponentEntity: Entity = {
  apiVersion: "backstage.io/v1alpha1",
  kind: "Component",
  metadata: {
    name: "app",
    description: "DX Application",
    annotations: {
      "github.com/project-slug": "get-dx/app",
      "getdx.com/id": "team-123",
    },
  },
  spec: {
    lifecycle: "production",
    type: "service",
    owner: "group:default/developers",
  },
};

function DxDataChartDemo() {
  const { entity } = useEntity();

  return (
    <>
      <DxDataChartCard
        title="Deployments Chart"
        datafeedToken="demo-token-123"
        unit="deployments"
        variables={{
          teamId: entity.metadata.annotations?.["getdx.com/id"] ?? "",
        }}
        chartConfig={{
          type: "line",
          xAxis: "date",
          yAxis: "value",
        }}
      />
      <br />
      <DxDataChartCard
        title="Deployments Table"
        datafeedToken="demo-token-123"
        unit="deployments"
        variables={{
          teamId: entity.metadata.annotations?.["getdx.com/id"] ?? "",
        }}
        chartConfig={{
          type: "table",
        }}
      />
    </>
  );
}

createDevApp()
  .registerPlugin(dxPlugin)
  .addPage({
    element: (
      <Page themeId="home">
        <Header title="DX Data Chart Demo" />
        <Content>
          <EntityGridItem entity={mockComponentEntity}>
            <DxDataChartDemo />
          </EntityGridItem>
        </Content>
      </Page>
    ),
    title: "Data Chart Demo",
    path: "/dx-data-chart",
  })
  .render();

const host = "http://localhost:7007";

const worker = setupWorker(
  // Mock datafeed endpoint for DxDataChart
  http.get(`${host}/api/proxy/dx-web-api/datacloud.queries.datafeed`, () =>
    HttpResponse.json({
      data: {
        rows: [
          ["2025-06-02 00:00:00", "app", "app", "0"],
          ["2025-06-09 00:00:00", "app", "app", "106"],
          ["2025-06-16 00:00:00", "app", "app", "108"],
          ["2025-06-23 00:00:00", "app", "app", "159"],
          ["2025-06-30 00:00:00", "app", "app", "97"],
          ["2025-07-07 00:00:00", "app", "app", "46"],
        ],
        columns: ["date", "entity_name", "entity_identifier", "value"],
      },
    })
  )
);

// Start the Mock Service Worker
worker.start();
