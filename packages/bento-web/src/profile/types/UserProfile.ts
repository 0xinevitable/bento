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
  display_name: string;
  images: string[] | null;
  verified: boolean;
  bio: string;
  tabs: UserProfileTab[];
  links: ProfileLink[] | null;
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
