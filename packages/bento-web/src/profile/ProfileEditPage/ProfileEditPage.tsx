import { useMemo, useState } from 'react';
import styled from 'styled-components';

import { FieldInput } from '../components/FieldInput';
import { FieldTextArea } from '../components/FieldTextArea';
import { ExampleUserProfile } from '../constants/ExampleUserProfile';

import { Preview } from './components/Preview';
import { ProfileLinkItem } from './components/ProfileLinkItem';
import { TabBar } from './components/TabBar';

const ManagePage = () => {
  const [username, setUsername] = useState<string>(ExampleUserProfile.username);
  const [displayName, setDisplayName] = useState<string>(
    ExampleUserProfile.displayName,
  );
  const [bio, setBio] = useState<string>(ExampleUserProfile.bio);

  const profileDraft = useMemo(
    () => ({ ...ExampleUserProfile, username, displayName, bio }),
    [username, displayName, bio],
  );

  return (
    <>
      <Wrapper>
        <Preview profileDraft={profileDraft} />
        <EditorWrapper>
          <TabBar />
          <Container>
            <ProfileContainer id="profile">
              <FieldInput
                field="사용자 이름"
                placeholder="여러분의 링크에 들어가는 이름이에요"
                defaultValue={ExampleUserProfile.username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <FieldInput
                field="프로필에 보여질 이름"
                placeholder="당신의 이름을 적어주세요"
                defaultValue={ExampleUserProfile.displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <FieldTextArea
                field="한 줄 소개"
                placeholder="한 문장으로 당신을 표현해 주세요"
                defaultValue={ExampleUserProfile.bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </ProfileContainer>
            <ProfileLinkList id="links">
              {ExampleUserProfile.links.map((item, index) => {
                return <ProfileLinkItem key={`item-${index}`} {...item} />;
              })}
            </ProfileLinkList>
          </Container>
        </EditorWrapper>
      </Wrapper>
    </>
  );
};

export default ManagePage;

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
