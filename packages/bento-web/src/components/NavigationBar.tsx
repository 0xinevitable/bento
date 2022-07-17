import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import styled, { css } from 'styled-components';

import GithubIcon from '@/assets/icons/ic-github.svg';
import TwitterIcon from '@/assets/icons/ic-twitter.svg';
import { FeatureFlags } from '@/utils/FeatureFlag';

const Breakpoints = {
  Mobile: 512,
  Tablet: 768,
  Laptop: 1340,
  Desktop: 1440,
};

const onMobile = `@media screen and (max-width: ${Breakpoints.Mobile}px)`;
const onTablet = `@media screen and (max-width: ${Breakpoints.Tablet}px)`;

// import { onMobile, onTablet } from '@/landing/utils/breakpoints';
// import { Analytics } from '@/utils/analytics';

const NAVIGATION_ITEMS = [
  {
    title: 'Dashboard',
    href: '/',
    icon: 'ic:round-space-dashboard',
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: 'carbon:user-avatar-filled',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: 'majesticons:settings-cog',
  },
];

export const NavigationBar = () => {
  const router = useRouter();
  const currentPath = router.asPath;

  return (
    <Wrapper>
      <Container>
        <a href="https://bento.finance" target="_blank">
          <HiddenTitle>Bento</HiddenTitle>
          <LogoWrapper>
            <LogoImage src="/assets/illusts/bento-logo-with-blur.png" />
          </LogoWrapper>
        </a>

        {FeatureFlags.isProfileEnabled && (
          <ul className="flex">
            {NAVIGATION_ITEMS.map((item) => (
              <NavigationItem
                key={`${item.title}-${item.href}`}
                active={currentPath === item.href}
              >
                <Link href={item.href} passHref>
                  <a className="h-full flex gap-2 justify-center items-center">
                    <Icon className="text-xl" icon={item.icon} />
                    <span className="text-sm font-medium leading-none">
                      {item.title}
                    </span>
                  </a>
                </Link>
              </NavigationItem>
            ))}
          </ul>
        )}

        <SocialIconList>
          <a
            href="https://twitter.com/bentoinevitable"
            target="_blank"
            // onClick={() => Analytics.logEvent('click_twitter_icon', undefined)}
          >
            <TwitterIcon />
          </a>
          <a
            href="https://github.com/inevitable-changes/bento"
            target="_blank"
            // onClick={() => Analytics.logEvent('click_github_icon', undefined)}
          >
            <GithubIcon />
          </a>
        </SocialIconList>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  width: 100%;
  height: 64px;
  padding: 0 20px;

  border-bottom: 1px solid #323232;
  background-color: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(12px);

  display: flex;
  justify-content: center;
  overflow: hidden;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 90;

  ${onMobile} {
    padding: 0 16px;
  }

  & * {
    transition: all 0.2s ease-in-out;
  }
`;
const Container = styled.div`
  max-width: 1100px;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const HiddenTitle = styled.span`
  display: none;
`;
const LogoWrapper = styled.div`
  width: 156px;
  height: 78px;

  display: flex;
  align-items: center;
  justify-content: center;

  ${onTablet} {
    margin-left: -20px;
  }
`;

const BLUR_SIZE = 31.2;
const LogoImage = styled.img`
  max-width: unset;
  margin: ${-BLUR_SIZE}px;
  width: ${156 + BLUR_SIZE * 2}px;
  height: ${78 + BLUR_SIZE * 2}px;
  transform: scale(1.3);
  user-select: none;
`;

const SocialIconList = styled.div`
  gap: 12px;

  &,
  & > a {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & > a:focus {
    transform: scale(0.85);
    opacity: 0.45;
  }
`;

type NavigationItemProps = {
  active?: boolean;
};
const NavigationItem = styled.li<NavigationItemProps>`
  height: 64px;
  position: relative;
  color: rgba(255, 255, 255, 0.45);

  * {
    transition: color 0.05s ease;
  }

  & > a {
    padding: 4px 16px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    height: 0;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    background-color: #fe214a;
    width: 100%;

    transition: height 0.2s ease-in-out;
  }

  &:not(:last-of-type) {
    margin-right: 12px;
  }

  ${({ active }) =>
    active &&
    css`
      color: white;

      &::after {
        height: 4px;
      }
    `};
`;
