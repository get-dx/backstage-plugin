import React from "react";
import { InfoCard } from "@backstage/core-components";
import { stringifyEntityRef } from "@backstage/catalog-model";
import { useEntity } from "@backstage/plugin-catalog-react";
import useAsync from "react-use/lib/useAsync";
import { Progress, ResponseErrorPanel } from "@backstage/core-components";
import { useApi } from "@backstage/core-plugin-api";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { dxApiRef } from "../api";
import { LineChart } from "./LineChart";

export function EntityChangeFailureRateCard() {
  const dxApi = useApi(dxApiRef);

  const { entity } = useEntity();
  const entityRef = stringifyEntityRef(entity);

  const {
    value: response,
    loading,
    error,
  } = useAsync(() => {
    return dxApi.changeFailureRate(entityRef);
  }, [dxApi, entityRef]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <InfoCard
      title={
        <Box display="flex" alignItems="center" gridGap="8px">
          Change failure rate
          <Tooltip
            title={
              <Typography variant="body2">
                This is the number of failed deployments divided by number of
                total deployments. The overall value shown is the average of the
                data points.
              </Typography>
            }
            placement="top"
          >
            <InfoOutlinedIcon style={{ opacity: 0.6, fontSize: 20 }} />
          </Tooltip>
        </Box>
      }
      deepLink={{
        link: `https://app.getdx.com/datacloud/teams/backstage_dora_deep_link?entityRef=${entityRef}`,
        title: "View in DX",
      }}
    >
      {response?.data ? (
        <LineChart
          data={response.data}
          unit={response.unit}
          total={response.total}
        />
      ) : null}
    </InfoCard>
  );
}
