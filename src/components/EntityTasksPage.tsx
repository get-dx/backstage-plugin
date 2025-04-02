import React from "react";
import {
  ContentHeader,
  Progress,
  ResponseErrorPanel,
  SupportButton,
} from "@backstage/core-components";
import { useApi } from "@backstage/core-plugin-api";
import { useEntity } from "@backstage/plugin-catalog-react";
import Box from "@material-ui/core/Box";
// import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import useAsync from "react-use/lib/useAsync";

import { dxApiRef } from "../api";
// import { COLORS } from "../styles";
import { PoweredByDX } from "./Branding";

export function EntityTasksPage() {
  const dxApi = useApi(dxApiRef);

  const { entity } = useEntity();

  const entityIdentifier = entity.metadata.name;

  const {
    value: response,
    loading,
    error,
  } = useAsync(() => {
    return dxApi.tasks(entityIdentifier);
  }, [dxApi, entityIdentifier]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    if (error.message.includes("404")) {
      error.message = `Failed to fetch tasks: entity \`${entityIdentifier}\` not found in DX Catalog`;
    }

    return <ResponseErrorPanel error={error} />;
  }

  if (!response) {
    throw new Error("Unreachable");
  }

  const tasks = response.tasks;

  return (
    <>
      <Box paddingBottom="48px">
        <ContentHeader
          title="Tasks"
          description="View the required tasks for this service that align with organization-wide initiatives."
        >
          <PoweredByDX />
          <SupportButton
            items={[
              {
                title: "Dashboard for DX Tasks",
                icon: "chat",
                links: [
                  {
                    url: "https://help.getdx.com/en/",
                    title: "DX Help Center",
                  },
                ],
              },
            ]}
          />
        </ContentHeader>
      </Box>
      <Grid container spacing={3} alignItems="stretch">
        <div>
          <pre>{JSON.stringify(tasks, null, 2)}</pre>
        </div>
      </Grid>
    </>
  );
}
