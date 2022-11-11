import styled from '@emotion/styled';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { PageContainer } from '@/components/PageContainer';
import { MetaHead } from '@/components/system';

import { Colors } from '@/styles';
import { Analytics } from '@/utils';

import backgroundImage from './assets/background.png';
import discordLogo from './assets/discord.webp';
import githubLogo from './assets/github.webp';
import telegramLogo from './assets/telegram.webp';
import titleImage from './assets/title.png';
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
    type: 'telegram-notice',
    url: 'https://t.me/bentoinevitable',
    icon: telegramLogo,
    color: '#259bd6',
  },
  {
    type: 'telegram-community',
    url: 'https://t.me/bentocommunity',
    icon: telegramLogo,
    color: '#259bd6',
  },
  {
    type: 'twitter',
    url: 'https://twitter.com/bentoinevitable',
    icon: twitterLogo,
    color: '#1b9aee',
  },
  {
    type: 'discord',
    url: 'https://discord.gg/zXmRRBxYqD',
    icon: discordLogo,
    color: '#5762f7',
  },
  {
    type: 'github',
    url: 'https://github.com/inevitable-changes ',
    icon: githubLogo,
    color: '#303c45',
  },
] as const;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale || 'en', [
        'common',
        'community',
      ])),
    },
  };
};

const CommunityPage: NextPage = () => {
  useEffect(() => {
    Analytics.logEvent('view_community', undefined);
  }, []);

  const { t } = useTranslation(['community']);

  const backgroundImageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = backgroundImageRef.current;
    if (!el) {
      return;
    }
    const w = el.clientWidth;
    const h = el.clientHeight;
    const b = el.getBoundingClientRect();

    const handler = (e: MouseEvent) => {
      const X = (e.clientX - b.left) / w;
      const Y = (e.clientY - b.top) / h;
      document.documentElement.style.setProperty('--x', 100 * X + '%');
      document.documentElement.style.setProperty('--y', 100 * Y + '%');
    };

    window.addEventListener('mousemove', handler);

    return () => {
      window.removeEventListener('mousemove', handler);
    };
  }, []);

  return (
    <>
      <MetaHead />
      <BackgroundImageWrapper>
        <BackgroundImageContainer ref={backgroundImageRef}>
          <BackgroundImage
            alt=""
            src={backgroundImage}
            sizes="1440px"
            placeholder="blur"
          />

          <TitleContainer>
            <TitleImage alt="" src={titleImage} placeholder="blur" />
          </TitleContainer>

          <LayerOne />
        </BackgroundImageContainer>
      </BackgroundImageWrapper>
      <Border />
      <PageContainer
        style={{ paddingTop: 0, paddingBottom: 64, minHeight: 'unset' }}
      >
        <Title>Shape Our Future Together</Title>
        <List>
          {communities.map((community) => (
            <Item key={community.type}>
              <a
                href={community.url}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  Analytics.logEvent('click_social_link', {
                    type: community.type,
                    medium: 'community',
                  })
                }
                style={{
                  filter: `drop-shadow(0 2px 32px ${withOpacity(
                    community.color,
                    0.85,
                  )})`,
                }}
              >
                <IconWrapper
                  style={{
                    padding: 4,
                    backgroundColor: withOpacity(community.color, 0.25),
                  }}
                >
                  <StyledImage
                    className="icon"
                    src={community.icon}
                    alt={t(community.type)}
                  />
                </IconWrapper>
                <span className="title">{t(community.type)}</span>
              </a>
            </Item>
          ))}
        </List>
      </PageContainer>
    </>
  );
};
export default CommunityPage;

const BackgroundImageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const BackgroundImageContainer = styled.div`
  width: 900px;
  min-width: 900px;
  max-width: 900px;

  display: flex;
  justify-content: center;
  position: relative;
  filter: contrast(1.08) drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.25));

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 100) 10%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 100%;
    background: linear-gradient(
      to left,
      rgba(0, 0, 0, 100) 10%,
      rgba(0, 0, 0, 0) 100%
    );
  }
`;
const BackgroundImage = styled(Image)`
  width: 100%;
  height: 400px;
  object-fit: cover;
  max-width: 900px;
`;
const LayerOne = styled.div`
  position: absolute;
  inset: 0;
  z-index: 20;
  mix-blend-mode: soft-light;
  clip-path: inset(0 0 1px 0 round 48px);
  background: radial-gradient(
    farthest-corner circle at var(--x) var(--y),
    rgba(0, 0, 0, 0.8) 10%,
    rgba(0, 0, 0, 0.65) 20%,
    rgba(0, 0, 0, 0) 90%
  );
`;

const TitleContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;

  display: flex;
  justify-content: center;
`;
const TitleImage = styled(Image)`
  width: 357px;
  height: 92px;
  object-fit: contain;

  @media (max-width: 620px) {
    width: 320px;
    height: 82px;
  }
`;

const Border = styled.div`
  width: 100%;
  height: 2px;
  background-color: #aaaaaa;
  background-image: linear-gradient(
    to right,
    #aaaaaa 0%,
    #282c30 37.71%,
    #787d83 100%
  );
`;

const Title = styled.h1`
  margin-top: 32px;

  font-weight: 900;
  font-size: 32px;
  line-height: 1;

  text-align: center;
  letter-spacing: -0.3px;
  color: rgba(255, 255, 255, 0.85);
  font-variant: small-caps;

  z-index: 1;
`;
const List = styled.ul`
  margin-top: 36px;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;

  user-select: none;

  @media (max-width: 370px) {
    max-width: 240px;
    row-gap: 16px;
    margin: 36px auto 0;
  }
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

    @media (max-width: 620px) {
      gap: 4px;
    }
  }

  .title {
    color: ${Colors.gray200};
    font-weight: bold;
    text-align: center;

    @media (max-width: 620px) {
      font-size: 12px;
    }
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
  width: 108px;
  height: 108px;
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  clip-path: path(
    'M 54 0 c 16.77389681711179 0 25.160845225667686 0 31.77660356514323 2.7403368295936765 a 36 36 0 0 1 19.483059605263094 19.483059605263094 c 2.7403368295936765 6.615758339475543 2.7403368295936765 15.00270674803144 2.7403368295936765 31.77660356514323 L 108 54 c 0 16.77389681711179 0 25.160845225667686 -2.7403368295936765 31.77660356514323 a 36 36 0 0 1 -19.483059605263094 19.483059605263094 c -6.615758339475543 2.7403368295936765 -15.00270674803144 2.7403368295936765 -31.77660356514323 2.7403368295936765 L 54 108 c -16.77389681711179 0 -25.160845225667686 0 -31.77660356514323 -2.7403368295936765 a 36 36 0 0 1 -19.483059605263094 -19.483059605263094 c -2.7403368295936765 -6.615758339475543 -2.7403368295936765 -15.00270674803144 -2.7403368295936765 -31.77660356514323 L 0 54 c 0 -16.77389681711179 0 -25.160845225667686 2.7403368295936765 -31.77660356514323 a 36 36 0 0 1 19.483059605263094 -19.483059605263094 c 6.615758339475543 -2.7403368295936765 15.00270674803144 -2.7403368295936765 31.77660356514323 -2.7403368295936765 Z'
  );

  @media (max-width: 620px) {
    width: 58px;
    height: 58px;
    border-radius: 20px;
    clip-path: unset;
  }
`;
const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;

  clip-path: path(
    'M 51.4 0 c 17.368025817930885 0 26.052038726896328 0 32.6378944278172 3.4870310973391967 a 30 30 0 0 1 12.475074474843604 12.475074474843604 c 3.4870310973391967 6.585855700920876 3.4870310973391967 15.269868609886318 3.4870310973391967 32.6378944278172 L 100 51.4 c 0 17.368025817930885 0 26.052038726896328 -3.4870310973391967 32.6378944278172 a 30 30 0 0 1 -12.475074474843604 12.475074474843604 c -6.585855700920876 3.4870310973391967 -15.269868609886318 3.4870310973391967 -32.6378944278172 3.4870310973391967 L 48.6 100 c -17.368025817930885 0 -26.052038726896328 0 -32.6378944278172 -3.4870310973391967 a 30 30 0 0 1 -12.475074474843604 -12.475074474843604 c -3.4870310973391967 -6.585855700920876 -3.4870310973391967 -15.269868609886318 -3.4870310973391967 -32.6378944278172 L 0 48.6 c 0 -17.368025817930885 0 -26.052038726896328 3.4870310973391967 -32.6378944278172 a 30 30 0 0 1 12.475074474843604 -12.475074474843604 c 6.585855700920876 -3.4870310973391967 15.269868609886318 -3.4870310973391967 32.6378944278172 -3.4870310973391967 Z'
  );

  @media (max-width: 620px) {
    width: 54px;
    height: 54px;
    border-radius: 18px;
    clip-path: unset;
  }
`;
