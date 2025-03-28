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
import { BrandedCardTitle } from "./BrandedCardTitle";
import { CheckResultBadge } from "./CheckResultBadge";
import { COLORS } from "../styles";

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
    >
      <Box sx={{ maxHeight: contentMaxHeight, overflow: "auto" }}>
        {tab === "levels" && <LevelsTab scorecards={scorecards} />}

        {tab === "checks" && <ChecksTab checks={flattenedChecks} />}
      </Box>
    </InfoCard>
  );
}

function LevelsTab({ scorecards }: { scorecards: Scorecard[] }) {
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
            <Box sx={{ mr: 1 }}>
              <LevelIcon color="#FBBF24" />
            </Box>
            <Box
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
                whiteSpace: "nowrap",
              }}
            >
              {scorecard.current_level
                ? scorecard.current_level.name
                : "TODO: handle no level"}
            </Box>
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
}

function ChecksTab({ checks }: { checks: ScorecardCheck[] }) {
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

export function LevelIcon({ color }: { color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        border: "1px solid",
        width: 24,
        height: 24,
        color,
        borderColor: `${color}50`,
        backgroundColor: `${color}20`,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M14.6314 6.11934C14.5895 5.99592 14.5124 5.88747 14.4095 5.80738C14.3067 5.72729 14.1827 5.67908 14.0527 5.66868L10.2521 5.36668L8.60739 1.72601C8.55501 1.60875 8.46982 1.50916 8.36209 1.43925C8.25436 1.36934 8.1287 1.3321 8.00027 1.33203C7.87185 1.33196 7.74615 1.36906 7.63834 1.43885C7.53054 1.50864 7.44523 1.60814 7.39272 1.72534L5.74806 5.36668L1.94739 5.66868C1.8197 5.67879 1.69762 5.72548 1.59576 5.80316C1.49391 5.88084 1.41659 5.98622 1.37305 6.1067C1.32952 6.22717 1.32162 6.35763 1.35029 6.48248C1.37896 6.60733 1.44299 6.72127 1.53472 6.81068L4.34339 9.54868L3.35006 13.85C3.3199 13.9802 3.32956 14.1165 3.3778 14.2411C3.42605 14.3657 3.51063 14.473 3.62059 14.549C3.73055 14.6249 3.8608 14.6661 3.99445 14.6671C4.12809 14.6681 4.25896 14.629 4.37006 14.5547L8.00006 12.1347L11.6301 14.5547C11.7436 14.6301 11.8775 14.6689 12.0138 14.6659C12.1501 14.6629 12.2822 14.6183 12.3923 14.538C12.5025 14.4577 12.5854 14.3456 12.6299 14.2167C12.6744 14.0879 12.6784 13.9485 12.6414 13.8173L11.4221 9.55068L14.4461 6.82934C14.6441 6.65068 14.7167 6.37201 14.6314 6.11934Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
