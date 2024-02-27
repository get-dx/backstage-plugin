import React from "react";
import { Grid } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { ContentHeader, SupportButton } from "@backstage/core-components";
import { EntityDeploymentFrequencyCard } from "../components/EntityDeploymentFrequencyCard";
import { EntityChangeFailureRateCard } from "../components/EntityChangeFailureRateCard";
import { EntityLeadTimeCard } from "../components/EntityLeadTimeCard";
import { EntityTopContributorsTable } from "../components/EntityTopContributorsTable";

export const EntityDXDashboardContent = () => (
  <>
    <Box paddingBottom="48px">
      <ContentHeader
        title="DORA"
        description="Consolidated view of lead time, deployment frequency, and change failure rate."
      >
        <SupportButton>Dashboard for DX Dora Metrics</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6} xs={12}>
          <EntityDeploymentFrequencyCard />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityChangeFailureRateCard />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityLeadTimeCard />
        </Grid>
      </Grid>
    </Box>
    <EntityTopContributorsTable />
  </>
);
