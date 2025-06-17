import React from "react";

type DataStudioWidgetProps = {
  token: string;
  entityIdentifier: string | string[];
  vars?: Record<string, string | string[]>;
} & React.IframeHTMLAttributes<HTMLIFrameElement>;

const DataStudioWidget = ({
  token,
  entityIdentifier,
  vars = {},
  ...props
}: DataStudioWidgetProps) => {
  const queryParams = new URLSearchParams();

  if (Array.isArray(entityIdentifier)) {
    entityIdentifier.forEach((id) =>
      queryParams.append("var-entity_identifiers[]", id)
    );
  } else {
    queryParams.append("var-entity_identifiers[]", entityIdentifier);
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

export { DataStudioWidget };
