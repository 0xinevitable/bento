import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button } from '@/components/system';

import { LinkBlock } from '@/profile/blocks';
import { LinkBlockItem } from '@/profile/blocks/LinkBlockItem';
import { useProfile } from '@/profile/hooks/useProfile';
import { Colors, systemFontStack } from '@/styles';

export const ProfileSummarySection: React.FC = () => {
  const { profile } = useProfile();

  const profileImageURL =
    profile?.images?.[0] || '/assets/mockups/profile-default.png';

  const [blocks, setBlocks] = useState<LinkBlock[]>([]);

  useEffect(() => {
    axios
      .get('/api/profile/blocks')
      .then(({ data }) => setBlocks(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Wrapper>
      <BorderWrapper className="profile-summary">
        <Container src={profileImageURL}>
          <Foreground>
            <ProfileImage src={profileImageURL} />
            <Information>
              {!profile?.username ? (
                <>
                  <EmptyText>Update your Profile</EmptyText>
                  <Username>{`@unknown`}</Username>
                  <AddProfileButton>Setup Now</AddProfileButton>
                </>
              ) : (
                <>
                  {!!profile?.display_name && (
                    <Name>{profile?.display_name}</Name>
                  )}
                  <Username>{`@${profile?.username}`}</Username>
                  {!!profile?.bio && <Bio>{profile?.bio}</Bio>}
                </>
              )}
            </Information>
          </Foreground>
        </Container>
      </BorderWrapper>

      <ul>
        {blocks.map((block) => (
          <LinkBlockItem key={block.url} {...block} />
        ))}
      </ul>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BorderWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1;
  padding-bottom: 100%;

  position: relative;

  border-radius: 36px;
  background-color: #aaaaaa;
  background-image: radial-gradient(
    96.62% 96.62% at 10.25% 1.96%,
    #aaaaaa 0%,
    #282c30 37.71%,
    #787d83 100%
  );
`;

type ContainerProps = {
  src?: string;
};
const Container = styled.div`
  position: absolute;
  top: 1px;
  left: 1px;
  right: 1px;
  bottom: 1px;
  border-radius: 36px;

  background-color: black;
  background-image: url(${(props: ContainerProps) => props.src});
  background-size: cover;
  overflow: hidden;
  z-index: 0;
  transform: translate3d(0, 0, 0);

  &::before,
  &::after,
  & > div {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &::before {
    z-index: 1;

    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(45px);
  }

  &::after {
    z-index: 2;

    background-image: url('/assets/profile/noise.png');
    background-size: cover;
    opacity: 0.3;
  }
`;

const Foreground = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3;
`;

const ProfileImage = styled.img`
  width: 128px;
  height: 128px;
  border-radius: 50%;
  user-select: none;
`;

const Information = styled.div`
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const Name = styled.h3`
  font-weight: 900;
  font-size: 28px;
  line-height: 100%;
  text-align: center;
  color: ${Colors.white};
`;
const Username = styled.h4`
  font-weight: 600;
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  color: #ff3856;
  color: ${Colors.brand400};
  letter-spacing: -0.05em;
`;
const Bio = styled.p`
  margin: 0 24px;
  font-weight: 400;
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  color: ${Colors.gray200};

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EmptyText = styled.span`
  font-family: 'Poppins';
  font-weight: 600;
  font-size: 18px;
  line-height: 100%;
  text-align: center;
  letter-spacing: -0.05em;
  color: #ffffff;
`;

// FIXME: Design component
const AddProfileButton = styled(Button)`
  && {
    height: unset;
    padding: 12px 18px;

    /* FIXME: !important */
    font-family: 'Raleway', ${systemFontStack} !important;
    font-weight: 800;
    font-size: 14px;
    line-height: 100%;
    text-align: center;
    color: ${Colors.white};
  }
`;
