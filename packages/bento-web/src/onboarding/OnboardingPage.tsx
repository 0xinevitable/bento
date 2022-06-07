import { useCallback } from 'react';
import styled from 'styled-components';

import { PageContainer } from '@/components/PageContainer';
import { FieldInput } from '@/profile/components/FieldInput';

declare global {
  interface Window {
    keplr: any;
  }
}

const OnboardingPage: React.FC = () => {
  const connectKeplr = useCallback(async () => {
    if (typeof window.keplr === 'undefined') {
      window.alert('Please install keplr extension');
    } else {
      const chainId = 'cosmoshub-4';
      await window.keplr.enable(chainId);

      const offlineSigner = window.keplr.getOfflineSignerOnlyAmino(chainId);
      const accounts = await offlineSigner.getAccounts();
      const account = accounts[0].address;

      const { pub_key: publicKey, signature } =
        await window.keplr.signArbitrary(chainId, account, 'waka');
      console.log({ publicKey, signature, account });
    }
  }, []);

  return (
    <PageContainer>
      <FieldInput field="Username" />

      <div className="flex gap-2">
        <Button className="p-4 text-slate-800 font-bold bg-slate-300">
          MetaMask
        </Button>

        <Button className="p-4 text-slate-800 font-bold bg-slate-300">
          Kaikas
        </Button>

        <Button
          className="p-4 text-slate-800 font-bold bg-slate-300"
          onClick={connectKeplr}
        >
          Keplr
        </Button>
      </div>
    </PageContainer>
  );
};

export default OnboardingPage;

const Button = styled.button``;
