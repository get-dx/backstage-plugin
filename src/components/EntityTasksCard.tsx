import React from "react";
import { InfoCard } from "@backstage/core-components";

import { BrandedCardTitle } from "./BrandedCardTitle";

export function EntityTasksCard() {
  return (
    <InfoCard title={<BrandedCardTitle title="Tasks" />} variant="gridItem">
      Hello world
    </InfoCard>
  );
}
