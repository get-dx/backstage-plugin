import React from "react";
import { COLORS } from "../styles";
import { OutputType, CustomOutputOptions } from "../api";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const CHECK_RESULT_STATUSES = {
  PASS: "PASS",
  WARN: "WARN",
  FAIL: "FAIL",
};

type CheckResultStatus = keyof typeof CHECK_RESULT_STATUSES;

export type CheckResultBadgeProps = {
  status: CheckResultStatus;
  isPublished: boolean;
  outputEnabled: boolean;
  outputValue: string | number | null;
  outputType: OutputType | null;
  outputCustomOptions?: CustomOutputOptions;
};

export function CheckResultBadge(props: CheckResultBadgeProps) {
  const {
    status,
    isPublished,
    outputEnabled,
    outputValue,
    outputType,
    outputCustomOptions,
  } = props;

  const outputValueFormatted = formatSqlOutputValue(
    outputValue,
    outputType,
    outputCustomOptions ?? null
  );

  let badgeText = "";
  let buttonStatusStyles = {};
  let IconComponent = null;

  if (status === CHECK_RESULT_STATUSES.PASS) {
    badgeText = "Passed";
    IconComponent = IconCheck;
    buttonStatusStyles = isPublished
      ? {
          border: "none",
          backgroundColor: COLORS.GREEN_50,
          color: COLORS.GREEN_600,
        }
      : {
          border: `1px dashed ${COLORS.GREEN_400}`,
          backgroundColor: "white",
          color: COLORS.GREEN_600,
        };
  } else if (status === CHECK_RESULT_STATUSES.WARN) {
    badgeText = "Passed";
    IconComponent = IconError;
    buttonStatusStyles = isPublished
      ? {
          border: "none",
          backgroundColor: COLORS.AMBER_50,
          color: COLORS.AMBER_600,
        }
      : {
          border: `1px dashed ${COLORS.AMBER_400}`,
          backgroundColor: "white",
          color: COLORS.AMBER_600,
        };
  } else if (status === CHECK_RESULT_STATUSES.FAIL) {
    badgeText = "Not passed";
    IconComponent = IconX;
    buttonStatusStyles = isPublished
      ? {
          border: "none",
          backgroundColor: COLORS.RED_50,
          color: COLORS.RED_600,
        }
      : {
          border: `1px dashed ${COLORS.RED_400}`,
          backgroundColor: "white",
          color: COLORS.RED_600,
        };
  } else {
    throw new Error(`Unknown check status: ${status}`);
  }

  return (
    <div
      style={{
        height: 24,
        maxWidth: "max-content",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontWeight: 400,
        borderWidth: 1,
        borderRadius: 3,
        fontSize: 13,
        paddingLeft: 4,
        paddingRight: 8,
        ...buttonStatusStyles,
      }}
    >
      <IconComponent />

      <span
        style={{
          whiteSpace: "nowrap",
          fontStyle:
            outputEnabled && outputValue === null ? "italic" : "normal",
        }}
      >
        {outputEnabled && outputValue !== null && outputValueFormatted}
        {outputEnabled && outputValue === null && "(No data)"}
        {!outputEnabled && badgeText}
      </span>
    </div>
  );
}

function IconCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        d="M7.49998 11.6895L5.03023 9.21973L3.96973 10.2802L7.49998 13.8105L14.7802 6.53023L13.7197 5.46973L7.49998 11.6895Z"
        fill={COLORS.GREEN_500}
      />
    </svg>
  );
}

function IconError() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        d="M8.25075 7.5H9.75075V11.25H8.25075V7.5ZM8.25 12H9.75V13.5H8.25V12Z"
        fill={COLORS.AMBER_500}
      />
      <path
        d="M10.3262 3.15002C10.0652 2.65877 9.55671 2.35352 9.00021 2.35352C8.44371 2.35352 7.93521 2.65877 7.67421 3.15077L2.17071 13.548C2.04858 13.7763 1.98809 14.0326 1.99519 14.2914C2.00229 14.5502 2.07675 14.8027 2.21121 15.024C2.34373 15.2463 2.53194 15.4302 2.75724 15.5575C2.98255 15.6848 3.23717 15.7512 3.49596 15.75H14.5045C15.0355 15.75 15.5162 15.4785 15.79 15.024C15.9242 14.8027 15.9985 14.5502 16.0056 14.2914C16.0127 14.0326 15.9524 13.7764 15.8305 13.548L10.3262 3.15002ZM3.49596 14.25L9.00021 3.85277L14.5082 14.25H3.49596Z"
        fill={COLORS.AMBER_500}
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        d="M12.144 4.758L8.96173 7.9395L5.78023 4.758L4.71973 5.8185L7.90123 9L4.71973 12.1815L5.78023 13.242L8.96173 10.0605L12.144 13.242L13.2045 12.1815L10.023 9L13.2045 5.8185L12.144 4.758Z"
        fill={COLORS.RED_500}
      />
    </svg>
  );
}

function formatSqlOutputValue(
  outputValue: string | number | null,
  outputType: OutputType | null,
  outputCustomOptions: CustomOutputOptions | null
): string | number | null {
  if (outputValue === null) {
    return null;
  }

  if (!outputType) {
    return outputValue;
  }

  switch (outputType) {
    case "string":
      return outputValue;
    case "number":
      return String(outputValue);
    case "percent": {
      const value = Number(outputValue);
      const rounded = Number((Math.round(value * 1000) / 1000).toFixed(3));
      return `${rounded}%`;
    }
    case "duration_seconds":
      return `${outputValue} ${pluralize("second", Number(outputValue))}`;
    case "duration_minutes":
      return `${outputValue} ${pluralize("minute", Number(outputValue))}`;
    case "duration_hours":
      return `${outputValue} ${pluralize("hour", Number(outputValue))}`;
    case "duration_days":
      return `${outputValue} ${pluralize("day", Number(outputValue))}`;
    case "currency_usd":
      return currencyFormatter.format(Number(outputValue));
    case "custom": {
      if (!outputCustomOptions) {
        throw new Error(
          "Output custom options are required for custom output type"
        );
      }
      return formatCustomOutputValue(Number(outputValue), outputCustomOptions);
    }
    default:
      throw new Error(`Unknown output type: ${outputType}`);
  }
}

function formatCustomOutputValue(
  outputValue: number,
  outputCustomOptions: CustomOutputOptions
): string {
  if (outputCustomOptions.decimals === "auto") {
    return `${outputValue} ${pluralize(outputCustomOptions.unit, outputValue)}`;
  }

  const valueWithDecimals = outputValue.toFixed(outputCustomOptions.decimals);

  return `${valueWithDecimals} ${pluralize(outputCustomOptions.unit, outputValue)}`;
}

function pluralize(text: string, count: number | null = null) {
  if (count !== null && count === 1) return text;

  // Special cases
  if (text === "person") return "people";
  if (text === "status") return "statuses";
  if (text === "match") return "matches";
  if (text === "alias") return "aliases";
  if (text === "is") return "are";

  // Words ending in "y"
  if (text.endsWith("y")) {
    const vowels = ["a", "e", "i", "o", "u"];
    if (!vowels.includes(text.charAt(text.length - 2))) {
      return `${text.substring(0, text.length - 1)}ies`;
    }
  }

  // Default case: add "s"
  return `${text}s`;
}
