import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import { Colors } from '@/styles';

type Props = React.HTMLAttributes<HTMLDivElement>;

export const EmptyBalance: React.FC<Props> = ({ className, ...props }) => {
  const { t } = useTranslation('dashboard');

  return (
    <Container {...props}>
      <Image
        alt=""
        src="/assets/illusts/bitcoin.png"
        width={128}
        height={128}
        quality={100}
        style={{ filter: 'saturate(120%)' }}
      />
      <Message>{t('Assets will show up here')}</Message>
    </Container>
  );
};

const Container = styled.div`
  margin: 32px 0 48px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Message = styled.span`
  margin-top: 8px;

  font-weight: 600;
  font-size: 18px;
  line-height: 100%;
  text-align: center;
  color: ${Colors.gray200};
  letter-spacing: -0.05em;
`;
