import React, { useState } from "react";
import {
  ContentHeader,
  Progress,
  ResponseErrorPanel,
  SupportButton,
  BottomLink,
} from "@backstage/core-components";
import { useApi } from "@backstage/core-plugin-api";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import useAsync from "react-use/lib/useAsync";
import { DateTime } from "luxon";

import { dxApiRef, Scorecard, ScorecardCheck } from "../api";
import { LevelIcon } from "./LevelIcon";
import { COLORS, DEFAULT_NO_LEVEL_COLOR } from "../styles";
import { CheckResultBadge } from "./CheckResultBadge";
import { RadialProgressIndicator } from "./RadialProgressIndicator";
import { PoweredByDX } from "./Branding";
import { CheckResultDrawer } from "./CheckResultDrawer";
import { entityScorecardsUrl } from "../links";
import { TimeIcon } from "./TimeIcon";

type EntityScorecardsPageProps = {
  entityIdentifier: string;
  errorFallback?: (error: Error) => React.ReactNode;
};

export function EntityScorecardsPage({
  entityIdentifier,
  errorFallback,
}: EntityScorecardsPageProps) {
  const dxApi = useApi(dxApiRef);

  const {
    value: response,
    loading,
    error,
  } = useAsync(() => {
    return dxApi.scorecards(entityIdentifier);
  }, [dxApi, entityIdentifier]);

  const [expandedScorecardId, setExpandedScorecardId] = useState<string | null>(
    null
  );

  if (loading) {
    return <Progress />;
  }

  if (error) {
    if (errorFallback) {
      return <>{errorFallback(error)}</>;
    }

    if (error.message.includes("404")) {
      error.message = `Failed to fetch Scorecards: entity \`${entityIdentifier}\` not found in DX Catalog`;
    }

    return <ResponseErrorPanel error={error} />;
  }

  if (!response) {
    throw new Error("Unreachable");
  }

  const scorecards = response.scorecards;

  return (
    <>
      <Box paddingBottom="48px">
        <ContentHeader
          title="Scorecards"
          description="Evaluate the overall health and production readiness of this service."
        >
          <PoweredByDX />
          <SupportButton
            items={[
              {
                title: "Dashboard for DX Scorecards",
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
        {scorecards.map((scorecard) => (
          <Grid item xs={12} key={scorecard.id}>
            <ScorecardSummary
              scorecard={scorecard}
              entityIdentifier={entityIdentifier}
              isOpen={expandedScorecardId === scorecard.id}
              onOpenChange={(isOpen) => {
                setExpandedScorecardId(isOpen ? scorecard.id : null);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

function ScorecardSummary({
  scorecard,
  entityIdentifier,
  isOpen,
  onOpenChange,
}: {
  scorecard: Scorecard;
  entityIdentifier: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const entityScorecardUrl = `https://app.getdx.com/catalog/${entityIdentifier}/scorecards?expanded=${scorecard.id}`;

  return (
    <Card key={scorecard.id}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 16,
          paddingRight: 24,
          height: 60,
          cursor: "pointer",
        }}
        role="button"
        tabIndex={0}
        onClick={() => onOpenChange(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onOpenChange(!isOpen);
          }
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gridGap: 8,
          }}
        >
          <Box>
            <ChevronIcon
              style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
            />
          </Box>
          <Box
            sx={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "-0.25px",
              lineHeight: "normal",
            }}
          >
            {scorecard.name}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gridGap: 8,
          }}
        >
          {scorecard.type === "LEVEL" && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  minWidth: 0,
                }}
              >
                <Box sx={{ marginRight: 4 }}>
                  <LevelIcon
                    color={
                      scorecard.current_level?.color ??
                      scorecard.empty_level.color ??
                      DEFAULT_NO_LEVEL_COLOR
                    }
                  />
                </Box>
                <Box sx={{ fontSize: 13 }}>
                  {scorecard.current_level?.name ??
                    scorecard.empty_level.label ??
                    "No level"}
                </Box>
              </Box>
            </>
          )}

          {scorecard.type === "POINTS" && (
            <>
              <Box sx={{ fontSize: 13, color: COLORS.GRAY_500 }}>
                {scorecard.points_meta.points_achieved} /{" "}
                {scorecard.points_meta.points_total} points
              </Box>

              <RadialProgressIndicator
                numerator={scorecard.points_meta.points_achieved}
                denominator={scorecard.points_meta.points_total}
              />
            </>
          )}
        </Box>
      </div>

      {isOpen && (
        <>
          <Box sx={{ borderTop: `1px solid ${COLORS.GRAY_200}` }}>
            {scorecard.type === "LEVEL" &&
              scorecard.levels.map((level, levelIdx) => {
                const checksInLevel = scorecard.checks.filter(
                  (check) => check.level.id === level.id
                );

                return (
                  <Box key={level.id}>
                    <Box
                      sx={{
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        gridGap: 8,
                        paddingLeft: 12,
                        paddingRight: 12,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <LevelIcon color={level.color} />
                      </Box>
                      <Box sx={{ fontSize: 14, fontWeight: 700 }}>
                        {level.name}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        paddingLeft: 36,
                        paddingRight: 12,
                        paddingBottom: 8,
                        borderBottom:
                          levelIdx < scorecard.levels.length - 1
                            ? `1px solid ${COLORS.GRAY_200}`
                            : "none",
                      }}
                    >
                      {checksInLevel.map((check, checkIdx) => (
                        <CheckSummary
                          key={check.id}
                          scorecardId={scorecard.id}
                          entityIdentifier={entityIdentifier}
                          check={check}
                          showBottomBorder={checkIdx < checksInLevel.length - 1}
                        />
                      ))}
                    </Box>
                  </Box>
                );
              })}

            {scorecard.type === "POINTS" &&
              scorecard.check_groups.map((checkGroup, checkGroupIdx) => {
                const checksInCheckGroup = scorecard.checks.filter(
                  (check) => check.check_group.id === checkGroup.id
                );

                return (
                  <Box key={checkGroup.id}>
                    <Box
                      sx={{
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        gridGap: 8,
                        paddingLeft: 42,
                        paddingRight: 12,
                      }}
                    >
                      <Box sx={{ fontSize: 14, fontWeight: 700 }}>
                        {checkGroup.name}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        paddingLeft: 36,
                        paddingRight: 12,
                        paddingBottom: 8,
                        borderBottom:
                          checkGroupIdx < scorecard.check_groups.length - 1
                            ? `1px solid ${COLORS.GRAY_200}`
                            : "none",
                      }}
                    >
                      {checksInCheckGroup.map((check, checkIdx) => (
                        <CheckSummary
                          key={check.id}
                          scorecardId={scorecard.id}
                          entityIdentifier={entityIdentifier}
                          check={check}
                          showBottomBorder={
                            checkIdx < checksInCheckGroup.length - 1
                          }
                        />
                      ))}
                    </Box>
                  </Box>
                );
              })}
          </Box>
          <BottomLink link={entityScorecardUrl} title="View scorecard in DX" />
        </>
      )}
    </Card>
  );
}

