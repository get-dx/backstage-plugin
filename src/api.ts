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

export interface DXApi {
  changeFailureRate(entityRef: string): Promise<ChartResponse>;
  deploymentFrequency(entityRef: string): Promise<ChartResponse>;
  openToDeploy(entityRef: string): Promise<ChartResponse>;
  timeToRecovery(entityRef: string): Promise<ChartResponse>;
  topContributors(entityRef: string): Promise<TopContributorsResponse>;
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

  private appId() {
    return this.configApi.getOptionalString("dx.appId");
  }
}
