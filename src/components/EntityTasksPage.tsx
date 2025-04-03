import React, { useState } from "react";
import {
  ContentHeader,
  Progress,
  ResponseErrorPanel,
  SupportButton,
} from "@backstage/core-components";
import { useApi } from "@backstage/core-plugin-api";
import { useEntity } from "@backstage/plugin-catalog-react";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import useAsync from "react-use/lib/useAsync";

import { dxApiRef, Task, User } from "../api";
import { COLORS } from "../styles";
import { PoweredByDX } from "./Branding";

export function EntityTasksPage() {
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

  const tasks = response.tasks;

  return (
    <>
      <Box paddingBottom="48px">
        <ContentHeader
          title="Tasks"
          description="View the required tasks for this service that align with organization-wide initiatives."
        >
          <PoweredByDX />
          <SupportButton
            items={[
              {
                title: "Dashboard for DX Tasks",
                icon: "chat",
                links: [
                  {
                    url: "https://help.getdx.com/en/",
                    title: "DX Help Center",
                  },
                ],
              },
            ]}
          />
        </ContentHeader>
      </Box>
      <Grid container spacing={3} alignItems="stretch">
        {[0, 1, 2].map((priorityLevel) => (
          <Grid item xs={12} key={priorityLevel}>
            <PriorityTaskList
              priorityLevel={priorityLevel}
              tasks={tasks.filter(
                (task) => task.initiative_priority === priorityLevel
              )}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

function PriorityTaskList({
  priorityLevel,
  tasks,
}: {
  priorityLevel: number;
  tasks: Task[];
}) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <Card>
      <Box
        sx={{
          height: 60,
          paddingLeft: 24,
          paddingRight: 24,
          display: "flex",
          alignItems: "center",
          gridGap: 8,
          borderBottom: `1px solid ${COLORS.GRAY_200}`,
        }}
      >
        <PriorityIndicator priorityLevel={priorityLevel} />
        <Box
          sx={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.25px",
            lineHeight: "normal",
          }}
        >
          P{priorityLevel}
        </Box>
      </Box>
      <Box>
        {tasks.map((task) => (
          <Box
            key={`${task.check_id}-${task.initiative_id}`}
            sx={{ borderBottom: `1px solid ${COLORS.GRAY_200}` }}
          >
            <TaskSummary task={task} />
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 12,
          paddingBottom: 12,
        }}
      >
        TODO: View tasks in DX
      </Box>
    </Card>
  );
}

function PriorityIndicator({ priorityLevel }: { priorityLevel: number }) {
  // TODO: Move to styles, use from EntityTasksCard too
  const PRIORITY_COLORS: Record<number, { bg: string; fg: string }> = {
    0: {
      bg: COLORS.RED_50,
      fg: COLORS.RED_600,
    },
    1: {
      bg: COLORS.ORANGE_50,
      fg: COLORS.ORANGE_600,
    },
    2: {
      bg: COLORS.AMBER_50,
      fg: COLORS.AMBER_600,
    },
  };

  const indicatorColor = PRIORITY_COLORS[priorityLevel].fg;
  return (
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: 24,
        marginBottom: 1,
        backgroundColor: indicatorColor,
      }}
    />
  );
}

function TaskSummary({ task }: { task: Task }) {
  const formattedDueDate = formatDueDate(task.initiative_complete_by);

  const [checkDescriptionExpanded, setCheckDescriptionExpanded] =
    useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gridGap: 16,
        padding: 16,
      }}
    >
      <Box
        sx={{ flex: 1, display: "flex", flexDirection: "column", gridGap: 12 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gridGap: 4,
            fontWeight: 500,
            fontSize: 14,
            color: "#030712",
          }}
        >
          <Box>{task.check_name}</Box>
          <IconButton
            onClick={() =>
              setCheckDescriptionExpanded(!checkDescriptionExpanded)
            }
            size="small"
          >
            <ChevronRightIcon
              style={{
                opacity: 0.6,
                fontSize: 18,
                transform: checkDescriptionExpanded
                  ? "rotate(-90deg)"
                  : "rotate(90deg)",
              }}
            />
          </IconButton>
        </Box>
        {checkDescriptionExpanded && (
          <Box
            sx={{
              border: `1px solid ${COLORS.GRAY_200}`,
              borderRadius: 6,
              paddingTop: 4,
              paddingBottom: 4,
              paddingLeft: 8,
              paddingRight: 8,
            }}
          >
            {task.check_description}
          </Box>
        )}
        <Box>
          <Box sx={{ fontSize: 13, fontWeight: 500, lineHeight: "20px" }}>
            {task.initiative_name}
          </Box>
          <div
            style={{
              marginTop: 2,
              fontSize: 12,
              color: "#7f7f7f",
              lineHeight: "normal",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {task.initiative_description}
          </div>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gridGap: 16,
          fontSize: 13,
          color: COLORS.UI_GRAY_40,
          whiteSpace: "nowrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gridGap: 8 }}>
          Requested by
          <UserChip user={task.owner} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gridGap: 5 }}>
          <TimeIcon />
          <span style={{ whiteSpace: "nowrap" }}>Due {formattedDueDate}</span>
        </Box>
      </Box>
    </Box>
  );
}

function UserChip({ user }: { user: User }) {
  return (
    <Box
      sx={{
        height: 24,
        paddingLeft: 4,
        paddingRight: 8,
        display: "flex",
        alignItems: "center",
        gridGap: 8,
        border: `1px solid ${COLORS.GRAY_200}`,
        borderRadius: 24,
        fontSize: 12,
        fontWeight: 500,
        color: COLORS.GRAY_700,
      }}
    >
      <img
        src={user.avatar}
        alt={`${user.name}`}
        style={{ display: "block", height: 16, width: 16, borderRadius: 32 }}
      />
      <Box>{user.name}</Box>
    </Box>
  );
}

// TODO: Extract and reuse
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
