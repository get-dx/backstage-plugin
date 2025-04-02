import React from "react";
import { InfoCard } from "@backstage/core-components";
import { useEntity } from "@backstage/plugin-catalog-react";
import useAsync from "react-use/lib/useAsync";
import { useApi } from "@backstage/core-plugin-api";
import { Progress, ResponseErrorPanel } from "@backstage/core-components";
import Box from "@material-ui/core/Box";

import { BrandedCardTitle } from "./Branding";
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
            key={`${task.check_id}-${task.initiative_id}`}
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
          alignItems: "start",
          gridGap: 16,
          fontSize: 13,
          color: COLORS.UI_GRAY_40,
        }}
      >
        <Box>Requested by {task.owner.name}</Box>
        <Box sx={{ display: "flex", alignItems: "center", gridGap: 5 }}>
          <TimeIcon />
          <span style={{ whiteSpace: "nowrap" }}>Due {formattedDueDate}</span>
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
      backgroundColor: COLORS.ORANGE_50,
      color: COLORS.ORANGE_600,
    };
    indicatorStyles = {
      backgroundColor: COLORS.ORANGE_600,
    };
  } else if (priority === 2) {
    badgeStyles = {
      backgroundColor: COLORS.AMBER_50,
      color: COLORS.AMBER_600,
    };
    indicatorStyles = {
      backgroundColor: COLORS.AMBER_600,
    };
  }

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
  // The SVG for this icon was having major aliasing problems, so we're inlining it as a PNG instead
  return (
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADiSURBVHgBlZDLDsFAFIbHJWGNhC0SK8FeQkLY8U5io4+hTViIpG3UQiJpqb3iPeoNhv+0004jFv2Sycyc+38y/AtLQVb+OBeXjadzVqk1WL5YpreqbZMZPGSxXPFmq8dtx+W+/yabblhkg09ACWt1Qw4RiCQcAJsoFCWMJjOumxaXu8lVEYwYkA9mv7HzyfwrtNtpM+/xijWUq/VoHHD3njQGbkGuUKI7+1Mh/O93GnUGhnlkw0E/7oAZZdEyQjQWE4kOhCrk0I1DFGg713CtSnKtAlTBNjAvdOEt1inIUFYKPkrvLf/n5L74AAAAAElFTkSuQmCC"
      alt="Time icon"
      style={{
        marginBottom: 2,
      }}
    />
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
