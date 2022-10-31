import {
  UserProfile,
  UserProfileTab,
  UserQuestionType,
  UserQuestions,
} from '../types/UserProfile';

const PROFILE_IMAGE =
  'https://img.seadn.io/files/c021cc895492493a747d6fc6fe7ec540.png?auto=format&w=600';
const EXAMPLE_IMAGE =
  'https://lh3.googleusercontent.com/ZCpHACZeXMo1F8gnb0BdbzsGovh3nxdouU7LnjZcF4SCW3AQAOQwnh5zXRX34v8AqtO11AXthAes-RAKtAD5xOXM5astTp_29zGo=w397';

export const ExampleUserProfile: Omit<UserProfile, 'user_id'> = {
  username: 'juno',
  display_name: 'Junho Yeo',
  images: [PROFILE_IMAGE, EXAMPLE_IMAGE],
  verified: true,
  bio: 'Software Enginner 🦄⚡️\nBuilding the web3 world 🌎',
  tabs: [UserProfileTab.Links, UserProfileTab.Questions],
  links: [
    {
      type: 'link',
      title: 'GitHub',
      description: 'My GitHub link',
      url: 'http://github.com/junhoyeo',
      images: [EXAMPLE_IMAGE],
    },
    {
      type: 'link',
      title: 'Twitter',
      description: 'My Twitter link',
      url: 'https://twitter.com/_junhoyeo',
      images: [EXAMPLE_IMAGE],
    },
    {
      type: 'link',
      title: 'Instagram',
      description: 'My Instagram link',
      url: 'https://instagram.com/_junhoyeo',
      images: [EXAMPLE_IMAGE],
    },
    {
      type: 'link',
      title: 'Facebook',
      description: 'My Facebook link',
      url: 'https://facebook.com/ijustdothethingsilike',
      images: [EXAMPLE_IMAGE],
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
          'Next.js with TypeScript, Recoil for state management, Yarn Workspaces for monorepo management. We use Emotion for styling.',
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
