import React from "react";
import { Table, TableColumn } from "@backstage/core-components";
import { DateTime } from "luxon";

interface DataTableProps {
  data: { label: string; value: number; date: string }[];
  unit: string;
  xAxis: string;
  yAxis: string;
}

export function DataTable({ data, xAxis, yAxis }: DataTableProps) {
  const columns: TableColumn[] = [
    {
      title: xAxis,
      field: "label",
      type: "string",
      highlight: true,
    },
    {
      title: yAxis,
      field: "value",
      type: "numeric",
    },
    {
      title: "Date",
      field: "date",
      type: "datetime",
      align: "right",
    },
  ];

  const tableData = data.map((x) => ({
    ...x,
    date: DateTime.fromISO(x.date).toJSDate(),
  }));

  return (
    <Table options={{ padding: "dense" }} data={tableData} columns={columns} />
  );
}
