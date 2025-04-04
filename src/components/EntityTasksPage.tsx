import React, { useState } from "react";
import {
  ContentHeader,
  Progress,
  ResponseErrorPanel,
  SupportButton,
  BottomLink,
} from "@backstage/core-components";
import { useApi } from "@backstage/core-plugin-api";
import { useEntity } from "@backstage/plugin-catalog-react";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ScheduleIcon from "@material-ui/icons/Schedule";
import useAsync from "react-use/lib/useAsync";
import { DateTime } from "luxon";

import { dxApiRef, Task, User } from "../api";
import { COLORS, TASK_PRIORITY_COLORS } from "../styles";
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

      {tasks.length === 0 && (
        <Box sx={{ textAlign: "center", padding: 16 }}>
          No outstanding tasks for this entity!
        </Box>
      )}

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
  const { entity } = useEntity();
  const entityIdentifier = entity.metadata.name;
  const entityTasksUrl = `https://app.getdx.com/catalog/${entityIdentifier}/tasks`;

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
        {tasks.map((task, idx) => (
          <Box
            key={`${task.check_id}-${task.initiative_id}`}
            sx={{
              borderTop: idx === 0 ? "none" : `1px solid ${COLORS.GRAY_200}`,
            }}
          >
            <TaskSummary task={task} />
          </Box>
        ))}
      </Box>
      <BottomLink link={entityTasksUrl} title="View tasks in DX" />
    </Card>
  );
}

function PriorityIndicator({ priorityLevel }: { priorityLevel: number }) {
  const indicatorColor = TASK_PRIORITY_COLORS[priorityLevel].fg;
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
  const { entity } = useEntity();
  const entityIdentifier = entity.metadata.name;
  const entityTasksUrl = `https://app.getdx.com/catalog/${entityIdentifier}/tasks`;

  const [checkDescriptionExpanded, setCheckDescriptionExpanded] =
    useState(false);

  const formattedDueDate = formatDueDate(task.initiative_complete_by);
  const dueDateStatusColor = getDueDateStatusColor(task.initiative_complete_by);

  return (
    <Link
      href={entityTasksUrl}
      target="_blank"
      style={{ textDecoration: "none", color: "#181818" }}
    >
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
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gridGap: 12,
          }}
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
              onClick={(e) => {
                e.preventDefault();
                setCheckDescriptionExpanded(!checkDescriptionExpanded);
              }}
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
          <Box>
            <ChevronRightIcon
              style={{ color: COLORS.GRAY_300, fontSize: 24 }}
            />
          </Box>
        </Box>
      </Box>
    </Link>
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
