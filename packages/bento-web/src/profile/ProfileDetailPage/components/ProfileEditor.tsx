import React from 'react';
import styled from 'styled-components';

import { Button } from '@/components/Button';
import { FieldInput } from '@/profile/components/FieldInput';
import { FieldTextArea } from '@/profile/components/FieldTextArea';

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
        placeholder="e.g., Junho Yeo"
        defaultValue={draft.displayName}
        onChange={(e) =>
          setDraft((v) => ({ ...v, displayName: e.target.value }))
        }
      />
      <FieldInput
        field="Username"
        placeholder="username (will be shown after @)"
        defaultValue={draft.username}
        onChange={(e) => setDraft((v) => ({ ...v, username: e.target.value }))}
      />
      <FieldTextArea
        field="Description"
        placeholder="e.g., 19 y.o. Builder from Seoul"
        defaultValue={draft.bio}
        onChange={(e) => setDraft((v) => ({ ...v, bio: e.target.value }))}
        rows={5}
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
