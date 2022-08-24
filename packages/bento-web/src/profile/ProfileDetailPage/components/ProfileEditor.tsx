import dedent from 'dedent';
import React from 'react';
import styled from 'styled-components';

import { usePalette } from '../hooks/usePalette';

const data = {
  color: '#ff3856',
  background: dedent`
      linear-gradient(to right bottom, #E35252 0%, #DB6E57 29.47%, #C22E3A 65.1%)
    `,
};

export type UserInformationDraft = {
  username: string;
  displayName: string;
  bio: string;
};

type Props = {
  draft: UserInformationDraft;
  setDraft: React.Dispatch<React.SetStateAction<UserInformationDraft>>;
};

export const ProfileEditor: React.FC<Props> = ({ draft, setDraft }) => {
  const palette = usePalette(data.color);

  return (
    <Container>
      <NameField
        placeholder="Name"
        defaultValue={draft.displayName}
        onChange={(e) =>
          setDraft((v) => ({ ...v, displayName: e.target.value }))
        }
      />
      <UserNameField
        style={{ color: palette.primary }}
        placeholder="@username"
        defaultValue={draft.username}
        onChange={(e) => setDraft((v) => ({ ...v, username: e.target.value }))}
      />
      <BioField
        placeholder="Description"
        defaultValue={draft.bio}
        onChange={(e) => setDraft((v) => ({ ...v, bio: e.target.value }))}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const ProfileInfoInput = styled.input`
  position: relative;
  border-radius: 8px;
  align-self: center;
  margin-bottom: 10px;

  text-align: center;
  color: #ffffff;

  background-color: #171717;
`;

const NameField = styled(ProfileInfoInput)`
  width: 55%;
  height: 44px;
  font-weight: 900;
  font-size: 28px;
  line-height: 34px;
`;

const UserNameField = styled(ProfileInfoInput)`
  height: 29px;
  width: 30%;
  margin-bottom: 20px;
`;

const BioField = styled(ProfileInfoInput)`
  height: 32px;
  width: 90%;
`;
