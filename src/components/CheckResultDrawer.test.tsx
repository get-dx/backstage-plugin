import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CheckResultDrawer } from "./CheckResultDrawer";
import { LevelBasedScorecardCheck } from "../api";
import { COLORS } from "../styles";

const check: LevelBasedScorecardCheck = {
  id: "rcw3pkmrxp8j",
  name: "Internal dependencies",
  description: "Set the internal-dependency-documentation DX property.",
  published: true,
  output: { type: "string", value: "Needs doc link" },
  message: null,
  related_properties: null,
  passed: false,
  status: "FAIL",
  executed_at: null,
  level: { id: "92ktdhy45tls", name: "Required" },
};

function renderDrawer({
  onEditRelatedProperty = () => {},
  ...overrides
}: Partial<LevelBasedScorecardCheck> & {
  onEditRelatedProperty?: () => void;
} = {}) {
  return render(
    <CheckResultDrawer
      check={{ ...check, ...overrides }}
      open
      onClose={() => {}}
      onEditRelatedProperty={onEditRelatedProperty}
    />
  );
}

describe("CheckResultDrawer", () => {
  it("lists a single related property", () => {
    renderDrawer({
      related_properties: ["internal-dependency-documentation"],
    });

    expect(screen.getByText("Related property:")).toBeInTheDocument();
    expect(
      screen.getByText("internal-dependency-documentation")
    ).toBeInTheDocument();
  });

  it("lists every related property when a check has several", () => {
    renderDrawer({
      related_properties: ["scaling-thresholds", "task-count"],
    });

    expect(screen.getByText("Related properties:")).toBeInTheDocument();
    expect(screen.getByText("scaling-thresholds")).toBeInTheDocument();
    expect(screen.getByText("task-count")).toBeInTheDocument();
  });

  it("sets an explicit text color on the property chip so dark themes stay legible", () => {
    renderDrawer({
      related_properties: ["internal-dependency-documentation"],
    });

    expect(
      screen.getByText("internal-dependency-documentation")
    ).toHaveStyle({ color: COLORS.GRAY_700 });
  });

  it("offers an edit affordance for the related properties", async () => {
    const onEditRelatedProperty = jest.fn();
    renderDrawer({
      related_properties: ["internal-dependency-documentation"],
      onEditRelatedProperty,
    });

    await userEvent.click(screen.getByRole("button", { name: "Edit in DX" }));

    expect(onEditRelatedProperty).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["null", null],
    ["empty", []],
  ])("omits the related property section when %s", (_label, related) => {
    renderDrawer({ related_properties: related as string[] | null });

    expect(screen.queryByText(/^Related propert/)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Edit in DX" })
    ).not.toBeInTheDocument();
  });
});
