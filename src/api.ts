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
  checks: ScorecardCheck[];
  current_level: {
    id: string;
    name: string;
  } | null;
  id: string;
  name: string;
};

export type ScorecardCheck = {
  id: string;
  level: {
    id: string;
    name: string;
  };
  name: string;
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

export interface DXApi {
  changeFailureRate(entityRef: string): Promise<ChartResponse>;
  deploymentFrequency(entityRef: string): Promise<ChartResponse>;
  openToDeploy(entityRef: string): Promise<ChartResponse>;
  timeToRecovery(entityRef: string): Promise<ChartResponse>;
  topContributors(entityRef: string): Promise<TopContributorsResponse>;
  scorecards(entityIdentifier: string): Promise<ScorecardsResponse>;
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
    return this.getFromApp<ScorecardsResponse>("/entities.scorecardsReport", {
      identifier: entityIdentifier,
      page: "1",
      limit: "10",
      // appId: this.appId(),
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
