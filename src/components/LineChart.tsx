import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { DateTime } from "luxon";
import {
  LineChart as RechartsLineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartResponse } from "../api";

const formatDate = (date: string) =>
  DateTime.fromISO(date).toUTC().toLocaleString(DateTime.DATE_MED);

export function LineChart({ data, unit, total }: ChartResponse) {
  const chartData = data.map((x) => ({
    value: x.value,
    name: x.label,
  }));

  const firstDate = formatDate(data[0].date);
  const lastDate = formatDate(data[data.length - 1].date);

  return (
    <>
      <Box fontSize={20}>
        {total}
        {unit}
      </Box>
      <Box width="full" height="200px">
        <ResponsiveContainer>
          <RechartsLineChart
            width={300}
            height={100}
            data={chartData}
            syncId="dx-dora"
          >
            <Tooltip
              content={({ active, payload }) => {
                if (!active) return null;
                const date = payload?.[0].payload.name;
                return (
                  <Card elevation={5}>
                    <CardContent>
                      <Typography>{date}</Typography>
                      <Typography>
                        {payload?.[0].value}
                        {unit}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              }}
            />
            <Line
              dot
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={2}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Typography variant="subtitle2">{firstDate}</Typography>
        <Typography variant="subtitle2">{lastDate}</Typography>
      </Box>
    </>
  );
}
