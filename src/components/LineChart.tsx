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

interface ChartData {
  data: { label: string; value: number; date: string }[];
  unit: string;
  overall?: number;
}
const formatDate = (date: string) =>
  DateTime.fromISO(date).toUTC().toLocaleString(DateTime.DATE_MED);

export function LineChart({ data, unit, overall }: ChartData) {
  const chartData = data.map((x) => ({
    value: x.value,
    name: x.label,
    date: x.date,
  }));

  const firstDate = formatDate(data[0].date);
  const lastDate = formatDate(data[data.length - 1].date);

  return (
    <>
      <Box
        fontSize={20}
        display="flex"
        alignItems="center"
        gridGap={4}
        paddingBottom={4}
      >
        <div>{overall}</div>
        <div>{unit}</div>
      </Box>
      <Box width="full" height="200px">
        <ResponsiveContainer>
          <RechartsLineChart width={300} height={100} data={chartData}>
            <Tooltip
              content={({ active, payload }) => {
                if (!active) return null;
                const date = payload?.[0].payload.date;
                const formattedDate = formatDate(date);
                return (
                  <Card elevation={5}>
                    <CardContent>
                      <Box fontSize={12}>{formattedDate}</Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        gridGap={4}
                        fontSize={16}
                      >
                        <div>{payload?.[0].value}</div>
                        <div>{unit}</div>
                      </Box>
                    </CardContent>
                  </Card>
                );
              }}
            />
            <Line
              dot={false}
              type="linear"
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
