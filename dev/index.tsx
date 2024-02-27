import React from "react";
import { createDevApp, EntityGridItem } from "@backstage/dev-utils";
import { dxPlugin, EntityDXDashboardContent } from "../src/plugin";
import { Entity } from "@backstage/catalog-model";
import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
import Grid from "@material-ui/core/Grid";

import { Content, Header, Page } from "@backstage/core-components";

const mockEntity: Entity = {
  apiVersion: "backstage.io/v1alpha1",
  kind: "Component",
  metadata: {
    name: "DX App Component",
    description: "DX Application",
    annotations: {
      "github.com/project-slug": "get-dx/app",
    },
  },
  spec: {
    lifecycle: "production",
    type: "service",
    owner: "group:default/developers",
  },
};

createDevApp()
  .registerPlugin(dxPlugin)
  .addPage({
    element: (
      <Page themeId="home">
        <Header title="DX Backstage Plugin" />
        <Content>
          <Grid container>
            <EntityGridItem entity={mockEntity}>
              <EntityDXDashboardContent />
            </EntityGridItem>
          </Grid>
        </Content>
      </Page>
    ),
    title: "Root Page",
    path: "/dx",
  })
  .render();

const host = "http://localhost:7007";

const worker = setupWorker(
  http.get(`${host}/api/proxy/dx/api/backstage.deploymentFrequency`, () =>
    HttpResponse.json({
      data: [
        {
          date: "2024-01-22T00:00:00.000+00:00",
          value: 0.4,
          label: "Jan 22 - Jan 28",
        },
        {
          date: "2024-01-29T00:00:00.000+00:00",
          value: 0.3,
          label: "Jan 29 - Feb 04",
        },
        {
          date: "2024-02-05T00:00:00.000+00:00",
          value: 0.7,
          label: "Feb 05 - Feb 11",
        },
        {
          date: "2024-02-12T00:00:00.000+00:00",
          value: 0.6,
          label: "Feb 12 - Feb 18",
        },
        {
          date: "2024-02-19T00:00:00.000+00:00",
          value: 0.3,
          label: "Feb 19 - Feb 25",
        },
      ],
      total: 0.5,
      unit: " per day",
    }),
  ),

  http.get(`${host}/api/proxy/dx/api/backstage.changeFailureRate`, () =>
    HttpResponse.json({
      data: [
        {
          date: "2024-01-22T00:00:00.000+00:00",
          value: 12.3,
          label: "Jan 22 - Jan 28",
        },
        {
          date: "2024-01-29T00:00:00.000+00:00",
          value: 9.7,
          label: "Jan 29 - Feb 04",
        },
        {
          date: "2024-02-05T00:00:00.000+00:00",
          value: 24.4,
          label: "Feb 05 - Feb 11",
        },
        {
          date: "2024-02-12T00:00:00.000+00:00",
          value: 66.7,
          label: "Feb 12 - Feb 18",
        },
        {
          date: "2024-02-19T00:00:00.000+00:00",
          value: 12.1,
          label: "Feb 19 - Feb 25",
        },
      ],
      total: 25.04,
      unit: "%",
    }),
  ),

  http.get(`${host}/api/proxy/dx/api/backstage.leadTime`, () =>
    HttpResponse.json({
      data: [
        {
          date: "2024-01-22T00:00:00.000+00:00",
          value: 122.5,
          label: "Jan 22 - Jan 28",
        },
        {
          date: "2024-01-29T00:00:00.000+00:00",
          value: 156.2,
          label: "Jan 29 - Feb 04",
        },
        {
          date: "2024-02-05T00:00:00.000+00:00",
          value: 88.4,
          label: "Feb 05 - Feb 11",
        },
        {
          date: "2024-02-12T00:00:00.000+00:00",
          value: 225.5,
          label: "Feb 12 - Feb 18",
        },
        {
          date: "2024-02-19T00:00:00.000+00:00",
          value: 132.3,
          label: "Feb 19 - Feb 25",
        },
      ],
      total: 144.98,
      unit: " mins",
    }),
  ),

  http.get(`${host}/api/proxy/dx/api/backstage.topContributors`, () =>
    HttpResponse.json({
      data: [
        {
          label: "inoda",
          value: 270,
          date: "2024-02-27T20:55:12.000Z",
        },
        {
          label: "ryanbjones",
          value: 160,
          date: "2024-02-26T18:53:38.000Z",
        },
        {
          label: "ElizaHales",
          value: 97,
          date: "2024-02-27T13:03:17.000Z",
        },
        {
          label: "radixhound",
          value: 84,
          date: "2024-02-27T20:19:50.000Z",
        },
        {
          label: "tylerwray",
          value: 74,
          date: "2024-02-26T17:48:44.000Z",
        },
        {
          label: "abinoda",
          value: 34,
          date: "2024-02-26T20:32:20.000Z",
        },
        {
          label: "jakehasler",
          value: 11,
          date: "2024-02-16T17:46:05.000Z",
        },
      ],
    }),
  ),
);

// Start the Mock Service Worker
worker.start();
