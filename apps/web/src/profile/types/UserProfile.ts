import { Block } from '@/profile/blocks';

export enum UserProfileTab {
  Links = 'Links',
  Questions = 'Questions',
}

export type UserProfile = {
  user_id: string;
  username: string;
  display_name: string;
  images: string[] | null;
  verified: boolean;
  bio: string;
  tabs: UserProfileTab[];
  links: Block[] | null;
};

export enum UserQuestionType {
  Anonymous = 'ANONYMOUS',
}

export type UserQuestion = {
  request: {
    type: UserQuestionType;
    question: string;
    createdAt: string;
  };
  response?: {
    answer: string;
    createdAt: string;
  };
};

export type UserQuestions = {
  questions: UserQuestion[];
};
