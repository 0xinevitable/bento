import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { deleteCookie } from 'cookies-next';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { NoSSR } from '@/components/system';
import { useSession } from '@/hooks/useSession';
import { useSignOut } from '@/hooks/useSignOut';
import { useWindowSize } from '@/hooks/useWindowSize';

import { Analytics } from '@/utils';

import { Button } from './v2/Button';

const Breakpoints = {
  Mobile: 512,
  Tablet: 768,
  Desktop: 1440,
};

const onMobile = `@media (max-width: ${Breakpoints.Mobile}px)`;

const NAVIGATION_ITEMS = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Dashboard',
    href: '/home',
  },
];

export const NavigationBar = () => {
  const router = useRouter();
  const currentPath = useMemo(() => {
    if (router.route.startsWith('/u/')) {
      // e.g. /profile/intro
      return '/home';
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

  const onChangeLocale = useCallback(
    () =>
      router.push(router.asPath, router.asPath, {
        locale: currentLanguage === 'en' ? 'ko' : 'en',
      }),
    [i18n, currentLanguage],
  );

  const { width: windowWidth } = useWindowSize();
  useEffect(() => {
    if (isMobileMenuOpen && windowWidth > 680) {
      setMobileMenuOpen(false);
    }
  }, [isMobileMenuOpen, windowWidth]);

  return (
    <Wrapper>
      <Container>
        <NoSSR>
          <NavigationList>
            {NAVIGATION_ITEMS.map((item) => (
              <NavigationItem
                key={`${item.title}-${item.href}`}
                active={currentPath === item.href}
              >
                <Link href={item.href}>
                  <span className="title">{t(item.title)}</span>
                </Link>
              </NavigationItem>
            ))}
          </NavigationList>
        </NoSSR>

        <NoSSR>
          <RightContent>
            <LanguageBadge onClick={onChangeLocale}>
              {currentLanguage.toUpperCase()}
            </LanguageBadge>
            {!session && (
              <StartButton
                onClick={() => {
                  deleteCookie('supabase_auth_token', {
                    path: '/',
                  });
                  setTimeout(() => {
                    router.push('/home?login=open');
                  });
                }}
              >
                {t('Log In')}
              </StartButton>
            )}
            {!!session && (
              <StartButton onClick={onClickLogout}>{t('Logout')}</StartButton>
            )}
          </RightContent>
        </NoSSR>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  width: 100%;
  padding: 0 20px;

  display: flex;
  justify-content: center;
  overflow: hidden;

  position: fixed;
  top: 28px;
  left: 0;
  right: 0;
  z-index: 90;

  &,
  * {
    user-select: none;
    transition: all 0.2s ease;
  }

  ${onMobile} {
    padding: 0 8px;
    top: 20px;
  }
`;
const Container = styled.div`
  padding-left: 28px;
  padding-right: 12px;
  width: 100%;
  max-width: 780px;
  height: 70px;

  background: rgba(18, 11, 16, 0.6);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(6px);
  border-radius: 8px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  ${onMobile} {
    height: fit-content;
    padding: 12px 0;
    padding-left: 16px;
    padding-right: 10px;
  }
`;

const NavigationList = styled.ul`
  display: flex;
  gap: 20px;

  ${onMobile} {
    gap: 12px;
  }
`;

type NavigationItemProps = {
  active?: boolean;
};
const NavigationItem = styled.li<NavigationItemProps>`
  position: relative;
  color: #343639;

  * {
    transition: color 0.05s ease;
  }

  & > a {
    display: flex;
    justify-content: center;
    align-items: center;

    span.title {
      font-size: 14px;
      font-weight: bold;
      line-height: 1;
    }
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
  gap: 16px;

  ${onMobile} {
    gap: 10px;
  }
`;
const LanguageBadge = styled.button`
  padding: 8px;
  width: fit-content;

  background: rgba(151, 163, 182, 0.22);
  border: 2px solid #97a3b6;
  border-radius: 8px;

  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  text-align: center;
  letter-spacing: -0.02em;
  color: #97a3b6;
`;
const StartButton = styled(Button)`
  ${onMobile} {
    padding: 12px 24px;
    font-size: 14px;
  }
`;
