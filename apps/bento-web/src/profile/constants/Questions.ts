import LocalizedStrings from 'react-localization';

export enum QuestionStatisticFields {
  Answered = 'ANSWERED',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  AverageAnswerTime = 'AVERAGE_ANSWER_TIME',
}

export const QuestionStatisticFieldDescriptions = new LocalizedStrings({
  en: {
    [QuestionStatisticFields.Answered]: 'Number of Answered questions',
    [QuestionStatisticFields.Pending]: 'Number of Pending questions',
    [QuestionStatisticFields.Rejected]: 'Number of Rejected questions',
    [QuestionStatisticFields.AverageAnswerTime]: 'Average time until answered',
  },
  ko: {
    [QuestionStatisticFields.Answered]: '답변이 완료된 질문 수',
    [QuestionStatisticFields.Pending]: '대기 중인 질문 수',
    [QuestionStatisticFields.Rejected]: '거절된 질문 수',
    [QuestionStatisticFields.AverageAnswerTime]: '답변까지 걸리는 평균 시간',
  },
});

export const QuestionUITexts = new LocalizedStrings({
  en: {
    Send: 'Send',
    Anonymous: 'Anonymous',
    QuestionInputPlaceholder: 'Ask something!',
  },
  ko: {
    Send: '보내기',
    Anonymous: '익명',
    QuestionInputPlaceholder: '질문을 입력하세요.',
  },
});
