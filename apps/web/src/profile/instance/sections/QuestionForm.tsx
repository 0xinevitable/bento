import styled from '@emotion/styled';

import { useLocalStorage } from '@/hooks/useLocalStorage';

import { QuestionUITexts } from '../../constants/Questions';

export const QuestionForm = () => {
  const [questionText, setQuestionText] =
    useLocalStorage<string>('QuestionText');

  const onChangeQuestionText = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => setQuestionText(event.target.value);

  return (
    <Container>
      <Input
        value={questionText ?? ''}
        onChange={onChangeQuestionText}
        placeholder={QuestionUITexts.QuestionInputPlaceholder}
        rows={4}
      />
      <SubmitButton className="submit">{QuestionUITexts.Send}</SubmitButton>
      <BottomDivider />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.textarea`
  width: 100%;
  border-radius: 8px;
  background-color: #434a55;
  padding: 14px 16px;
  border: 0;
  resize: none;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.25;
  transition: background-color 0.2s ease-in-out;

  &:focus {
    outline: 0;
    background-color: #3e444f;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }
`;

const SubmitButton = styled.button`
  background-color: #ffa927;
  box-shadow: 0 8px 16px rgba(255, 169, 39, 0.45);
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 15.8px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 2px 2px 4px rgba(255, 145, 0, 0.9);
  width: fit-content;
  margin-top: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover,
  &:focus {
    background-color: #ff9f0f;
    box-shadow: 0 4px 16px rgba(255, 169, 39, 0.45);
  }
`;

const BottomDivider = styled.div`
  width: 100%;
  height: 2px;
  background-color: #262c34;
  margin: 16px 0;
  border-radius: 1px;
`;
