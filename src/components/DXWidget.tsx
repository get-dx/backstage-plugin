import React from "react";

type DXWidgetProps = {
  token: string;
  entityIdentifier: string | string[];
  vars?: Record<string, string | string[]>;
} & React.IframeHTMLAttributes<HTMLIFrameElement>;

const DXWidget = ({
  token,
  entityIdentifier,
  vars = {},
  ...props
}: DXWidgetProps) => {
  const queryParams = new URLSearchParams();

  if (Array.isArray(entityIdentifier)) {
    entityIdentifier.forEach((id) =>
      queryParams.append("var-entity_ids[]", id)
    );
  } else {
    queryParams.append("var-entity_ids[]", entityIdentifier);
  }

  Object.entries(vars).forEach(([key, value]) => {
    const queryKey = `var-${key}[]`;

    if (Array.isArray(value)) {
      value.forEach((v) => queryParams.append(queryKey, v));
    } else {
      queryParams.append(queryKey, value);
    }
  });

  return (
    <iframe
      id={token}
      title={`DX Widget - ${token}`}
      src={`http://localhost:3000/widgets/${token}?${queryParams.toString()}`}
      {...props}
    />
  );
};

export { DXWidget };