export type ProfileLink = {
  title: string;
  description: string;
  href: string;
  image: string;
};

export enum UserProfileTab {
  Links = 'Links',
  Questions = 'Questions',
}

export type UserProfile = {
  username: string;
  displayName: string;
  images: string[];
  verified: boolean;
  introduction: string;
  description: string;
  tabs: UserProfileTab[];
  links: ProfileLink[];
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
