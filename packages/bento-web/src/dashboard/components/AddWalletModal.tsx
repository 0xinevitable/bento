import React, { useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { WalletConnector } from '@/components/WalletConnector';
import { Modal } from '@/components/system';
import { useSession } from '@/hooks/useSession';
import { useWalletContext } from '@/hooks/useWalletContext';

import { NETWORKS, Network } from '@/constants/networks';
import { Colors } from '@/styles';
import { Analytics } from '@/utils';

type AddWalletModalProps = {
  visible?: boolean;
  onDismiss?: () => void;
};

export const AddWalletModal: React.FC<AddWalletModalProps> = ({
  visible: isVisible = false,
  onDismiss,
}) => {
  const { session } = useSession();
  const isLoggedIn = !!session;

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    Analytics.logEvent('view_connect_wallet', undefined);
  }, [isVisible]);

  const [networks, setNetworks] = useState<Network[]>([]);
  const firstNetwork = networks[0];
  const onSelectNetwork = useCallback((network: Network) => {
    Analytics.logEvent('click_connect_wallet_select_chain', {
      type: network.id as any,
    });
    setNetworks((prev) =>
      !prev.find((v) => v.id === network.id)
        ? [...prev, network]
        : prev.filter((v) => v.id !== network.id),
    );
  }, []);

  const { revalidateWallets } = useWalletContext();

  return (
    <OverlayWrapper
      visible={isVisible}
      onDismiss={onDismiss}
      transition={{ ease: 'linear' }}
    >
      {isLoggedIn && (
        <>
          <section>
            <Title>Choose Chains</Title>
            <NetworkList>
              {NETWORKS.map((network) => {
                const selected = !!networks.find((v) => v.id === network.id);
                const disabled =
                  typeof firstNetwork !== 'undefined' &&
                  firstNetwork.type !== network.type;

                return (
                  <NetworkItem
                    key={network.id}
                    selected={selected}
                    disabled={disabled}
                    onClick={
                      !disabled //
                        ? () => onSelectNetwork(network)
                        : undefined
                    }
                  >
                    <img src={network.logo} alt={network.name} />
                    <div className="name-container">
                      <span className="name">{network.name}</span>
                    </div>
                  </NetworkItem>
                );
              })}
            </NetworkList>
          </section>

          <section>
            <Title>Sign with Wallet</Title>
            <WalletConnector
              networks={networks}
              onSave={() => {
                onDismiss?.();
                setNetworks([]);
                revalidateWallets();
              }}
            />
          </section>
        </>
      )}
    </OverlayWrapper>
  );
};

export default AddWalletModal;

const Title = styled.h3`
  margin-bottom: 12px;
  font-weight: bold;
  color: ${Colors.white};
`;

const OverlayWrapper = styled(Modal)`
  .modal-container {
    margin: 0 16px;
    padding: 16px;
    height: fit-content;
    overflow: hidden;

    max-height: calc(100vh - 64px - 84px);
    overflow: scroll;

    display: flex;
    flex-direction: column;
    gap: 32px;

    border: 1px solid ${Colors.gray600};
    border-radius: 8px;
    box-shadow: 0 4px 24px ${Colors.black};
    background-color: ${Colors.gray900};
    cursor: pointer;
  }
`;

const NetworkList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

type NetworkItemProps = {
  selected?: boolean;
  disabled?: boolean;
};
const NetworkItem = styled.div<NetworkItemProps>`
  margin: 2px;
  padding: 8px;

  border-radius: 12px;
  border: 2px solid ${Colors.gray850};
  background-color: ${Colors.gray850};
  user-select: none;
  cursor: pointer;

  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;

  transition: all 0.1s ease-in-out;

  &:hover {
    border: 2px solid ${Colors.gray800};

    & > img {
      transform: scale(1.08);
    }
  }

  ${({ selected }) =>
    selected &&
    css`
      border-color: rgba(168, 85, 247, 0.65);
      background-color: rgba(168, 85, 247, 0.25);

      &:hover {
        border-color: rgba(168, 85, 247, 0.65);
      }
    `};

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 20%;
      cursor: not-allowed;
    `};

  & > img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: contain;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.4s ease;
  }

  .name-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .name {
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.2;
    color: ${Colors.white};
    text-align: center;
  }
`;
