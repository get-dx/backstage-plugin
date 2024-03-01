import {
  ConfigApi,
  DiscoveryApi,
  createApiRef,
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
  leadTime(entityRef: string): Promise<ChartResponse>;
  topContributors(entityRef: string): Promise<TopContributorsResponse>;
}

export const dxApiRef = createApiRef<DXApi>({
  id: "plugin.dx-api.service",
});

export class DXApiClient implements DXApi {
  discoveryApi: DiscoveryApi;
  configApi: ConfigApi;

  constructor({
    discoveryApi,
    configApi,
  }: {
    discoveryApi: DiscoveryApi;
    configApi: ConfigApi;
  }) {
    this.discoveryApi = discoveryApi;
    this.configApi = configApi;
  }

  async changeFailureRate(entityRef: string) {
    return this.fetch<ChartResponse>(
      `/api/backstage.changeFailureRate?entityRef=${entityRef}&appId=${this.appId()}`,
    );
  }

  async deploymentFrequency(entityRef: string) {
    return this.fetch<ChartResponse>(
      `/api/backstage.deploymentFrequency?entityRef=${entityRef}&appId=${this.appId()}`,
    );
  }

  async leadTime(entityRef: string) {
    return this.fetch<ChartResponse>(
      `/api/backstage.leadTime?entityRef=${entityRef}&appId=${this.appId()}`,
    );
  }

  topContributors(entityRef: string) {
    return this.fetch<TopContributorsResponse>(
      `/api/backstage.topContributors?entityRef=${entityRef}&appId=${this.appId()}`,
    );
  }

  private async fetch<T = any>(path: string, init?: RequestInit): Promise<T> {
    const proxyUri = `${await this.discoveryApi.getBaseUrl("proxy")}/dx`;

    const resp = await fetch(`${proxyUri}${path}`, init);

    if (!resp.ok) throw await ResponseError.fromResponse(resp);

    return await resp.json();
  }

  private appId() {
    return this.configApi.getOptionalString("dx.appId");
  }
}
