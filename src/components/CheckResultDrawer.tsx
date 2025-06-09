import React from "react";
import { DateTime } from "luxon";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

import { ScorecardCheck } from "../api";
import { COLORS } from "../styles";
import { CheckResultBadge } from "./CheckResultBadge";

type CheckResultDrawerProps = {
  check: ScorecardCheck;
  open: boolean;
  onClose: () => void;
};

export function CheckResultDrawer({
  check,
  open,
  onClose,
}: CheckResultDrawerProps) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box width="500px">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gridGap: 2,
          }}
        >
          Check details
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box>{check.name}</Box>
        <CheckResultBadge
          status={check.status}
          isPublished={check.published}
          outputEnabled={!!check.output}
          outputValue={check.output?.value ?? null}
          outputType={check.output?.type ?? null}
        />
        {check.executed_at && (
          <Box>
            {DateTime.fromISO(check.executed_at, {
              zone: "utc",
            }).toRelative()}
          </Box>
        )}

        <Section title="Description">
          {check.description || (
            <span style={{ color: COLORS.GRAY_500, fontStyle: "italic" }}>
              No description
            </span>
          )}
        </Section>
      </Box>
    </Drawer>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gridGap: 1 }}>
      <Box fontWeight="bold">{title}</Box>
      <Box>{children}</Box>
    </Box>
  );
}
