const isBrowser = typeof window !== 'undefined';

type AnalyticsEvent = {
  view_landing: undefined;
};

// FIXME: Replace these with proper config
const AMPLITUDE_API_KEY = '4d0b724074f2c12644648cd87755bfe5';
const getEnvironment = () => {
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

export const Analytics = {
  getAmplitude,
  initialize,
  logEvent,
};
