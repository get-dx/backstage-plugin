import React, { useState } from "react";
import { InfoCard } from "@backstage/core-components";
import { useEntity } from "@backstage/plugin-catalog-react";
import useAsync from "react-use/lib/useAsync";
import { useApi } from "@backstage/core-plugin-api";
import { Progress, ResponseErrorPanel } from "@backstage/core-components";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { dxApiRef, Scorecard } from "../api";

export function EntityScorecardsCard() {
  const dxApi = useApi(dxApiRef);

  const { entity } = useEntity();

  const entityIdentifier = entity.metadata.name;

  const [tab, setTab] = useState<"levels" | "checks">("levels");

  const {
    value: response,
    loading,
    error,
  } = useAsync(() => {
    return dxApi.scorecards(entityIdentifier);
  }, [dxApi, entityIdentifier]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  if (!response) {
    throw new Error("Unreachable");
  }

  const scorecards = response.scorecards;

  return (
    <InfoCard
      title={`Scorecards for ${entityIdentifier}`}
      deepLink={{
        link: `https://app.getdx.com/catalog/${entityIdentifier}/scorecards`,
        title: "View scorecards",
      }}
    >
      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        indicatorColor="primary"
      >
        <Tab value="levels" label="Levels" />
        <Tab value="checks" label="Checks" />
      </Tabs>
      {tab === "levels" && <ScorecardLevels scorecards={scorecards} />}

      {tab === "checks" && <ScorecardChecks scorecards={scorecards} />}
    </InfoCard>
  );
}

function ScorecardLevels({ scorecards }: { scorecards: Scorecard[] }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 3fr) 1fr" }}>
      {scorecards.map((scorecard) => (
        <React.Fragment key={scorecard.id}>
          <Box>{scorecard.name}</Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ mr: 1 }}>(icon)</Box>
            {scorecard.current_level ? (
              <Box sx={{ whiteSpace: "nowrap" }}>
                {scorecard.current_level.name}
              </Box>
            ) : (
              <Box sx={{ whiteSpace: "nowrap" }}>(TODO: handle no level)</Box>
            )}
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
}

function ScorecardChecks({ scorecards }: { scorecards: Scorecard[] }) {
  return <div>Checks</div>;
}
