import { NextPage } from 'next';
import Image from 'next/future/image';
import styled from 'styled-components';

import { PageContainer } from '@/components/PageContainer';
import { MetaHead } from '@/components/system';

import { Colors } from '@/styles';

import discordLogo from './assets/discord.webp';
import githubLogo from './assets/github.webp';
import telegramLogo from './assets/telegram.webp';
import twitterLogo from './assets/twitter.webp';

const withOpacity = (hex: string, opacity: number) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
    .exec(hex)
    ?.slice(1)
    .map((v) => parseInt(v, 16));
  return result
    ? `rgba(${result[0]}, ${result[1]}, ${result[2]}, ${opacity})`
    : '';
};

const communities = [
  {
    title: 'Official Notice',
    url: 'https://t.me/bentoinevitable',
    icon: telegramLogo,
    color: '#259bd6',
  },
  {
    title: 'Community',
    url: 'https://t.me/bentocommunity',
    icon: telegramLogo,
    color: '#259bd6',
  },
  {
    title: 'Twitter',
    url: 'https://twitter.com/bentoinevitable',
    icon: twitterLogo,
    color: '#1b9aee',
  },
  {
    title: 'Discord',
    url: 'https://discord.gg/zXmRRBxYqD',
    icon: discordLogo,
    color: '#5762f7',
  },
  {
    title: 'GitHub',
    url: 'https://github.com/inevitable-changes ',
    icon: githubLogo,
    color: '#303c45',
  },
];

const CommunityPage: NextPage = () => {
  return (
    <>
      <MetaHead />
      <Black />
      <PageContainer style={{ paddingBottom: 64 }}>
        <Title>Community</Title>
        <List>
          {communities.map((community) => (
            <Item key={community.title}>
              <a href={community.url} target="_blank" rel="noreferrer">
                <IconWrapper
                  style={{
                    padding: 4,
                    backgroundColor: withOpacity(community.color, 0.65),
                    boxShadow: `0 4px 32px ${withOpacity(
                      community.color,
                      0.85,
                    )}`,
                  }}
                >
                  <Image
                    className="icon"
                    src={community.icon}
                    alt={community.title}
                    width={120}
                    height={120}
                    style={{ borderRadius: 26 }}
                  />
                </IconWrapper>
                <span className="title">{community.title}</span>
              </a>
            </Item>
          ))}
        </List>
      </PageContainer>
    </>
  );
};
export default CommunityPage;

const Black = styled.div`
  width: 100%;
  height: 72px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Title = styled.h1`
  margin-top: 32px;

  font-weight: 900;
  font-size: 42px;
  line-height: 103%;

  text-align: center;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.85);

  z-index: 1;
`;
const List = styled.ul`
  margin-top: 36px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  gap: 12px;
  row-gap: 24px;

  user-select: none;
`;
const Item = styled.li`
  display: flex;

  * {
    transition: all 0.2s ease-in-out;
  }

  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .title {
    color: ${Colors.gray200};
    font-weight: bold;
    text-align: center;
  }

  &:hover {
    div {
      transform: translateY(-4px);
    }

    .title {
      transform: translateY(4px);
      color: ${Colors.white};
    }
  }
`;

const IconWrapper = styled.div`
  width: 128px;
  height: 128px;
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;
