import styled from '@emotion/styled';
import { Icon } from '@iconify/react';
import { Session } from '@supabase/supabase-js';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import { AnimatedToolTip, Badge } from '@/components/system';

import { NETWORKS } from '@/constants/networks';
import { FixedLoginNudge } from '@/profile/components/LoginNudge';
import { Colors } from '@/styles';
import { Analytics, FeatureFlags, Supabase } from '@/utils';

import { SearchBar } from './components/SearchBar';

type DashboardIntroProps = {
  session: Session | null;
};

export const DashboardIntro: React.FC<DashboardIntroProps> = ({ session }) => {
  const { t } = useTranslation('intro');
  const [isFixedLoginNudgeVisible, setFixedLoginNudgeVisible] =
    useState<boolean>(false);

  const login = useCallback(async (provider: 'twitter' | 'github') => {
    const { user, session, error } = await Supabase.auth.signIn(
      { provider },
      { redirectTo: `${window.location.origin}/home` },
    );
    Analytics.logEvent('sign_in', { anonymous: false });
    console.log({ user, session, error });
  }, []);

  const onClickLogin = useCallback(() => {
    Analytics.logEvent('click_dashboard_login', {
      title: 'View your Dashboard',
    });

    setFixedLoginNudgeVisible(true);
  }, [login]);

  const router = useRouter();
  useEffect(() => {
    const isModalOpen = !!router.query.login;
    if (isModalOpen) {
      setFixedLoginNudgeVisible(true);

      // remove query param
      router.replace(router.pathname, router.pathname, { shallow: true });
    }
  }, [router.query]);

  useEffect(() => {
    if (!session) {
      Analytics.logEvent('view_dashboard_login', undefined);
    }
  }, [JSON.stringify(session)]);

  return (
    <div>
      <div
        style={{
          marginTop: 64,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Badge>⚡ Bento.Finance</Badge>
        <h1
          style={{
            marginTop: 16,
            color: Colors.white,
            fontSize: 42,
            fontWeight: 900,
            lineHeight: 1.2,
            textAlign: 'center',
          }}
        >
          {t('Group Identity')}
          <br />
          {t('From Web3 Finance')}
        </h1>

        <div
          style={{
            marginTop: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <Button onClick={onClickLogin}>{t('View your Dashboard')}</Button>
          <a
            title="About"
            style={{
              marginTop: 8,
              marginLeft: 'auto',
              marginRight: 'auto',
              color: Colors.gray400,
              fontSize: 14,
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
            href="/"
            onClick={() => {
              Analytics.logEvent('click_landing_link', {
                title: 'About',
                medium: !session
                  ? 'dashboard_login'
                  : 'dashboard_connect_wallet',
              });
            }}
          >
            <span style={{ marginTop: 1.5 }}>{t('About')}</span>
            <Icon icon="heroicons-solid:external-link" />
          </a>
        </div>
      </div>

      {FeatureFlags.isSearchEnabled && <SearchBar />}

      <ProtocolSection>
        <Subtitle>{t('Your favorite chains and protocols')}</Subtitle>
        <ProtocolList>
          {NETWORKS.map((network) => (
            <li key={network.id}>
              <AnimatedToolTip label={network.name}>
                <ProtocolImageWrapper>
                  <Image
                    style={{ cursor: 'pointer' }}
                    alt={network.name}
                    src={network.logo}
                    width={56}
                    height={56}
                  />
                </ProtocolImageWrapper>
              </AnimatedToolTip>
            </li>
          ))}
        </ProtocolList>
      </ProtocolSection>

      <FixedLoginNudge
        visible={isFixedLoginNudgeVisible}
        accessory={
          <FixedAccessoryRow>
            <CloseButton
              onClick={() => setFixedLoginNudgeVisible((prev) => !prev)}
            >
              <Icon icon="maki:cross" width={24} height={24} />
            </CloseButton>
          </FixedAccessoryRow>
        }
      />
    </div>
  );
};

const Button = styled.button`
  padding: 20px 32px;
  /* width: 100%; */
  width: fit-content;
  /* max-width: 282px; */
  position: relative;

  border-radius: 8px;
  border: 1px solid rgba(255, 165, 165, 0.66);
  background: radial-gradient(98% 205% at 0% 0%, #74021a 0%, #c1124f 100%);
  filter: drop-shadow(0px 10px 32px rgba(151, 42, 53, 0.33));

  font-weight: 700;
  font-size: 21.3946px;

  line-height: 100%;
  text-align: center;
  letter-spacing: -0.05em;

  /* color: rgba(255, 255, 255, 0.92); */
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0px 4px 12px rgba(101, 0, 12, 0.42);

  &:hover {
    border-color: rgba(255, 165, 165, 0.45);

    /* 85% opacity */
    background: radial-gradient(
      98% 205% at 0% 0%,
      rgba(116, 2, 27, 0.85) 0%,
      rgba(193, 18, 79, 0.85) 100%
    );
  }
`;

const ProtocolSection = styled.section`
  margin-top: 86px;
  margin-bottom: 100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Subtitle = styled.h2`
  font-weight: 700;
  font-size: 18px;
  line-height: 103%;

  color: #ffffff;
`;
const ProtocolList = styled.ul`
  margin-top: 24px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  img {
    width: 56px;
    height: 56px;

    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.05);
    user-select: none;
  }
`;
const ProtocolImageWrapper = styled.span`
  width: fit-content;
  height: fit-content;
  display: flex;
`;

const FixedAccessoryRow = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  max-width: 450px;
  display: flex;
  justify-content: flex-end;
`;
const CloseButton = styled.button`
  color: rgba(255, 255, 255, 0.6);
  padding: 8px;
  font-size: 28px;
  transition: all 0.2s ease-in-out;

  &:focus {
    color: rgba(255, 255, 255, 0.3);
  }
`;
