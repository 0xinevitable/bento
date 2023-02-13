// Credits to @devxoul; We made this at PocketLesson
import { Config } from '../utils';

enum Environment {
  off = 0,
  debug = 1,
  development = 2,
  production = 3,
}

const definedFeatures = {
  isProfileEnabled: Environment.production,
  isProfileLinksEnabled: Environment.off,
  isProfileRSSSubscriptionEnabled: Environment.off,
  isProfileQuestionsEnabled: Environment.off,
  isProfileDetailedEditorEnabled: Environment.development,
  isEmailMagicLinkEnabled: Environment.off,
  isKlaytnDeFiEnabled: Environment.production,
  isBadgeMockupsEnabled: Environment.off,
  isSearchEnabled: Environment.off,
};

type FeatureName = keyof typeof definedFeatures;
const getFeatureFlags = (features: {
  [name in FeatureName]: Environment;
}) => {
  const buildTier = Environment[Config.ENVIRONMENT];

  return Object.entries(features).reduce((state, [name, featureTier]) => {
    const isEnabled = featureTier >= buildTier;
    return { ...state, [name]: isEnabled };
  }, {} as { [name in FeatureName]: boolean });
};
export const FeatureFlags = getFeatureFlags(definedFeatures);
