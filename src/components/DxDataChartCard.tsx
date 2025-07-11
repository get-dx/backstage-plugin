import React from "react";
import { useAsync } from "react-use";
import { useApi } from "@backstage/core-plugin-api";
import {
  InfoCard,
  Progress,
  ResponseErrorPanel,
} from "@backstage/core-components";
import { LineChart } from "./LineChart";
import { dxApiRef } from "../api";
import { Table, TableColumn } from "@backstage/core-components";

export interface DxDataChartCardProps {
  title: string;
  description?: string;
  datafeedToken: string;
  variables?: Record<string, string | number | boolean>;
  unit: string;
  chartConfig: {
    type: "line" | "table";
    xAxis?: string;
    yAxis?: string;
  };
}

export function DxDataChartCard({
  datafeedToken,
  title,
  description,
  variables = {},
  chartConfig,
  unit,
}: DxDataChartCardProps) {
  const dxApi = useApi(dxApiRef);

  const {
    loading,
    error,
    value: data,
  } = useAsync(async () => {
    return await dxApi.datafeed(datafeedToken, variables);
  }, [dxApi, datafeedToken, variables, chartConfig]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  if (!data) {
    return null;
  }

  const deepLink = {
    link: `https://app.getdx.com/datacloud/datafeed/${datafeedToken}/view_query`,
    title: "View in DX",
  };

  if (chartConfig.type === "table") {
    const columns: TableColumn[] = data.data.columns.map(
      (columnName: string) => ({
        title: columnName,
        field: columnName,
        type: "string",
      })
    );

    const tableData = data.data.rows.map((row: any[]) => {
      const rowData: any = {};
      data.data.columns.forEach((columnName: string, index: number) => {
        rowData[columnName] = row[index];
      });
      return rowData;
    });

    return (
      <Table
        title={title}
        subtitle={description}
        options={{ padding: "dense" }}
        data={tableData}
        columns={columns}
      />
    );
  }

  if (chartConfig.type === "line") {
    // For line charts, transform data using xAxis and yAxis
    if (!chartConfig.xAxis || !chartConfig.yAxis) {
      throw new Error("xAxis and yAxis are required for line charts");
    }

    const xAxisIndex = data.data.columns.indexOf(chartConfig.xAxis);
    const yAxisIndex = data.data.columns.indexOf(chartConfig.yAxis);

    if (xAxisIndex === -1) {
      throw new Error(`Column '${chartConfig.xAxis}' not found in data`);
    }
    if (yAxisIndex === -1) {
      throw new Error(`Column '${chartConfig.yAxis}' not found in data`);
    }

    // Transform the data to match ChartData format expected by LineChart
    const transformedData = {
      data: data.data.rows.map((row) => ({
        label: row[xAxisIndex],
        value: Number(row[yAxisIndex]) || 0,
        date: new Date(row[xAxisIndex]).toISOString(), // Assuming xAxis contains date values
      })),
      overall:
        data.data.rows.length > 0
          ? Math.round(
              (data.data.rows.reduce(
                (sum, row) => sum + (Number(row[yAxisIndex]) || 0),
                0
              ) /
                data.data.rows.length) *
                100
            ) / 100
          : 0,
    };

    return (
      <InfoCard title={title} subheader={description} deepLink={deepLink}>
        <LineChart
          data={transformedData.data}
          unit={unit}
          overall={transformedData.overall}
        />
      </InfoCard>
    );
  }

  return null;
}
