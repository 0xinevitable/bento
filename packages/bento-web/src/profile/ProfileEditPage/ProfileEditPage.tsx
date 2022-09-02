import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { MetaHead } from '@/components/MetaHead';
import { FeatureFlags } from '@/utils/FeatureFlag';

import { useProfile } from '../ProfileDetailPage/hooks/useProfile';
import { LinkBlock } from '../blocks/types';
import { FieldInput } from '../components/FieldInput';
import { FieldTextArea } from '../components/FieldTextArea';
import { BlockEditItem } from './components/BlockEditItem';
import { Preview } from './components/Preview';
import { TabBar } from './components/TabBar';

const emptyBlock: LinkBlock = {
  type: 'link',
  title: '',
  description: '',
  url: '',
  images: [''],
};

export const getServerSideProps: GetServerSideProps = async () => {
  if (!FeatureFlags.isProfileDetailedEditorEnabled) {
    return { notFound: true };
  }
  return { props: {} };
};

const ProfileEditPage = () => {
  const { profile } = useProfile();

  const [username, setUsername] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [blocks, setBlocks] = useState<LinkBlock[]>([]);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!profile) {
      return;
    }
    setUsername(profile.username);
    setDisplayName(profile.display_name);
    setBio(profile.bio);

    // FIXME:
    setBlocks([]);

    if (!!profile.images) {
      setImages(profile.images);
    } else {
      setImages(['/assets/mockups/profile-default.png']);
    }
  }, [profile]);

  const profileDraft = useMemo(
    () => ({
      ...profile,
      username,
      display_name: displayName,
      bio,
      links: blocks,
      images,
      verified: false,
      tabs: [],
    }),
    [username, displayName, images, bio, blocks],
  );

  const onSubmit = useCallback(async () => {
    const { data } = await axios.post(`/api/profile`, {
      username,
      display_name: displayName,
      bio,
      links: blocks,
    });
    console?.log(data);
  }, [username, displayName, bio, blocks]);

  return (
    <>
      <MetaHead />

      <Wrapper>
        <Preview profileDraft={profileDraft} />
        <EditorWrapper>
          <TabBar onClick={onSubmit} />
          <Container>
            <ProfileContainer id="profile">
              <FieldInput
                field="사용자 이름"
                placeholder="여러분의 링크에 들어가는 이름이에요"
                defaultValue={profile?.username ?? ''}
                onChange={(e) => setUsername(e?.target.value)}
              />
              <FieldInput
                field="프로필에 보여질 이름"
                placeholder="당신의 이름을 적어주세요"
                defaultValue={profile?.display_name ?? ''}
                onChange={(e) => setDisplayName(e?.target.value)}
              />
              <FieldTextArea
                field="한 줄 소개"
                placeholder="한 문장으로 당신을 표현해 주세요"
                defaultValue={profile?.bio ?? ''}
                onChange={(e) => setBio(e?.target.value)}
              />
            </ProfileContainer>
            <ProfileLinkList id="links">
              {blocks.map((item, index) => {
                return (
                  <BlockEditItem
                    key={`item-${index}`}
                    linkDraft={item}
                    // FIXME: default block
                    // defaultBlock={profile?.blocks?.[index]}
                    onChange={(updated) =>
                      setBlocks(
                        blocks.map((link, i) => (i === index ? updated : link)),
                      )
                    }
                    onDelete={() => {
                      const deletedLinks = blocks.filter(
                        (_, i) => !(i === index),
                      );
                      setBlocks(deletedLinks);
                    }}
                  />
                );
              })}
            </ProfileLinkList>
            <button onClick={() => setBlocks([...blocks, emptyBlock])}>
              Add link
            </button>
          </Container>
        </EditorWrapper>
      </Wrapper>
    </>
  );
};

export default ProfileEditPage;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #111319;
  display: flex;
`;

const EditorWrapper = styled.div`
  height: 100vh;
  padding-top: 64px;
  margin-left: auto;
  width: 38vw;
  background-color: #171c21;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.35);
`;

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 36px 48px;
`;

const ProfileContainer = styled.div`
  padding-top: 28px;
  display: flex;
  flex-direction: column;
`;

const ProfileLinkList = styled.ul`
  margin: 16px 0 0;
  padding: 0;
`;
