import React from "react";
import { InfoCard } from "@backstage/core-components";
import { useEntity } from "@backstage/plugin-catalog-react";
import useAsync from "react-use/lib/useAsync";
import { useApi } from "@backstage/core-plugin-api";
import { Progress, ResponseErrorPanel } from "@backstage/core-components";
import Box from "@material-ui/core/Box";

import { BrandedCardTitle } from "./BrandedCardTitle";
import { dxApiRef, Task } from "../api";
import { COLORS } from "../styles";

type EntityTasksCardProps = {
  contentMaxHeight?: string | number;
};

export function EntityTasksCard({
  contentMaxHeight = "20rem",
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
        {response.tasks.map((task, idx) => (
          <Box
            key={`${task.check_public_id}-${task.initiative_public_id}`}
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
  const formattedDueDate = formatDueDate(task.initiative_complete_by);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gridGap: 12 }}>
      <Box sx={{ fontWeight: 500, fontSize: 14, color: "#030712" }}>
        {task.check_name}
      </Box>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gridGap: 8 }}>
          <Box sx={{ fontSize: 13, fontWeight: 500, lineHeight: "20px" }}>
            {task.initiative_name}
          </Box>
          <PriorityBadge priority={task.initiative_priority} />
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
          {task.initiative_description}
        </div>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gridGap: 16,
          fontSize: 13,
          color: COLORS.UI_GRAY_40,
        }}
      >
        <Box>Requested by {task.owner.name}</Box>
        <Box sx={{ display: "flex", alignItems: "center", gridGap: 5 }}>
          <TimeIcon />
          <span>Due {formattedDueDate}</span>
        </Box>
      </Box>
    </Box>
  );
}

function PriorityBadge({ priority }: { priority: number }) {
  let badgeStyles = {};
  let indicatorStyles = {};

  if (priority === 0) {
    badgeStyles = {
      backgroundColor: COLORS.RED_50,
      color: COLORS.RED_600,
    };
    indicatorStyles = {
      backgroundColor: COLORS.RED_600,
    };
  } else if (priority === 1) {
    badgeStyles = {
      backgroundColor: COLORS.AMBER_50,
      color: COLORS.AMBER_600,
    };
    indicatorStyles = {
      backgroundColor: COLORS.AMBER_600,
    };
  } else if (priority === 2) {
    badgeStyles = {
      backgroundColor: COLORS.GREEN_50,
      color: COLORS.GREEN_600,
    };
    indicatorStyles = {
      backgroundColor: COLORS.GREEN_600,
    };
  }
  // TODO: change color styles for priorities

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

function TimeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
    >
      <path
        d="M6 1C3.243 1 1 3.243 1 6C1 8.757 3.243 11 6 11C8.757 11 11 8.757 11 6C11 3.243 8.757 1 6 1ZM6 10C3.7945 10 2 8.2055 2 6C2 3.7945 3.7945 2 6 2C8.2055 2 10 3.7945 10 6C10 8.2055 8.2055 10 6 10Z"
        fill="#030712"
      />
      <path
        d="M6.5 3.5H5.5V6.207L7.1465 7.8535L7.8535 7.1465L6.5 5.793V3.5Z"
        fill="#030712"
      />
    </svg>
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
