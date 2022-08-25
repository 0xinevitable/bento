import styled from 'styled-components';

import { Button } from '@/components/Button';

export const FixedFooter: React.FC = () => {
  return (
    <Container className="w-full max-w-lg mx-auto">
      <ShareButton>Share</ShareButton>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 200px;
  padding: 0 20px;

  display: flex;
  align-items: flex-end;

  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 95%);
  pointer-events: none;

  & > & {
    pointer-events: all;
  }
`;
const ShareButton = styled(Button)`
  width: 100%;
  margin-bottom: 34px;

  box-shadow: 0px 8px 24px rgba(108, 0, 0, 0.55);
`;
