import styled from '@emotion/styled';
import { format } from 'date-fns';
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';
import React, { useCallback, useMemo, useState } from 'react';

import HorizontalDotsIcon from '@/assets/icons/ic-dots-horizontal.svg';
import { useTimeAgo } from '@/hooks/useTimeAgo';

import { throttle } from '@/utils';

import { QuestionUITexts } from '../../constants/Questions';
import { UserQuestion } from '../../types/UserProfile';

type Props = {
  question: UserQuestion;
  onClickMoreButton: () => void;
};

export const QuestionItem: React.FC<Props> = ({
  question,
  onClickMoreButton,
}) => {
  const timeAgo = useTimeAgo();
  const [isAbsoluteTimeVisible, setAbsoluteTimeVisible] =
    useState<boolean>(false);

  const AnsweredAtAbsolute = useMemo(
    () => format(new Date(question.request.createdAt), 'yyyy/MM/dd HH:mm:ss'),
    [question.request.createdAt],
  );
  const AnsweredAtRelative = useMemo(() => {
    const formatted = timeAgo?.format(
      new Date(question.request.createdAt),
    ) as string;

    // Capitalize first letter
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }, [question.request.createdAt, timeAgo]);

  const onEnterAnsweredAt = useCallback(
    throttle(() => setAbsoluteTimeVisible(true), 1000),
    [],
  );
  const onLeaveAnsweredAt = useCallback(
    throttle(() => setAbsoluteTimeVisible(false), 1000),
    [],
  );

  return (
    <Container>
      <Header>
        <QuestionContainer>
          <QuestionInformation>
            <QuestionType>{QuestionUITexts.Anonymous}</QuestionType>
            {' • '}
            <AnimatePresence initial={false}>
              <AnsweredAt
                onMouseEnter={onEnterAnsweredAt}
                onMouseLeave={onLeaveAnsweredAt}
              >
                {isAbsoluteTimeVisible ? (
                  <AnimatedAnsweredAtFormat key="absolute">
                    {AnsweredAtAbsolute}
                  </AnimatedAnsweredAtFormat>
                ) : (
                  <AnimatedAnsweredAtFormat key="relative">
                    {AnsweredAtRelative}
                  </AnimatedAnsweredAtFormat>
                )}
              </AnsweredAt>
            </AnimatePresence>
          </QuestionInformation>
          <Question>{question.request.question}</Question>
        </QuestionContainer>
        <MoreButton onClick={onClickMoreButton} />
      </Header>
      {!!question.response?.answer && (
        <Answer>{question.response.answer}</Answer>
      )}
    </Container>
  );
};

const Container = styled.li`
  margin-top: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background-color: #262b34;
  border-radius: 8px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const QuestionInformation = styled.div`
  color: #78797f;
  font-size: 16px;
`;
const QuestionType = styled.span``;
const AnsweredAt = styled.span`
  cursor: default;

  & > span {
    display: inline-block;
  }
`;
const AnimatedAnsweredAtFormat = (props: HTMLMotionProps<'span'>) => (
  <motion.span
    initial={{ opacity: 0, transform: 'translateY(8px)' }}
    animate={{ opacity: 1, transform: 'translateY(0px)' }}
    exit={{ opacity: 0, transform: 'translateY(-8px)' }}
    transition={{ duration: 0.2, ease: 'easeInOut' }}
    {...props}
  />
);

const Question = styled.span`
  margin-top: 8px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: rgba(255, 255, 255, 0.75);
`;

type MoreButtonProps = {
  onClick?: () => void;
};
const MoreButton: React.FC<MoreButtonProps> = ({ onClick }) => {
  return (
    <MoreButtonContainer onClick={onClick}>
      <MoreButtonIcon />
    </MoreButtonContainer>
  );
};
const MoreButtonContainer = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.35);
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;
const MoreButtonIcon = styled(HorizontalDotsIcon)`
  width: 18px;
  height: 18px;
  color: #262c34;
`;

const Answer = styled.p`
  margin: 0;
  margin-top: 8px;
  font-size: 16px;
  line-height: 1.45;
  white-space: break-spaces;
  color: rgba(255, 255, 255, 0.5);
`;
