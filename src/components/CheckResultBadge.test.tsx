import React from "react";
import { render, screen } from "@testing-library/react";
import { CheckResultBadge, CheckResultBadgeProps } from "./CheckResultBadge";

function renderBadge(props: Partial<CheckResultBadgeProps> = {}) {
  return render(
    <CheckResultBadge
      status="PASS"
      isPublished
      outputEnabled
      outputValue={null}
      outputType={null}
      {...props}
    />
  );
}

describe("CheckResultBadge", () => {
  it("renders a custom unit with singular value", () => {
    renderBadge({
      outputValue: 1,
      outputType: "custom",
      outputCustomOptions: { unit: "trace metric", decimals: 0 },
    });

    expect(screen.getByText("1 trace metric")).toBeInTheDocument();
  });

  it("renders a custom unit with plural value", () => {
    renderBadge({
      outputValue: 4,
      outputType: "custom",
      outputCustomOptions: { unit: "trace metric", decimals: 0 },
    });

    expect(screen.getByText("4 trace metrics")).toBeInTheDocument();
  });

  it("renders a custom unit verbatim when decimals are automatic", () => {
    renderBadge({
      outputValue: 89,
      outputType: "custom",
      outputCustomOptions: { unit: "char", decimals: "auto" },
    });

    expect(screen.getByText("89 chars")).toBeInTheDocument();
  });

  it("formats a custom value to the requested number of decimals", () => {
    renderBadge({
      outputValue: 0,
      outputType: "custom",
      outputCustomOptions: { unit: "% time > 90% util", decimals: 2 },
    });

    expect(screen.getByText("0.00 % time > 90% utils")).toBeInTheDocument();
  });

  it("pluralizes built-in duration units", () => {
    renderBadge({ outputValue: 3, outputType: "duration_days" });

    expect(screen.getByText("3 days")).toBeInTheDocument();
  });

  it("keeps built-in duration units singular for a count of one", () => {
    renderBadge({ outputValue: 1, outputType: "duration_days" });

    expect(screen.getByText("1 day")).toBeInTheDocument();
  });

  it("falls back to the status text when output is disabled", () => {
    renderBadge({
      status: "FAIL",
      outputEnabled: false,
      outputValue: 4,
      outputType: "number",
    });

    expect(screen.getByText("Not passed")).toBeInTheDocument();
  });

  it("shows a no-data placeholder when output is enabled but empty", () => {
    renderBadge({ outputType: "number" });

    expect(screen.getByText("(No data)")).toBeInTheDocument();
  });
});
