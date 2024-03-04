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
  };
}
