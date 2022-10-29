import styled from '@emotion/styled';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import React, { useMemo } from 'react';

import { AnimatedToolTip, Modal } from '@/components/system';
import { formatUsername } from '@/utils/format';

import { UserProfile } from '@/profile/types/UserProfile';
import { Colors } from '@/styles';
import { Analytics, Config, copyToClipboard, toast } from '@/utils';

import { MinimalButton } from './MinimalButton';

type ProfileShareModalProps = {
  profile: UserProfile | null;
  cardURL: string;
  loading: boolean;
  visible?: boolean;
  onDismiss?: () => void;
};

const BUTTON_TITLE = 'Copy URL';

export const ProfileShareModal: React.FC<ProfileShareModalProps> = ({
  profile,
  cardURL,
  loading,
  visible: isVisible = false,
  onDismiss,
}) => {
  const { t } = useTranslation('dashboard');
  const [formattedUsername, filename] = useMemo(() => {
    const f = formatUsername(profile?.username);
    return [f, f.replace(/@/g, '_')];
  }, [profile]);
  return (
    <OverlayWrapper
      visible={isVisible}
      onDismiss={onDismiss}
      transition={{ ease: 'linear' }}
    >
      {loading ? (
        <div
          style={{
            height: 64,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <span
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            {t('Generating...')}
          </span>
          <span
            style={{
              color: Colors.gray200,
              fontSize: 16,
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            {t('It might take some time...')}
          </span>
        </div>
      ) : (
        <>
          <AnimatedToolTip label={t('Click to Download')} placement="top">
            <a
              href={cardURL.replace(
                `${Config.MAIN_API_BASE_URL}/api/images`,
                '/api/proxy',
              )}
              download={`${filename}.png`}
            >
              <CardImage src={cardURL} />
            </a>
          </AnimatedToolTip>
          <ButtonRow>
            <MinimalButton
              className="yellow"
              onClick={() => {
                Analytics.logEvent('click_download_profile_card', {
                  title: 'Download Image',
                });

                axios
                  .get(
                    cardURL.replace(
                      `${Config.MAIN_API_BASE_URL}/api/images`,
                      '/api/proxy',
                    ),
                    { responseType: 'blob' },
                  )
                  .then(({ data: blob }) => {
                    console.log(blob);
                    const url = window.URL.createObjectURL(blob);
                    console.log(url);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `${filename}.png`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                  })
                  .catch((err) => {
                    console.error(err);
                    toast({
                      title: 'Error downloading image!',
                      description: `Profile ${formattedUsername}`,
                    });
                  });
              }}
            >
              {t('Download Image')}
            </MinimalButton>
            <MinimalButton
              onClick={() => {
                Analytics.logEvent('click_share_my_profile', {
                  title: BUTTON_TITLE,
                });

                Analytics.logEvent('click_copy_profile_link', {
                  user_id: profile?.user_id ?? '',
                  username: profile?.username ?? '',
                  is_my_profile: true,
                });
                copyToClipboard(
                  `${window.location.origin}/u/${profile?.username}`,
                );
                toast({
                  title: 'Copied link to clipboard!',
                  description: `Profile ${formattedUsername}`,
                });
              }}
            >
              {t(BUTTON_TITLE)}
            </MinimalButton>
          </ButtonRow>
        </>
      )}
    </OverlayWrapper>
  );
};

const OverlayWrapper = styled(Modal)`
  .modal-container {
    margin: 0 16px;
    padding: 20px;
    height: fit-content;
    overflow: hidden;
    width: 100%;
    max-width: 420px;

    max-height: calc(100vh - 64px - 32px);
    overflow: scroll;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;

    border-radius: 16px;
    border: 1px solid ${Colors.gray600};
    box-shadow: 0 4px 24px ${Colors.black};
    background-color: ${Colors.gray800};
    cursor: pointer;

    @media (max-height: 720px) {
      margin-top: 40px;
    }
  }
`;

const CardImage = styled.img`
  width: 378px;
  height: 486px;
  object-fit: cover;
  border-radius: 12px;
  border: 4px solid ${Colors.gray850};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(0.95);
  }

  @media (max-width: 520px) {
    max-width: 302px;
    width: 100%;
    height: 388px;
  }

  @media (max-height: 672px) {
    max-width: 302px;
    width: 100%;
    height: 388px;
  }

  @media (max-height: 570px) {
    max-height: 280px;
  }
`;
const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 366px) {
    width: 100%;
    margin-top: 8px;
    flex-direction: column;
    gap: 12px;

    & > button {
      margin: 0;
      height: 48px;
      width: 100%;
    }
  }
`;
