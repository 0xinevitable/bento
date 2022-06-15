import { ERC20TokenInput } from '@bento/core/lib/tokens';
import findWorkspaceRoot from 'find-yarn-workspace-root';
import TSON from 'typescript-json';

export const TRUSTWALLET_ASSETS_PATH = './assets/trustwallet-assets';
export const WORKSPACE_ROOT_PATH = findWorkspaceRoot(null) ?? '';
export const stringify = TSON.createStringifier<ERC20TokenInput[]>();
