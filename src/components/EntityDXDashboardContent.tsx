import React from "react";
import { Grid } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { ContentHeader, SupportButton } from "@backstage/core-components";
import { EntityChangeFailureRateCard } from "../components/EntityChangeFailureRateCard";
import { EntityDeploymentFrequencyCard } from "../components/EntityDeploymentFrequencyCard";
import { EntityOpenToDeployCard } from "../components/EntityOpenToDeployCard";
import { EntityTimeToRecoveryCard } from "./EntityTimeToRecoveryCard";
import { EntityTopContributorsTable } from "../components/EntityTopContributorsTable";

export function EntityDXDashboardContent() {
  return (
    <>
      <Box paddingBottom="48px">
        <ContentHeader
          title="DORA"
          description="Consolidated view of open to deploy, deployment frequency, and change failure rate."
        >
          <SupportButton
            items={[
              {
                title: "Dashboard for DX DORA Metrics",
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
      </Box>
      <EntityTopContributorsTable />
    </>
  );
}
