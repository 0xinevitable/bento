import React from 'react';
import { useConnect, useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { Button } from '@/components/system/Button';
import { Analytics } from '@/utils';

export const WalletConnectorWagmi: React.FC = () => {
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessage } = useSignMessage();

  const handleConnect = async (connector: any) => {
    try {
      Analytics.logEvent('click_connect_wallet_select_wallet', {
        type: connector.name,
      });
      
      await connect({ connector });
      
      if (address) {
        Analytics.logEvent('connect_wallet', {
          type: connector.name as any,
          networks: ['mitosis'],
          address,
        });
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    // Analytics event for disconnect not available in current types
    console.log('Wallet disconnected:', address);
  };

  if (isConnected && address) {
    return (
      <div>
        <p>Connected: {address}</p>
        <Button onClick={handleDisconnect}>Disconnect</Button>
      </div>
    );
  }

  return (
    <div>
      {connectors.map((connector) => (
        <Button
          key={connector.id}
          disabled={!connector.ready}
          onClick={() => handleConnect(connector)}
        >
          Connect with {connector.name}
        </Button>
      ))}
    </div>
  );
};