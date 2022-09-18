import { AnimatedToolTip } from '@bento/client/components/AnimatedToolTip';
import { Badge } from '@bento/client/components/Badge';
import { NETWORKS } from '@bento/client/constants/networks';
import { useSession } from '@bento/client/hooks/useSession';
import { Analytics, Supabase } from '@bento/client/utils';
import { FixedLoginNudge } from '@bento/private/profile/components/LoginNudge';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

type DashboardIntroProps = {
  onConnectWallet?: () => void;
};
export const DashboardIntro: React.FC<DashboardIntroProps> = ({
  onConnectWallet,
}) => {
  const { session } = useSession();
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

  const onClickConnectWallet = useCallback(() => {
    Analytics.logEvent('click_dashboard_connect_wallet', {
      title: 'Connect Wallet',
    });
    onConnectWallet?.();
  }, [onConnectWallet]);

  const hasLoggedLoginViewEvent = useRef<boolean>(false);
  const hasLoggedConnectWalletViewEvent = useRef<boolean>(false);

  useEffect(() => {
    if (!session || !hasLoggedLoginViewEvent.current) {
      Analytics.logEvent('view_dashboard_login', undefined);
      hasLoggedLoginViewEvent.current = true;
    } else if (!hasLoggedConnectWalletViewEvent.current) {
      Analytics.logEvent('view_dashboard_connect_wallet', undefined);
      hasLoggedConnectWalletViewEvent.current = true;
    }
  }, [JSON.stringify(session)]);

  return (
    <div>
      <div className="mt-[64px] flex flex-col items-center">
        <Badge>⚡ Bento.Finance</Badge>
        <h1 className="mt-4 text-white text-5xl font-black leading-[120%] text-center">
          Group Identity
          <br />
          From Web3 Finance
        </h1>

        <div className="mt-6 flex flex-col gap-2">
          <Button
            onClick={
              !session //
                ? onClickLogin
                : onClickConnectWallet
            }
          >
            {!session ? 'View your Dashboard' : 'Connect Wallet'}
          </Button>
          <a
            title="About"
            className="mt-2 text-white/50 text-sm flex items-center gap-1 mx-auto"
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
            <span className="leading-none mt-[1.5px]">About</span>
            <Icon icon="heroicons-solid:external-link" />
          </a>
        </div>
      </div>

      <ProtocolSection>
        <Subtitle>Your favorite chains and protocols</Subtitle>
        <ProtocolList>
          {NETWORKS.map((network) => (
            <li key={network.id}>
              <AnimatedToolTip label={network.name}>
                <Image
                  className="cursor-pointer"
                  alt={network.name}
                  src={network.logo}
                  width={56}
                  height={56}
                />
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
  letter-spacing: 0.01em;
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
