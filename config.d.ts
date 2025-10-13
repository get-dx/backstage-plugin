export interface Config {
  /** Configuration options for the DX plugin */
  dx?: {
    /**
     * Optional 'appId' attribute used by DX to differentiate Backstage applications.
     * Most useful when you have multiple Backstage applications.
     * If not provided, it will be set by DX.
     *
     * @visibility frontend
     */
    appId?: string;

    /**
     * Optional datafeed tokens that can be referenced by name in DxDataChartCard components.
     * This allows tokens to be stored in secret managers and referenced securely
     * instead of hardcoding them directly in the code.
     *
     * Example:
     *   datafeedTokens:
     *     deploymentFrequency: ${DEPLOYMENT_FREQUENCY_TOKEN}
     *     changeFailRate: ${CHANGE_FAIL_RATE_TOKEN}
     *
     * @visibility frontend
     */
    datafeedTokens?: {
      [tokenName: string]: string;
    };
  };
}
