// import { TokenInput } from '@bento/core';
import findWorkspaceRoot from 'find-yarn-workspace-root';

// import TSON from 'typescript-json';

export const TRUSTWALLET_ASSETS_PATH = './assets/trustwallet-assets';
export const WORKSPACE_ROOT_PATH = findWorkspaceRoot(null) ?? '';
// export const stringify = TSON.createStringifier<TokenInput[]>();
export const stringify = JSON.stringify;
