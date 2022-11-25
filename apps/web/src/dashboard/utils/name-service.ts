type AccountInfo = {
  type: 'evm';
  account: string;
  domain: string | null;
};
export const resolveSearch = async (
  value: string,
): Promise<null | AccountInfo> => {
  let account: string | null = null;
  let domain: string | null = null;

  if (!value) {
    return null;
  }

  const { JsonRpcProvider } = await import('@ethersproject/providers');
  const provider = new JsonRpcProvider('https://cloudflare-eth.com');

  if (value.endsWith('.eth')) {
    account = await provider.resolveName(value.toLowerCase()).catch(() => null);
    if (!account) {
      return null;
    }
    domain = value;
  } else {
    account = value;
    domain = await provider.lookupAddress(account).catch(() => null);
  }

  account = account.toLowerCase();

  return {
    type: 'evm',
    account,
    domain,
  };
};
