import React from "react";
import Box from "@material-ui/core/Box";
import {
  ContentHeader,
  Progress,
  ResponseErrorPanel,
  SupportButton,
} from "@backstage/core-components";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import { dxApiRef, Scorecard } from "../api";
import { useApi } from "@backstage/core-plugin-api";
import { useEntity } from "@backstage/plugin-catalog-react";
import useAsync from "react-use/lib/useAsync";

export function EntityScorecardsPage() {
  const dxApi = useApi(dxApiRef);

  const { entity } = useEntity();

  const entityIdentifier = entity.metadata.name;

  const {
    value: response,
    loading,
    error,
  } = useAsync(() => {
    return dxApi.scorecards(entityIdentifier);
  }, [dxApi, entityIdentifier]);

  // const [expandedScorecardId, setExpandedScorecardId] = useState<string | null>(
  //   null
  // );

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

  return (
    <>
      <Box paddingBottom="48px">
        <ContentHeader
          title="Scorecards"
          description="Evaluate the overall health and production readiness of this service."
        >
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
        {scorecards.map((scorecard, idx) => (
          <Grid item xs={12}>
            <ScorecardSummary
              key={scorecard.id}
              scorecard={scorecard}
              isOpen={idx === 0}
              onOpenChange={(isOpen) => {
                console.log("TODO: onOpenChange", scorecard.id, isOpen);
              }}
              // isOpen={expandedScorecardId === scorecard.id}
              // onOpenChange={(isOpen) => {
              //   console.log("onOpenChange", scorecard.id, isOpen);
              //   setExpandedScorecardId(isOpen ? scorecard.id : null);
              // }}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

function ScorecardSummary({
  scorecard,
  isOpen,
  onOpenChange,
}: {
  scorecard: Scorecard;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  return (
    <Card key={scorecard.id} onClick={() => onOpenChange(!isOpen)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 16,
          paddingRight: 24,
          height: 60,
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
          <Box>(icon)</Box>
          <Box>{scorecard.name}</Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gridGap: 8,
          }}
        >
          <Box>(Radial progress indicator)</Box>
          <Box>X / Y checks passing</Box>
          <Box>Level icon and name</Box>
        </Box>
      </Box>

      {isOpen && (
        <Box sx={{ borderTop: "1px solid black" }}>
          {scorecard.levels.map((level) => (
            <Box key={level.id}>
              <div className="h-12 flex items-center gap-2 px-3">
                <div className="w-6 flex items-center justify-center">
                  {/* <LevelIcon color={level.color} /> */}
                  Level icon
                </div>
                <div className="font-header text-sm">{level.name}</div>
              </div>
              <div className="pl-9 pr-3 pb-2 divide-y divide-gray-200">
                {scorecard.checks
                  .filter((check) => check.level.id === level.id)
                  .map((check) => (
                    <Box key={check.id}>
                      <Box>{check.name}</Box>
                      <Box>
                        {check.description ??
                          "TODO: get descriptions from endpoint"}
                      </Box>
                    </Box>
                  ))}
              </div>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );
}
