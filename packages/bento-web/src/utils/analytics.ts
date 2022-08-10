import { Session } from '@supabase/supabase-js';

import { WALLETS } from '@/components/WalletConnector';
import { KEYS_BY_NETWORK } from '@/dashboard/utils/useWalletBalances';

const isBrowser = typeof window !== 'undefined';

export type AnalyticsEvent = {
  view_landing: undefined;
  view_landing_section: {
    section: string;
  };

  view_dashboard_landing: undefined;
  view_dashboard_landing_section: {
    section: string;
  };

  click_dashboard_landing_link: {
    medium: 'landing';
  };
  click_app_link: {
    medium: 'landing' | 'dashboard_landing';
  };
  click_team_link: {
    medium: 'dashboard_landing';
  };

  view_dashboard_tab: undefined;

  view_dashboard_login: undefined;
  click_dashboard_login: {
    title: string;
  };
  sign_in: {
    anonymous: false;
  };

  // Dashboard View
  view_dashboard_connect_wallet: undefined;
  click_dashboard_connect_wallet: {
    title: string;
  };

  // 지갑 연결 모달
  view_connect_wallet: undefined;
  click_connect_wallet_select_chain: {
    type: keyof typeof KEYS_BY_NETWORK;
  };
  click_connect_wallet_select_wallet: {
    type: keyof typeof WALLETS | 'metamask-or-walletconnect';
  };
  connect_wallet: {
    type: keyof typeof WALLETS | 'metamask-or-walletconnect';
    networks: (keyof typeof KEYS_BY_NETWORK)[];
    address: string;
  };

  view_dashboard_main: undefined;
  click_dashboard_main_hide_wallet_list: undefined;
  click_dashboard_main_show_wallet_list: undefined;

  click_copy_wallet_address: {
    type: 'evm' | 'cosmos-sdk' | 'solana';
    address: string;
  };
  click_show_all_wallets: undefined;
  click_show_less_wallets: undefined;

  click_show_nfts: undefined;
  click_hide_nfts: undefined;
  click_balance_item: {
    name: string;
    symbol: string | undefined;
    platform: string;
    address: string | undefined;
  };

  click_logout: {
    medium: 'gnb';
  };
  click_social_link: {
    type: 'github' | 'twitter';
    medium: 'gnb';
  };
  click_landing_link: {
    title: string;
    medium: 'gnb' | 'dashboard_login' | 'dashboard_connect_wallet';
  };
};

const AMPLITUDE_API_KEY = '705bcde0ed4620f7f2815b1e095c50f6';
const getEnvironment = () => {
  if (!isBrowser) {
    return '';
  }
  return window.location.host.includes('localhost')
    ? 'debug'
    : window.location.host.includes('bento.finance')
    ? 'production'
    : 'development';
};

async function getAmplitude() {
  if (isBrowser) {
    const amplitude = await import('amplitude-js');
    return amplitude.default.getInstance();
  }
  return undefined;
}

async function initialize() {
  const amplitude = await getAmplitude();
  amplitude?.init(AMPLITUDE_API_KEY);
  const ENVIRONMENT = getEnvironment();
  amplitude?.setUserProperties({
    is_debug: ENVIRONMENT !== 'production',
  });
}

async function logEvent<TName extends keyof AnalyticsEvent>(
  name: TName,
  properties: AnalyticsEvent[TName],
) {
  const eventProperties = {
    referrer: document.referrer || undefined,
    ...(properties as unknown as object),
  };
  const ENVIRONMENT = getEnvironment();
  if (ENVIRONMENT !== 'production') {
    console.log('[Analytics]', name, eventProperties);
  }
  const amplitude = await getAmplitude();
  amplitude?.logEvent(name, eventProperties);
}

export async function updateUserProperties(session: Session | null) {
  const userId = session?.user?.id ?? null;
  const amplitude = await getAmplitude();
  amplitude?.setUserId(userId);

  console.debug('[Analytics] Set user id:', userId);
}

export const Analytics = {
  getAmplitude,
  initialize,
  logEvent,
  updateUserProperties,
};
