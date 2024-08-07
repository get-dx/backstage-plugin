import React from "react";
import { Grid } from "@material-ui/core";
import { ContentHeader, SupportButton } from "@backstage/core-components";
import { EntityDeploymentFrequencyCard } from "../components/EntityDeploymentFrequencyCard";
import { EntityChangeFailureRateCard } from "../components/EntityChangeFailureRateCard";
import { EntityOpenToDeployCard } from "../components/EntityOpenToDeployCard";
import { EntityTimeToRecoveryCard } from "../components/EntityTimeToRecoveryCard";

export function EntityDORAMetricsContent() {
  return (
    <>
      <ContentHeader
        title="DORA"
        description="Consolidated view of open to deploy, deployment frequency, and change failure rate."
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
          <EntityTimeToRecoveryCard />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityOpenToDeployCard />
        </Grid>
      </Grid>
    </>
  );
}
