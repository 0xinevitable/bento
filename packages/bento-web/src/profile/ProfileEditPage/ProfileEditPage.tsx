import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { FeatureFlags } from '@/utils/FeatureFlag';

import { useProfile } from '../ProfileDetailPage/hooks/useProfile';
import { FieldInput } from '../components/FieldInput';
import { FieldTextArea } from '../components/FieldTextArea';
import { ProfileLink } from '../types/UserProfile';
import { Preview } from './components/Preview';
import { ProfileLinkEditItem } from './components/ProfileLinkEditItem';
import { TabBar } from './components/TabBar';

const emptyProfileLink: ProfileLink = {
  title: '',
  description: '',
  href: '',
  image: '',
};

export const getServerSideProps: GetServerSideProps = async () => {
  if (!FeatureFlags.isProfileEnabled) {
    return { notFound: true };
  }
  return { props: {} };
};

const ProfileEditPage = () => {
  const [profile] = useProfile();

  const [username, setUsername] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [links, setLinks] = useState<ProfileLink[]>([]);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!profile) {
      return;
    }
    setUsername(profile.username);
    setDisplayName(profile.display_name);
    setBio(profile.bio);
    setLinks(profile.links);
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
      links,
      images,
      verified: false,
      tabs: [],
    }),
    [username, displayName, images, bio, links],
  );

  const onSubmit = useCallback(async () => {
    const { data } = await axios.post(`/api/profile`, {
      username,
      display_name: displayName,
      bio,
      links,
    });
    console?.log(data);
  }, [username, displayName, bio, links]);

  return (
    <>
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
              {links.map((item, index) => {
                const deleteLink = () => {
                  const deletedLinks = links.filter((_, i) => !(i === index));
                  setLinks(deletedLinks);
                };

                return (
                  <>
                    <ProfileLinkEditItem
                      key={`item-${index}`}
                      linkDraft={item}
                      defaultLink={profile?.links[index]}
                      onChange={(updated) =>
                        setLinks(
                          links.map((link, i) =>
                            i === index ? updated : link,
                          ),
                        )
                      }
                    />
                    <button onClick={deleteLink}>Delete link</button>
                  </>
                );
              })}
            </ProfileLinkList>
            <button onClick={() => setLinks([...links, emptyProfileLink])}>
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
