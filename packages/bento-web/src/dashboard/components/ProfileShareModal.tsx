import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Modal } from '@/components/system';
import { formatUsername } from '@/utils/format';

import { UserProfile } from '@/profile/types/UserProfile';
import { Colors } from '@/styles';
import { Analytics, axios, copyToClipboard, toast } from '@/utils';

import { MinimalButton } from './MinimalButton';

type ProfileShareModalProps = {
  profile: UserProfile | null;
  cardURL: string;
  visible?: boolean;
  onDismiss?: () => void;
};

const BUTTON_TITLE = 'Copy URL';

export const ProfileShareModal: React.FC<ProfileShareModalProps> = ({
  profile,
  cardURL,
  visible: isVisible = false,
  onDismiss,
}) => {
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
      <a href={cardURL} download={`${filename}.png`}>
        <CardImage src={cardURL} />
      </a>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <MinimalButton
          onClick={() => {
            // const anc = document.createElement('a');
            // anc.href = cardURL;
            // anc.download = `${filename}.png`;
            // document.body.appendChild(anc);
            // anc.click();
            // document.body.removeChild(anc);
            // toast({
            //   title: 'Downloaded image!',
            //   description: `Profile ${formattedUsername}`,
            // });

            axios
              .get(cardURL, {
                responseType: 'blob',
              })
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
          Download Image
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
            copyToClipboard(`${window.location.origin}/u/${profile?.username}`);
            toast({
              title: 'Copied link to clipboard!',
              description: `Profile ${formattedUsername}`,
            });
          }}
        >
          {BUTTON_TITLE}
        </MinimalButton>
      </div>
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

    max-height: calc(100vh - 64px - 84px);
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
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 12px;
  border: 4px solid ${Colors.gray850};
`;
