import {
  UserProfile,
  UserProfileTab,
  UserQuestions,
  UserQuestionType,
} from '../types/UserProfile';

const EXAMPLE_IMAGE =
  'https://lh3.googleusercontent.com/ZCpHACZeXMo1F8gnb0BdbzsGovh3nxdouU7LnjZcF4SCW3AQAOQwnh5zXRX34v8AqtO11AXthAes-RAKtAD5xOXM5astTp_29zGo=w397';

export const ExampleUserProfile: UserProfile = {
  username: 'junhoyeo',
  displayName: 'Junho Yeo',
  images: [EXAMPLE_IMAGE],
  verified: true,
  introduction: 'Creating new networks with @Linky',
  description: 'Thinking about how we can dominate the world...',
  tabs: [UserProfileTab.Links, UserProfileTab.Questions],
  links: [
    {
      title: 'Facebook',
      description: 'My Facebook link',
      href: 'https://facebook.com/ijustdothethingsilike',
      image: EXAMPLE_IMAGE,
    },
    {
      title: 'Instagram',
      description: 'My Instagram link',
      href: 'https://instagram.com/_junhoyeo',
      image: EXAMPLE_IMAGE,
    },
    {
      title: 'GitHub',
      description: 'My GitHub link',
      href: 'http://github.com/junhoyeo',
      image: EXAMPLE_IMAGE,
    },
    {
      title: 'Clubhouse',
      description: 'My Clubhouse link',
      href: 'http://inssa.club/junhoyeo',
      image: EXAMPLE_IMAGE,
    },
  ],
};

export const ExampleUserQuestions: UserQuestions = {
  questions: [
    {
      request: {
        type: UserQuestionType.Anonymous,
        question: 'What do you want',
        createdAt: new Date().toISOString(),
      },
      response: {
        answer: 'I want to rest for a month',
        createdAt: '2021-04-14T18:03:30.177Z',
      },
    },
    {
      request: {
        type: UserQuestionType.Anonymous,
        question: 'Mint choco',
        createdAt: new Date(Date.now() - 60000).toISOString(),
      },
      response: {
        answer: 'I love that',
        createdAt: '2021-04-14T18:03:30.177Z',
      },
    },
    {
      request: {
        type: UserQuestionType.Anonymous,
        question: 'Are we going NYSE?',
        createdAt: '2021-04-13T23:56:30.177Z',
      },
      response: {
        answer: 'Yeah, but maybe blockchain is faster',
        createdAt: '2021-04-14T18:03:30.177Z',
      },
    },
    {
      request: {
        type: UserQuestionType.Anonymous,
        question: "What's Linky's frontend tech stack",
        createdAt: '2021-04-07T17:56:30.177Z',
      },
      response: {
        answer:
          'Next.js with TypeScript, Recoil for state management, Yarn Workspaces for monorepo management. We use Tailwind CSS and `styled-components` for styling. Someday when everything is ready we can update React to 18.',
        createdAt: '2021-04-07T20:03:30.177Z',
      },
    },
    {
      request: {
        type: UserQuestionType.Anonymous,
        question: 'Are you new to Docker',
        createdAt: '2021-04-07T16:56:30.177Z',
      },
      response: {
        answer: "Yup. It's harder than I thought",
        createdAt: '2021-04-07T19:03:30.177Z',
      },
    },
    {
      request: {
        type: UserQuestionType.Anonymous,
        question: 'Do you like coffee',
        createdAt: '2021-03-01T17:56:30.177Z',
      },
      response: {
        answer: "I don't like it that much.",
        createdAt: '2021-03-01T20:03:30.177Z',
      },
    },
  ],
};
