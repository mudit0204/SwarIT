import type { AppConfig } from './lib/types';

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'SwarIT',
  pageTitle: 'SwarIT',
  pageDescription: 'A voice agent built with LiveKit',

  supportsChatInput: true,
  supportsVideoInput: true,
  supportsScreenShare: true,
  isPreConnectBufferEnabled: true,

  accent: '#002cf2',
  accentDark: '#1fd5f9',
  startButtonText: 'Start call',

  agentName: undefined,
  logo: '',
};
