import styled from '@emotion/styled';
import React, { useCallback, useState } from 'react';

import { ExampleUserQuestions } from '../../constants/ExampleUserProfile';
import { UserQuestion } from '../../types/UserProfile';
import { QuestionForm } from './QuestionForm';
import { QuestionItem } from './QuestionItem';
import { QuestionMoreModal } from './QuestionMoreModal';

type Props = {};

export const QuestionSection: React.FC<Props> = () => {
  const [isMoreModalVisible, setMoreModalVisible] = useState<boolean>(false);

  const onClickMoreButton = useCallback((_question: UserQuestion) => {
    setMoreModalVisible((value) => !value);
  }, []);

  return (
    <>
      <QuestionForm />
      <QuestionList>
        {ExampleUserQuestions.questions.map((question, index) => (
          <QuestionItem
            key={index}
            question={question}
            onClickMoreButton={() => onClickMoreButton(question)}
          />
        ))}
        <QuestionMoreModal
          isVisible={isMoreModalVisible}
          onDismiss={() => setMoreModalVisible((value) => !value)}
        />
      </QuestionList>
    </>
  );
};

const QuestionList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;
