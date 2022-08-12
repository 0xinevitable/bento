import { Icon } from '@iconify/react';
import { useCallback } from 'react';
import styled from 'styled-components';

import { Modal } from '@/components/Modal';
import { FeatureFlags } from '@/utils/FeatureFlag';
import { Supabase } from '@/utils/Supabase';

type LoginNudgeProps = {
  className?: string;
  accessory?: React.ReactNode;
};

export const LoginNudge: React.FC<LoginNudgeProps> = ({
  className,
  accessory,
}) => {
  const onClickLogin = useCallback(async (provider: 'twitter' | 'github') => {
    const { user, session, error } = await Supabase.auth.signIn(
      { provider },
      { redirectTo: `${window.location.origin}/home` },
    );
    console.log({ user, session, error });
  }, []);

  return (
    <Wrapper className={className}>
      <Container>
        {accessory}
        <LockIllust
          className="lock-illust"
          src="/assets/illusts/lock.png"
          alt=""
        />
        <Title className="text-3xl text-white font-bold">Log in to Bento</Title>
        <Content className="mt-10 flex flex-col gap-2">
          <Button
            className="twitter ring-1 ring-[#292c4b]/20"
            onClick={() => onClickLogin('twitter')}
          >
            <ButtonIcon src="/assets/social/twitter.png" alt="" />
            Login with Twitter
          </Button>
          <Button
            className="github ring-1 ring-white/20"
            onClick={() => onClickLogin('github')}
          >
            <ButtonIcon src="/assets/social/github.png" alt="" />
            Login with GitHub
          </Button>
          {FeatureFlags.isEmailMagicLinkEnabled && (
            <>
              <Bar />
              <Button className="default">
                <Icon icon="fa6-solid:wand-magic-sparkles" />
                <span className="ml-2">Use Magic Email Link</span>
              </Button>
            </>
          )}
        </Content>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: flex-start;
`;
const Container = styled.div`
  padding-top: 48px;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: relative;
`;

const LockIllust = styled.img`
  margin-left: -8px;
  width: 256px;
  height: 256px;
  user-select: none;
`;
const Title = styled.h2``;

const Content = styled.div`
  width: 100%;
  max-width: 412px;
`;

const Bar = styled.div`
  margin: 16px 0;
  width: 100%;
  height: 2px;
  border-radius: 1px;
  background: radial-gradient(98% 205% at 0% 0%, #74021a 0%, #c1124f 100%);
  box-shadow: 0px 2px 6px rgba(151, 42, 53, 0.45);
`;

const Button = styled.button`
  width: 100%;
  padding: 16px 32px;

  width: 100%;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
  font-size: 18px;
  letter-spacing: -0.025rem;

  transition: all 0.1s ease-in-out;

  &.twitter {
    background-color: #1da1f2;
    color: #f5f8fa;
    text-shadow: 0px 4px 12px rgba(120, 120, 120, 0.42);
  }

  &.github {
    background-color: #22272b;
    color: white;
    text-shadow: 0px 4px 12px rgba(0, 0, 0, 0.42);
  }

  &.default {
    background-color: #c1124f;
    color: white;
    text-shadow: 0px 4px 12px rgba(101, 0, 12, 0.42);
    box-shadow: 0px 8px 16px rgba(193, 18, 79, 0.45);
  }

  &:hover {
    transform: scale(0.99);
  }

  &:focus {
    opacity: 0.85;
    transform: scale(0.98);
  }
`;
const ButtonIcon = styled.img`
  margin-right: 12px;
  width: 32px;
  height: 32px;
  object-fit: contain;
`;

type FixedLoginNudgeProps = LoginNudgeProps & {
  visible?: boolean;
  onDismiss?: () => void;
};
export const FixedLoginNudge: React.FC<FixedLoginNudgeProps> = ({
  visible: isVisible = false,
  onDismiss,
  ...loginNudgeProps
}) => {
  return (
    <OverlayWrapper
      visible={isVisible}
      onDismiss={onDismiss}
      transition={{ ease: 'linear' }}
    >
      <StyledLoginNudge {...loginNudgeProps} />
    </OverlayWrapper>
  );
};
const OverlayWrapper = styled(Modal)`
  .animated-blur {
    background-color: rgba(0, 0, 0, 0.7);
  }
  .modal-background {
    align-items: flex-start;
  }

  .modal-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const StyledLoginNudge = styled(LoginNudge)`
  width: 90vw;

  margin-top: calc(48px + 64px + 1.5rem);

  & > div {
    padding-top: 0;
  }

  & img.lock-illust {
    filter: drop-shadow(0px 16px 48px rgba(151, 42, 53, 0.45));
  }
`;
