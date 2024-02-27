import React from "react";
import {
  ResponseErrorPanel,
  Table,
  TableColumn,
} from "@backstage/core-components";
import { useApi } from "@backstage/core-plugin-api";
import { dxApiRef } from "../api";
import { useEntity } from "@backstage/plugin-catalog-react";
import { useAsync } from "react-use";
import { stringifyEntityRef } from "@backstage/catalog-model";
import { DateTime } from "luxon";

export function EntityTopContributorsTable() {
  const columns: TableColumn[] = [
    {
      title: "Github username",
      field: "label",
      type: "string",
      highlight: true,
    },
    {
      title: "Pull request count",
      field: "value",
      type: "numeric",
    },
    {
      title: "Most recent pull request",
      field: "date",
      type: "datetime",
      align: "right",
    },
  ];

  const dxApi = useApi(dxApiRef);

  const { entity } = useEntity();

  const {
    value: response,
    loading,
    error,
  } = useAsync(async () => {
    const entityRef = stringifyEntityRef(entity);
    return await dxApi.topContributors(entityRef);
  }, [dxApi, entity]);

  if (error || !response?.data) {
    return <ResponseErrorPanel error={error || new Error("Unknown Error")} />;
  }

  const tableData = response.data.map((x) => ({
    ...x,
    date: DateTime.fromISO(x.date).toJSDate(),
  }));

  return (
    <Table
      options={{ padding: "dense" }}
      subtitle="Github users with the most PRs created for this entity."
      data={tableData}
      columns={columns}
      isLoading={loading}
      title="Top Contributors"
    />
  );
}
