import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';

import { Button } from '@/components/system';

type FixedFooterProps = {
  onClickShare: () => void;
};

export const FixedFooter: React.FC<FixedFooterProps> = ({ onClickShare }) => {
  const { t } = useTranslation('common');
  return (
    <Container>
      <ShareButton onClick={onClickShare}>{t('Share')}</ShareButton>
    </Container>
  );
};

const Container = styled.div`
  margin: 0 auto;
  padding: 0 20px;

  width: 100%;
  max-width: 512px;
  height: 200px;

  display: flex;
  align-items: flex-end;

  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 95%);
  pointer-events: none;

  & > * {
    pointer-events: all;
  }
`;
const ShareButton = styled(Button)`
  width: 100%;
  margin-bottom: 34px;

  box-shadow: 0px 8px 24px rgba(108, 0, 0, 0.55);
`;
