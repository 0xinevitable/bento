import { Colors } from '@bento/client/styles';
import { Wallet, shortenAddress } from '@bento/common';
import { Icon } from '@iconify/react';
import styled from 'styled-components';

export type WalletListItemProps = Wallet & {
  onClickCopy: (address: string, type: 'evm' | 'cosmos-sdk' | 'solana') => void;
};

export const WalletListItem: React.FC<WalletListItemProps> = ({
  onClickCopy,
  ...wallet
}) => {
  return (
    <Container>
      <WalletArchIcon
        className={wallet.type}
        src={`/assets/icons/ic-arch-${wallet.type}.svg`}
      />
      <Information>
        <WalletAddress>
          {shortenAddress(wallet.address)}

          <button onClick={() => onClickCopy(wallet.address, wallet.type)}>
            <Icon icon="eva:copy-fill" />
          </button>
        </WalletAddress>

        <PlatformList>
          {wallet.type === 'solana' ? (
            <PlatformListItem>
              <img src="/assets/icons/solana.png" />
            </PlatformListItem>
          ) : (
            wallet.networks.map((network) => (
              <PlatformListItem key={network}>
                <img src={`/assets/icons/${network}.png`} />
              </PlatformListItem>
            ))
          )}
        </PlatformList>
      </Information>
    </Container>
  );
};

const Container = styled.li`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 12px;
  gap: 8px;

  width: 100%;
  height: 72px;
  min-height: 72px;

  background: ${Colors.gray850};
  border: 1px solid ${Colors.gray500};

  /* shadow-default */
  box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.18);
  border-radius: 16px;
  overflow: hidden;
`;

const WalletArchIcon = styled.img`
  width: 48px;
  height: 48px;

  &.evm {
    filter: drop-shadow(12px 4px 24px rgba(0, 71, 255, 0.28));
  }

  &.cosmos-sdk {
    filter: drop-shadow(12px 4px 24px rgba(128, 0, 255, 0.28));
  }

  &.solana {
    filter: drop-shadow(12px 4px 24px rgba(0, 255, 240, 0.28));
  }
`;

const Information = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
`;
const WalletAddress = styled.span`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 100%;

  letter-spacing: -5%;
  color: ${Colors.gray200};

  & > button {
    margin-left: 4px;
    font-size: 16px;
    color: ${Colors.gray200};
  }
`;

const PlatformList = styled.ul`
  display: flex;
  gap: 3px;
`;
const PlatformListItem = styled.li`
  & > img {
    width: 20px;
    height: 20px;
    border-radius: 50%;

    background: url(image.png);
    outline: 1px solid rgba(0, 0, 0, 0.25);
    outline-offset: -1px;
  }
`;
