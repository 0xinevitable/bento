import React from 'react';
import styled from 'styled-components';

import { Button } from '@/components/Button';
import { FieldInput } from '@/profile/components/FieldInput';

export type UserInformationDraft = {
  username: string;
  displayName: string;
  bio: string;
};

type Props = {
  draft: UserInformationDraft;
  setDraft: React.Dispatch<React.SetStateAction<UserInformationDraft>>;
  onSubmit: () => void;
};

export const ProfileEditor: React.FC<Props> = ({
  draft,
  setDraft,
  onSubmit,
}) => {
  return (
    <Container>
      <FieldInput
        field="Name"
        placeholder="Name"
        defaultValue={draft.displayName}
        onChange={(e) =>
          setDraft((v) => ({ ...v, displayName: e.target.value }))
        }
      />
      <FieldInput
        field="Username"
        placeholder="@username"
        defaultValue={draft.username}
        onChange={(e) => setDraft((v) => ({ ...v, username: e.target.value }))}
      />
      <FieldInput
        field="Description"
        placeholder="Description"
        defaultValue={draft.bio}
        onChange={(e) => setDraft((v) => ({ ...v, bio: e.target.value }))}
      />
      <SaveButton onClick={onSubmit}>Save</SaveButton>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 20px;
`;

const SaveButton = styled(Button)`
  margin-top: 12px;
  width: 100%;
`;
