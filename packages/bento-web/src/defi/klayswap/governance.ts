import { KlaytnChain } from '@bento/core/lib/chains';
import { KLAYTN_TOKENS, TokenInput } from '@bento/core/lib/tokens';

const klaytnChain = new KlaytnChain();
const provider = klaytnChain._provider;

export const KSP_ADDRESS = '0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654';
export const VOTING_KSP_ADDRESS = '0x2f3713f388bc4b8b364a7a2d8d57c5ff4e054830';
type Token = Partial<TokenInput> & {
  balance: number;
};
export const getGovernanceStake = async (account: string): Promise<Token> => {
  const votingKSPToken = new provider.klay.Contract(
    [
      {
        inputs: [{ internalType: 'address', name: 'who', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        type: 'function',
      },
    ],
    VOTING_KSP_ADDRESS,
  );

  const rawStakedBalance = await votingKSPToken.methods
    .balanceOf(account)
    .call();

  const kspTokenInfo = KLAYTN_TOKENS.find((v) => v.address === KSP_ADDRESS);
  const balance =
    Number(rawStakedBalance) / 10 ** (kspTokenInfo?.decimals || 18);
  return { ...kspTokenInfo, balance };
};
