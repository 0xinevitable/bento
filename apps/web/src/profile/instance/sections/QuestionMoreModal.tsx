import styled from '@emotion/styled';
import React from 'react';

import { Modal } from '@/components/system';

type Props = {
  isVisible?: boolean;
  onDismiss?: () => void;
};

export const QuestionMoreModal: React.FC<Props> = ({
  isVisible = false,
  onDismiss,
}) => {
  const onClickContainer = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <OverlayWrapper
      visible={isVisible}
      onDismiss={onDismiss}
      transition={{ ease: 'linear' }}
    >
      <Container onClick={onClickContainer}>
        <Title>질문 공유하기</Title>
      </Container>
    </OverlayWrapper>
  );
};

const OverlayWrapper = styled(Modal)`
  .modal-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Container = styled.div`
  padding: 32px 16px;
  width: 80%;
  max-width: ${500 * 0.8}px;

  border-radius: 8px;
  background-color: #262b34;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: default;
  user-select: none;
`;

const Title = styled.span`
  margin: 0;
  color: white;
  font-weight: bold;
  font-size: 18.5px;
  cursor: text;
`;
