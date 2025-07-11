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

const calculateTrendline = (data: { value: number }[]) => {
  const n = data.length;
  if (n < 2) return data.map(() => 0);

  const sumX = data.reduce((sum, _, i) => sum + i, 0);
  const sumY = data.reduce((sum, point) => sum + point.value, 0);
  const sumXY = data.reduce((sum, point, i) => sum + i * point.value, 0);
  const sumXX = data.reduce((sum, _, i) => sum + i * i, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return data.map((_, i) => slope * i + intercept);
};

export function LineChart({ data, unit, overall }: ChartData) {
  const trendlineValues = calculateTrendline(data);
  const chartData = data.map((x, i) => ({
    value: x.value,
    name: x.label,
    date: x.date,
    trendline: trendlineValues[i],
  }));

  const firstDate = formatDate(data[0].date);
  const lastDate = formatDate(data[data.length - 1].date);

  return (
    <>
      <Box display="flex" alignItems="baseline" gridGap={4} paddingBottom={4}>
        <Box fontSize={24} fontWeight={500}>
          {overall}
        </Box>
        <Box fontSize={16}>{unit}</Box>
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
                      <Box fontSize={12} pb={1}>
                        {formattedDate}
                      </Box>
                      <Box
                        display="flex"
                        alignItems="baseline"
                        gridGap={4}
                        fontSize={16}
                      >
                        <Box fontSize={20} fontWeight={500}>
                          {payload?.[0].value}
                        </Box>
                        <Box fontSize={12}>{unit}</Box>
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
            <Line
              dot={false}
              type="linear"
              dataKey="trendline"
              stroke="#818cf8"
              strokeWidth={1}
              strokeDasharray="5 5"
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
