import React from "react";
import { InfoCard } from "@backstage/core-components";
import { useEntity } from "@backstage/plugin-catalog-react";
import useAsync from "react-use/lib/useAsync";
import { useApi } from "@backstage/core-plugin-api";
import { Progress, ResponseErrorPanel } from "@backstage/core-components";
import Box from "@material-ui/core/Box";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { DateTime } from "luxon";

import { BrandedCardTitle } from "./Branding";
import { dxApiRef, Task } from "../api";
import { COLORS, TASK_PRIORITY_COLORS } from "../styles";

type EntityTasksCardProps = {
  contentMaxHeight?: string | number;
};

export function EntityTasksCard({
  contentMaxHeight = "30rem",
}: EntityTasksCardProps) {
  const dxApi = useApi(dxApiRef);

  const { entity } = useEntity();

  const entityIdentifier = entity.metadata.name;

  const {
    value: response,
    loading,
    error,
  } = useAsync(() => {
    return dxApi.tasks(entityIdentifier);
  }, [dxApi, entityIdentifier]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    if (error.message.includes("404")) {
      error.message = `Failed to fetch tasks: entity \`${entityIdentifier}\` not found in DX Catalog`;
    }

    return <ResponseErrorPanel error={error} />;
  }

  if (!response) {
    throw new Error("Unreachable");
  }

  return (
    <InfoCard
      title={<BrandedCardTitle title="Tasks" />}
      deepLink={{
        link: `https://app.getdx.com/catalog/${entityIdentifier}/tasks`,
        title: "View tasks",
      }}
      variant="gridItem"
      noPadding
    >
      <Box sx={{ maxHeight: contentMaxHeight, overflow: "auto", padding: 16 }}>
        {response.tasks.length === 0 && (
          <Box sx={{ textAlign: "center", padding: 16 }}>
            No outstanding tasks for this entity!
          </Box>
        )}

        {response.tasks.map((task, idx) => (
          <Box
            key={`${task.check.id}-${task.initiative.id}`}
            sx={{
              paddingTop: idx === 0 ? 0 : 12,
              paddingBottom: idx === response.tasks.length - 1 ? 0 : 16,
              borderTop: idx === 0 ? "none" : `1px solid ${COLORS.GRAY_200}`,
            }}
          >
            <TaskSummary task={task} />
          </Box>
        ))}
      </Box>
    </InfoCard>
  );
}

function TaskSummary({ task }: { task: Task }) {
  const formattedDueDate = formatDueDate(task.initiative.complete_by);
  const dueDateStatusColor = getDueDateStatusColor(task.initiative.complete_by);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gridGap: 12 }}>
      <Box sx={{ fontWeight: 500, fontSize: 14, color: "#030712" }}>
        {task.check.name}
      </Box>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gridGap: 8 }}>
          <Box sx={{ fontSize: 13, fontWeight: 500, lineHeight: "20px" }}>
            {task.initiative.name}
          </Box>
          <PriorityBadge priority={task.initiative.priority} />
        </Box>
        <div
          style={{
            marginTop: 2,
            fontSize: 12,
            color: "#7f7f7f",
            lineHeight: "normal",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {task.initiative.description}
        </div>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          gridGap: 16,
          fontSize: 13,
          color: COLORS.UI_GRAY_40,
        }}
      >
        <Box>Requested by {task.owner.name}</Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gridGap: 5,
            color: dueDateStatusColor,
          }}
        >
          <ScheduleIcon style={{ fontSize: 12, marginBottom: 2 }} />
          <span style={{ whiteSpace: "nowrap" }}>Due {formattedDueDate}</span>
        </Box>
      </Box>
    </Box>
  );
}

function PriorityBadge({ priority }: { priority: number }) {
  const { bg, fg } = TASK_PRIORITY_COLORS[priority];
  const badgeStyles = {
    backgroundColor: bg,
    color: fg,
  };
  const indicatorStyles = {
    backgroundColor: fg,
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gridGap: 4,
        paddingLeft: 4,
        paddingRight: 4,
        borderRadius: 2,
        lineHeight: "13px",
        ...badgeStyles,
      }}
    >
      <div
        style={{
          width: 4,
          height: 4,
          borderRadius: 24,
          marginBottom: 1,
          ...indicatorStyles,
        }}
      />
      <span style={{ fontSize: 11 }}>P{priority}</span>
    </div>
  );
}

function formatDueDate(date: string): string {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getDueDateStatusColor(dueDate: string): string {
  const dueDateDate = DateTime.fromISO(dueDate, { zone: "utc" });
  const today = DateTime.now();
  const diff = dueDateDate.diff(today, ["days"]).days;

  if (diff < 0) {
    return COLORS.RED_500;
  } else if (diff < 14) {
    return COLORS.AMBER_500;
  }

  return COLORS.GRAY_500;
}
