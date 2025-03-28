import {
  ConfigApi,
  DiscoveryApi,
  createApiRef,
  FetchApi,
} from "@backstage/core-plugin-api";
import { ResponseError } from "@backstage/errors";

export interface ChartResponse {
  data: { label: string; value: number; date: string }[];
  unit: string;
  total: number;
}

export interface TopContributorsResponse {
  data: { label: string; value: number; date: string }[];
}

export interface ScorecardsResponse {
  ok: true;
  scorecards: Scorecard[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export type Scorecard = {
  id: string;
  name: string;
  empty_level: {
    label: string | null;
    color: string | null;
  };
  checks: ScorecardCheck[];
  current_level: {
    id: string;
    name: string;
    color: string;
  } | null;
};

export type ScorecardCheck = {
  id: string;
  level: {
    id: string;
    name: string;
  };
  name: string;
  published: boolean;
  output: {
    type: OutputType;
    value: string | number | null;
  } | null;
  passed: boolean;
  status: "PASS" | "FAIL" | "WARN";
};

export type OutputType =
  | "string"
  | "number"
  | "percent"
  | "currency_usd"
  | "duration_seconds"
  | "duration_minutes"
  | "duration_hours"
  | "duration_days";

export type TasksResponse = {
  ok: true;
  tasks: Task[];
};

export type Task = {
  check_description: string;
  check_external_url: string | null;
  check_id: string;
  check_name: string;
  check_public_id: string;
  entity_check_issue_public_id: string | null;
  entity_check_issue_url: string | null;
  initiative_complete_by: string;
  initiative_description: string;
  initiative_name: string;
  initiative_priority: number;
  initiative_public_id: string;
  owner: {
    avatar: string;
    email: string;
    id: number;
    name: string;
    slack_ext_id?: string;
  };
};

export interface DXApi {
  changeFailureRate(entityRef: string): Promise<ChartResponse>;
  deploymentFrequency(entityRef: string): Promise<ChartResponse>;
  openToDeploy(entityRef: string): Promise<ChartResponse>;
  timeToRecovery(entityRef: string): Promise<ChartResponse>;
  topContributors(entityRef: string): Promise<TopContributorsResponse>;
  scorecards(entityIdentifier: string): Promise<ScorecardsResponse>;
  tasks(entityIdentifier: string): Promise<TasksResponse>;
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

  changeFailureRate(entityRef: string) {
    return this.get<ChartResponse>("/api/backstage.changeFailureRate", {
      entityRef,
      appId: this.appId(),
    });
  }

  deploymentFrequency(entityRef: string) {
    return this.get<ChartResponse>("/api/backstage.deploymentFrequency", {
      entityRef,
      appId: this.appId(),
    });
  }

  openToDeploy(entityRef: string) {
    return this.get<ChartResponse>("/api/backstage.openToDeploy", {
      entityRef,
      appId: this.appId(),
    });
  }

  timeToRecovery(entityRef: string) {
    return this.get<ChartResponse>("/api/backstage.timeToRecovery", {
      entityRef,
      appId: this.appId(),
    });
  }

  topContributors(entityRef: string) {
    return this.get<TopContributorsResponse>("/api/backstage.topContributors", {
      entityRef,
      appId: this.appId(),
    });
  }

  scorecards(entityIdentifier: string) {
    return this.getFromApp<ScorecardsResponse>("/entities.scorecards", {
      identifier: entityIdentifier,
      page: "1",
      limit: "10",
    });
  }

  tasks(entityIdentifier: string) {
    return this.getFromApp<ScorecardsResponse>("/entities.tasks", {
      identifier: entityIdentifier,
    });
  }

  private async get<T = any>(
    path: string,
    params: Record<string, string | null | undefined>,
  ): Promise<T> {
    const proxyHost = `${await this.discoveryApi.getBaseUrl("proxy")}/dx`;

    const url = new URL(`${proxyHost}${path}`);

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    }

    const { fetch } = this.fetchApi;

    const resp = await fetch(url, { method: "GET" });

    if (!resp.ok) throw await ResponseError.fromResponse(resp);

    return await resp.json();
  }

  private async getFromApp<T = any>(
    path: string,
    params: Record<string, string | null | undefined>,
  ): Promise<T> {
    const proxyHost = `${await this.discoveryApi.getBaseUrl("proxy")}/dx-app`;

    const url = new URL(`${proxyHost}${path}`);

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    }

    const { fetch } = this.fetchApi;

    const resp = await fetch(url, { method: "GET" });

    if (!resp.ok) throw await ResponseError.fromResponse(resp);

    return await resp.json();
  }

  private appId() {
    return this.configApi.getOptionalString("dx.appId");
  }
}
