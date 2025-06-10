import React from "react";
import { DateTime } from "luxon";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

import { ScorecardCheck } from "../api";
import { COLORS } from "../styles";
import { CheckResultBadge } from "./CheckResultBadge";
import { MarkdownRenderer } from "./MarkdownRenderer";

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
            alignItems: "center",
            justifyContent: "space-between",
            gridGap: 16,
            paddingLeft: 16,
            paddingRight: 16,
            height: 48,
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          Check details
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gridGap: 16,
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 24,
            paddingBottom: 24,
            borderTop: `1px solid ${COLORS.GRAY_200}`,
          }}
        >
          <Box sx={{ fontSize: 18, fontWeight: "bold" }}>{check.name}</Box>
          <Box sx={{ display: "flex", alignItems: "center", gridGap: 16 }}>
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
          </Box>
        </Box>

        <Section title="Description">
          {check.description || (
            <span style={{ color: COLORS.GRAY_500, fontStyle: "italic" }}>
              No description
            </span>
          )}

          {check.related_property && (
            <Box>
              <span>Related property: {check.related_property}</span>
              <span>Edit in DX</span>
            </Box>
          )}
        </Section>

        {check.message && (
          <Section title="Message">
            <Box
              sx={{
                padding: 12,
                border: `1px solid ${COLORS.GRAY_200}`,
                borderRadius: 6,
              }}
            >
              <MarkdownRenderer markdown={check.message} />
            </Box>
          </Section>
        )}
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gridGap: 16,
        padding: 16,
        borderTop: `1px solid ${COLORS.GRAY_200}`,
      }}
    >
      <Box fontWeight="bold">{title}</Box>
      <Box>{children}</Box>
    </Box>
  );
}
