import { Badge } from '@bento/client/components/Badge';
import { Button } from '@bento/client/components/Button';
import { Colors, systemFontStack } from '@bento/client/styles';
import { Wallet } from '@bento/common';
import styled from 'styled-components';

import { WalletList } from './WalletList';

type Props = {
  wallets: Wallet[];
  onClickAddWallet: () => void;
};

export const WalletListSection: React.FC<Props> = ({
  wallets,
  onClickAddWallet,
}) => {
  return (
    <div className="flex-1 flex flex-col relative">
      <SectionTitleContainer>
        <SectionTitle>Wallets</SectionTitle>
      </SectionTitleContainer>

      <WalletList wallets={wallets} />

      <div className="mt-[10px] flex justify-center">
        <AddWalletButton onClick={onClickAddWallet}>
          Add Another
        </AddWalletButton>
      </div>
    </div>
  );
};

const SectionTitleContainer = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;

  background-image: linear-gradient(
    to bottom,
    ${Colors.black} 40%,
    transparent
  );
`;
const SectionTitle = styled.h3`
  /* FIXME: !important */
  &,
  & > span.title {
    font-family: 'Raleway', ${systemFontStack} !important;
  }

  margin-bottom: 16px;
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: -0.5px;
  color: ${Colors.gray400};
`;

// FIXME: Design component
const AddWalletButton = styled(Button)`
  && {
    height: unset;
    padding: 12px 18px;

    /* FIXME: !important */
    font-family: 'Raleway', ${systemFontStack} !important;
    font-weight: 800;
    font-size: 14px;
    line-height: 100%;
    text-align: center;
    color: ${Colors.white};
  }
`;

const InlineBadge = styled(Badge)`
  && {
    margin-left: 8px;
    padding: 6px;
    display: inline-flex;
    font-size: 13px;
    backdrop-filter: none;
  }
`;
