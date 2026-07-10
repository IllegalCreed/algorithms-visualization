export interface CampaignParams {
  source: string;
  medium: string;
  campaign: string;
  content: string;
}

export interface AttributionTouch {
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
}

export interface AttributionState {
  version: 1;
  first: AttributionTouch;
  current: AttributionTouch;
}

export type AnalyticsPageType = 'home' | 'guide' | 'algorithm' | 'other';
export type AnalyticsDeployment = 'development' | 'pages' | 'selfhost';

export interface AnalyticsEventPayloads {
  page_view: {
    path: string;
    page_name: string;
    page_type: AnalyticsPageType;
  };
  search: {
    action: 'select' | 'no_result';
    query_length: number;
    result_count: number;
    selected_slug?: string;
  };
  play: {
    algorithm: string;
    trigger: 'control' | 'keyboard';
    step_index: number;
  };
  input_apply: {
    algorithm: string;
    item_count: number;
  };
  quiz_complete: {
    algorithm: string;
    correct: number;
    total: number;
  };
  share: {
    channel: 'weibo' | 'x';
    path: string;
  };
  language_switch: {
    from: 'zh-CN' | 'en';
    to: 'zh-CN' | 'en';
    path: string;
  };
}

export type AnalyticsEventName = keyof AnalyticsEventPayloads;
export type AnalyticsProperty = string | number | boolean;
export type AnalyticsProperties = Record<string, AnalyticsProperty>;

export type AnalyticsConfig =
  | {
      provider: 'none';
      deployment: AnalyticsDeployment;
    }
  | {
      provider: 'umami';
      deployment: AnalyticsDeployment;
      scriptUrl: string;
      websiteId: string;
    };