function CheckSummary({
  check,
  showBottomBorder,
  scorecardId,
  entityIdentifier,
}: {
  check: ScorecardCheck;
  showBottomBorder: boolean;
  scorecardId: string;
  entityIdentifier: string;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleEditRelatedProperty = () => {
    const url = entityScorecardsUrl({
      entityIdentifier,
      scorecardId,
    });
    window.location.href = url;
  };

  return (
    <Box
      key={check.id}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gridGap: 8,
        padding: 8,
        borderBottom: showBottomBorder
          ? `1px solid ${COLORS.GRAY_200}`
          : "none",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Box sx={{ fontSize: 13, fontWeight: 500 }}>{check.name}</Box>
        <Box
          sx={{
            fontSize: 13,
            fontWeight: 400,
            color: "#7f7f7f",
          }}
        >
          {check.description}
        </Box>
      </Box>
      <Box>
        {check.executed_at && (
          <Box
            sx={{
              fontSize: 13,
              color: COLORS.GRAY_400,
              display: "flex",
              alignItems: "center",
              gridGap: 4,
            }}
          >
            <TimeIcon />
            <span>
              {DateTime.fromISO(check.executed_at, {
                zone: "utc",
              }).toRelative()}
            </span>
          </Box>
        )}
      </Box>
      <div
        onClick={() => setDrawerOpen(!drawerOpen)}
        style={{ cursor: "pointer" }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setDrawerOpen(!drawerOpen);
          }
        }}
      >
        <CheckResultBadge
          status={check.status}
          isPublished={check.published}
          outputEnabled={!!check.output}
          outputValue={check.output?.value ?? null}
          outputType={check.output?.type ?? null}
        />
      </div>
      <CheckResultDrawer
        check={check}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEditRelatedProperty={handleEditRelatedProperty}
      />
    </Box>
  );
}

function ChevronIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={style}
    >
      <path
        d="M12.2197 6.96973L8.99998 10.1895L5.78023 6.96973L4.71973 8.03023L8.99998 12.3105L13.2802 8.03023L12.2197 6.96973Z"
        fill="#9CA3AF"
      />
    </svg>
  );
}
