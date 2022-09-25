import styled from 'styled-components';

import { Colors } from '@/styles';

type Props = React.HTMLAttributes<HTMLDivElement>;

export const EmptyBalance: React.FC<Props> = ({ className, ...props }) => {
  return (
    <Container {...props}>
      <Illust src="/assets/illusts/bitcoin.png" />
      <Message>Assets will show up here</Message>
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

const Illust = styled.img`
  width: 128px;
  height: 128px;
  user-select: none;
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
