import {
  ConfigApi,
  DiscoveryApi,
  createApiRef,
  FetchApi,
} from "@backstage/core-plugin-api";
import { ResponseError } from "@backstage/errors";
import packageJson from "../package.json";

export interface ScorecardsResponse {
  ok: true;
  scorecards: Scorecard[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export type Scorecard = LevelBasedScorecard | PointsBasedScorecard;

export type LevelBasedScorecard = {
  id: string;
  type: "LEVEL";
  name: string;
  checks: LevelBasedScorecardCheck[];

  levels: {
    id: string;
    name: string;
    color: string;
    rank: number;
  }[];
  empty_level: {
    label: string | null;
    color: string | null;
  };
  current_level: {
    id: string;
    name: string;
    color: string;
  } | null;
};

export type PointsBasedScorecard = {
  id: string;
  type: "POINTS";
  name: string;
  checks: PointsBasedScorecardCheck[];

  points_meta: {
    points_achieved: number;
    points_total: number;
  };
  check_groups: ScorecardCheckGroup[];
};

export type ScorecardCheckGroup = {
  id: string;
  name: string;
};

export type ScorecardCheck =
  | LevelBasedScorecardCheck
  | PointsBasedScorecardCheck;

export type PointsBasedScorecardCheck = CheckCommon & {
  points: number;
  check_group: {
    id: string;
    name: string;
  };
};

export type LevelBasedScorecardCheck = CheckCommon & {
  level: {
    id: string;
    name: string;
  };
};

type CheckCommon = {
  id: string;
  name: string;
  description: string;
  published: boolean;
  output: Output | null;
  message: string | null;
  related_property: string | null;
  passed: boolean;
  status: "PASS" | "FAIL" | "WARN";
  executed_at: string | null;
};

export type Output = {
  type: OutputType;
  value: string | number | null;
  custom_options?: CustomOutputOptions;
};

export type OutputType =
  | "string"
  | "number"
  | "percent"
  | "currency_usd"
  | "duration_seconds"
  | "duration_minutes"
  | "duration_hours"
  | "duration_days"
  | "custom";

export type CustomOutputOptions = {
  unit: "string";
  decimals: "auto" | number;
};

export type TasksResponse = {
  ok: true;
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

export type Task = {
  check: {
    id: string;
    description: string;
    external_url: string | null;
    name: string;
  };
  entity_check_issue: {
    id: string;
    url: string;
  } | null;
  initiative: {
    id: string;
    complete_by: string;
    description: string;
    name: string;
    priority: number;
  };
  owner: User;
};

export type User = {
  avatar: string;
  email: string;
  id: number;
  name: string;
  slack_ext_id?: string;
};

export interface DatafeedResponse {
  data: {
    rows: any[][];
    columns: string[];
  };
}

export interface DXApi {
  scorecards(entityIdentifier: string): Promise<ScorecardsResponse>;
  tasks(entityIdentifier: string): Promise<TasksResponse>;
  datafeed(
    datafeedToken: string,
    variables?: Record<string, string | number | boolean>,
  ): Promise<DatafeedResponse>;
}

export const dxApiRef = createApiRef<DXApi>({
  id: "plugin.dx-api.service",
});

export class DXApiClient implements DXApi {
  discoveryApi: DiscoveryApi;
  configApi: ConfigApi;
  fetchApi: FetchApi;

  constructor({
    discoveryApi,
    configApi,
    fetchApi,
  }: {
    discoveryApi: DiscoveryApi;
    configApi: ConfigApi;
    fetchApi: FetchApi;
  }) {
    this.discoveryApi = discoveryApi;
    this.configApi = configApi;
    this.fetchApi = fetchApi;
  }

  scorecards(entityIdentifier: string) {
    return this.getFromApp<ScorecardsResponse>("/entities.scorecards", {
      identifier: entityIdentifier,
      page: "1",
      limit: "10",
    });
  }

  tasks(entityIdentifier: string) {
    return this.getFromApp<TasksResponse>("/entities.tasks", {
      identifier: entityIdentifier,
      page: "1",
      limit: "50",
    });
  }

  datafeed(
    datafeedToken: string,
    variables: Record<string, string | number | boolean> = {},
  ) {
    const params: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined) {
        params[`var-${key}`] = value;
      }
    }
    return this.getFromApp<DatafeedResponse>(
      `/datacloud/datafeed/${datafeedToken}.json`,
      params,
    );
  }

  private async getFromApp<T = any>(
    path: string,
    params: Record<string, string | number | boolean | null | undefined>,
  ): Promise<T> {
    const proxyHost = `${await this.discoveryApi.getBaseUrl("proxy")}/dx-web-api`;

    const url = new URL(`${proxyHost}${path}`);

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    }

    const { fetch } = this.fetchApi;

    const headers: Record<string, string> = {
      "X-Client-Type": "backstage-plugin",
      "X-Client-Version": packageJson.version,
    };

    const appId = this.appId();
    if (appId) {
      headers["X-DX-App-Id"] = appId;
    }

    const resp = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!resp.ok) throw await ResponseError.fromResponse(resp);

    return await resp.json();
  }

  private appId() {
    return this.configApi.getOptionalString("dx.appId");
  }
}
