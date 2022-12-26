import { ChainType, Wallet, shortenAddress } from '@bento/common';
import styled from '@emotion/styled';
import { Icon } from '@iconify/react';
import { MotionProps, motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';

import { Colors } from '@/styles';

export type WalletListItemProps = MotionProps & {
  wallet: Wallet;
  onClickDelete?: (account: string) => void;
  onClickCopy?: (address: string, type: ChainType) => void;
};

export const WalletListItem: React.FC<WalletListItemProps> = ({
  onClickCopy,
  onClickDelete,
  wallet,
  ...motionProps
}) => {
  const { t } = useTranslation('common');

  return (
    <Container {...motionProps}>
      <WalletArchIcon
        className={wallet.type}
        src={`/assets/icons/ic-arch-${wallet.type}.svg`}
      />
      <Information>
        <WalletAddress>
          {shortenAddress(wallet.address)}

          <button onClick={() => onClickCopy?.(wallet.address, wallet.type)}>
            <Icon icon="eva:copy-fill" />
          </button>
        </WalletAddress>

        <PlatformList>
          {wallet.networks.map((network) => (
            <PlatformListItem key={network}>
              <img src={`/assets/icons/${network}.png`} />
            </PlatformListItem>
          ))}
        </PlatformList>
      </Information>
      <ButtonList>
        {/* <button>Edit</button> */}
        <button onClick={() => onClickDelete?.(wallet.address)}>
          {t('Delete')}
        </button>
      </ButtonList>
    </Container>
  );
};

const Container = styled(motion.li)`
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

    outline: 1px solid rgba(0, 0, 0, 0.25);
    outline-offset: -1px;
  }
`;

const ButtonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  & > button {
    padding: 5px 12px;
    border-radius: 8px;

    font-weight: 600;
    font-size: 12px;
    line-height: 100%;
    text-align: center;
    letter-spacing: -0.05em;

    &:first-of-type {
      color: ${Colors.gray700};
      background: ${Colors.gray400};
    }

    &:last-of-type {
      color: ${Colors.gray500};
      background: ${Colors.gray700};
    }

    transition: all 0.2s ease-in-out;

    &:focus {
      opacity: 0.75;
    }
  }
`;
