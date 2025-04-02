import React, { useState } from "react";
import { InfoCard } from "@backstage/core-components";
import { useEntity } from "@backstage/plugin-catalog-react";
import useAsync from "react-use/lib/useAsync";
import { useApi } from "@backstage/core-plugin-api";
import { Progress, ResponseErrorPanel } from "@backstage/core-components";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { dxApiRef, Scorecard, ScorecardCheck } from "../api";
import { BrandedCardTitle } from "./Branding";
import { CheckResultBadge } from "./CheckResultBadge";
import { COLORS, DEFAULT_NO_LEVEL_COLOR } from "../styles";
import { LevelIcon } from "./LevelIcon";

type EntityScorecardsCardProps = {
  contentMaxHeight?: string | number;
};

export function EntityScorecardsCard({
  contentMaxHeight = "20rem",
}: EntityScorecardsCardProps) {
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
    if (error.message.includes("404")) {
      error.message = `Failed to fetch Scorecards: entity \`${entityIdentifier}\` not found in DX Catalog`;
    }

    return <ResponseErrorPanel error={error} />;
  }

  if (!response) {
    throw new Error("Unreachable");
  }

  const scorecards = response.scorecards;

  const flattenedChecks = scorecards.flatMap((scorecard) => scorecard.checks);

  return (
    <InfoCard
      title={
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gridGap: 16,
            marginBottom: -20,
          }}
        >
          <BrandedCardTitle title="Scorecards" />
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            indicatorColor="primary"
          >
            <Tab value="levels" label="Levels" />
            <Tab value="checks" label="Checks" />
          </Tabs>
        </Box>
      }
      deepLink={{
        link: `https://app.getdx.com/catalog/${entityIdentifier}/scorecards`,
        title: "View scorecards",
      }}
      variant="gridItem"
      noPadding
    >
      <Box sx={{ maxHeight: contentMaxHeight, overflow: "auto", padding: 16 }}>
        {tab === "levels" && <LevelsTab scorecards={scorecards} />}

        {tab === "checks" && <ChecksTab checks={flattenedChecks} />}
      </Box>
    </InfoCard>
  );
}

function LevelsTab({ scorecards }: { scorecards: Scorecard[] }) {
  if (scorecards.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
        }}
      >
        <Box>No scorecards apply to this entity.</Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(25%, 3fr) minmax(25%, 2fr)",
      }}
    >
      {scorecards.map((scorecard, idx) => (
        <React.Fragment key={scorecard.id}>
          <Box
            sx={{
              lineHeight: "40px",
              fontWeight: 500,
              fontSize: 13,
              borderTop: idx === 0 ? "none" : `1px solid ${COLORS.GRAY_100}`,
              paddingRight: 8,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {scorecard.name}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: 13,
              borderTop: idx === 0 ? "none" : `1px solid ${COLORS.GRAY_100}`,
              whiteSpace: "nowrap",
              color: "#616161",
              minWidth: 0,
            }}
          >
            <Box sx={{ marginRight: 8 }}>
              <LevelIcon
                color={
                  scorecard.current_level?.color ??
                  scorecard.empty_level.color ??
                  DEFAULT_NO_LEVEL_COLOR
                }
              />
            </Box>
            <Box
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
                whiteSpace: "nowrap",
              }}
            >
              {scorecard.current_level?.name ??
                scorecard.empty_level.label ??
                "No level"}
            </Box>
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
}

function ChecksTab({ checks }: { checks: ScorecardCheck[] }) {
  if (checks.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
        }}
      >
        <Box>No checks apply to this entity.</Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 3fr) 1fr" }}>
      {checks.map((check, idx) => (
        <React.Fragment key={check.id}>
          <Box
            sx={{
              lineHeight: "40px",
              fontWeight: 500,
              fontSize: 13,
              borderTop: idx === 0 ? "none" : `1px solid ${COLORS.GRAY_100}`,
              paddingRight: 8,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {check.name}
          </Box>
          <Box
            sx={{
              height: "40px",
              display: "flex",
              alignItems: "center",
              paddingRight: 8,
              fontSize: 13,
              borderTop: idx === 0 ? "none" : `1px solid ${COLORS.GRAY_100}`,
              whiteSpace: "nowrap",
            }}
          >
            <CheckResultBadge
              status={check.status}
              isPublished={check.published}
              outputEnabled={check.output !== null}
              outputValue={check.output?.value ?? null}
              outputType={check.output?.type ?? null}
            />
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
}
