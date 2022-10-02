import { Icon as Iconify } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

import GithubIcon from '@/assets/icons/ic-github.svg';
import TwitterIcon from '@/assets/icons/ic-twitter.svg';
import { Icon, NoSSR, Portal } from '@/components/system';
import { useSession } from '@/hooks/useSession';
import { useSignOut } from '@/hooks/useSignOut';

import { Colors } from '@/styles';
import { Analytics, FeatureFlags } from '@/utils';

const Breakpoints = {
  Mobile: 512,
  Tablet: 768,
  Laptop: 1340,
  Desktop: 1440,
};

const onMobile = `@media (max-width: ${Breakpoints.Mobile}px)`;
const onTablet = `@media (max-width: ${Breakpoints.Tablet}px)`;

const NAVIGATION_ITEMS = [
  {
    title: 'Dashboard',
    href: '/home',
    icon: 'ic:round-space-dashboard',
  },
  ...(FeatureFlags.isProfileEnabled
    ? [
        {
          title: 'Profile',
          href: '/profile',
          icon: 'carbon:user-avatar-filled',
        },
      ]
    : []),
];

export const NavigationBar = () => {
  const router = useRouter();
  const currentPath = useMemo(() => {
    if (router.route.startsWith('/profile')) {
      // e.g. /profile/intro
      return '/profile';
    }
    if (router.route.startsWith('/u/')) {
      return '/profile';
    }
    return router.route;
  }, [router]);

  const { session } = useSession();
  const { signOut } = useSignOut();

  const onClickLogout = useCallback(async () => {
    await Analytics.logEvent('click_logout', {
      medium: 'gnb',
    });
    await signOut();
  }, [signOut]);

  const [isMobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const { t, i18n } = useTranslation('common');
  const currentLanguage = i18n.resolvedLanguage || i18n.language || 'en';

  const onChangeLocale = useCallback(() => {
    console.log(currentLanguage);
    i18n.changeLanguage(currentLanguage === 'en' ? 'ko' : 'en');
  }, [i18n, currentLanguage]);

  return (
    <Wrapper>
      <Container>
        <Link href="/" passHref>
          <a>
            <HiddenTitle>Bento</HiddenTitle>
            <LogoWrapper>
              <LogoImage src="/assets/illusts/bento-logo-with-blur.png" />
            </LogoWrapper>
          </a>
        </Link>

        <NoSSR>
          <NavigationList>
            {NAVIGATION_ITEMS.map((item) => (
              <NavigationItem
                key={`${item.title}-${item.href}`}
                active={currentPath === item.href}
              >
                <Link href={item.href} passHref>
                  <a>
                    <Iconify icon={item.icon} style={{ fontSize: 20 }} />
                    <span className="title">{t(item.title)}</span>
                  </a>
                </Link>
              </NavigationItem>
            ))}
          </NavigationList>
        </NoSSR>

        <RightContent>
          <SocialIconList>
            {!!session && (
              <button className="logout" onClick={onClickLogout}>
                {t('Logout')}
              </button>
            )}
            <a
              href="https://twitter.com/bentoinevitable"
              target="_blank"
              onClick={() =>
                Analytics.logEvent('click_social_link', {
                  type: 'twitter',
                  medium: 'gnb',
                })
              }
            >
              <TwitterIcon />
            </a>
            <a
              href="https://github.com/inevitable-changes/bento"
              target="_blank"
              onClick={() =>
                Analytics.logEvent('click_social_link', {
                  type: 'github',
                  medium: 'gnb',
                })
              }
            >
              <GithubIcon />
            </a>
          </SocialIconList>

          <LanguageSelector>
            <button
              className={currentLanguage === 'en' ? 'selected' : ''}
              onClick={onChangeLocale}
            >
              <span>EN</span>
            </button>
            <button
              className={currentLanguage === 'ko' ? 'selected' : ''}
              onClick={onChangeLocale}
            >
              <span>KO</span>
            </button>
          </LanguageSelector>
        </RightContent>

        <MobileMenuButton onClick={() => setMobileMenuOpen((prev) => !prev)}>
          <Icon
            size={30}
            icon={!isMobileMenuOpen ? 'ic-mobile-menu' : 'ic-mobile-close'}
            color="white"
          />
        </MobileMenuButton>
      </Container>

      <Portal id="mobile-menu">
        <MobileMenuContainer
          style={isMobileMenuOpen ? { height: '100%' } : { height: 0 }}
        >
          <AnimatePresence>
            {isMobileMenuOpen && (
              <MobileMenuContent
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {NAVIGATION_ITEMS.map((item) => (
                  <MobileMenuItem
                    key={`${item.title}-${item.href}`}
                    style={{
                      color: currentPath === item.href ? '#ff375c' : 'white',
                    }}
                  >
                    <Link href={item.href} passHref>
                      <a
                        className="h-full flex gap-2 items-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Iconify className="text-xl" icon={item.icon} />
                        <span className="text-2xl font-medium leading-none">
                          {t(item.title)}
                        </span>
                      </a>
                    </Link>
                  </MobileMenuItem>
                ))}
              </MobileMenuContent>
            )}
          </AnimatePresence>
        </MobileMenuContainer>
      </Portal>
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
  max-width: 1328px;
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

const NavigationList = styled.ul`
  display: flex;

  @media (max-width: 680px) {
    display: none;
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
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;

    & > span.title {
      font-size: 14px;
      font-weight: 500;
      line-height: 1;
    }
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

const RightContent = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 32px;

  position: relative;
  z-index: 10;

  @media (max-width: 680px) {
    margin-left: auto;
    margin-right: 20px;
  }
`;

const SocialIconList = styled.div`
  gap: 12px;

  & > button.logout {
    /* h-8 text-white text-sm mr-4 hover:text-white/70 transition-colors
     */
    margin-right: 16px;
    height: 32px;

    font-size: 14px;
    line-height: 20px;
    color: ${Colors.gray000};

    transition-property: color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;

    &:hover {
      color: ${Colors.gray200};
    }
  }

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

  @media (max-width: 680px) {
    display: none;
  }
`;

const LanguageSelector = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 0;

  & > button {
    height: 100%;
    padding: 0 6px;
    font-weight: 900;
    font-size: 20px;
    line-height: 120%;
    text-align: center;
    letter-spacing: 0.01em;
    user-select: none;

    & > span {
      color: ${Colors.gray500};
    }

    &.selected > span {
      color: #ffcff2;
      background: linear-gradient(
          to right,
          #ffffff 5%,
          #e4f7ff 15%,
          #cef0ff 41%,
          #b4c4ff 48%,
          #ffcff2 54%,
          #ffffff 62%,
          #d2d2d2 81%,
          #ffd7d7 92%,
          #d5d5d5 100%
        ),
        #ffcff2;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
  }
`;

const MobileMenuButton = styled.button`
  width: 40px;
  height: 40px;

  align-items: center;
  justify-content: center;

  border: 2px solid white;
  border-radius: 2px;

  display: none;

  @media (max-width: 680px) {
    display: flex;
  }
`;

const MobileMenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 80;
  background-color: black;
  transition: all 0.5s ease-in-out;
`;
const MobileMenuContent = styled(motion.ul)`
  margin: 0 auto;
  padding: ${64 + 16}px 20px 0;
  max-width: 1328px;

  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const MobileMenuItem = styled.li`
  padding: 16px 0;
`;
