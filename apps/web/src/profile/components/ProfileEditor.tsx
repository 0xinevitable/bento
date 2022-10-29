import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';

import { Button } from '@/components/system';

import { FieldInput } from '../components/FieldInput';
import { FieldTextArea } from '../components/FieldTextArea';

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
  const { t } = useTranslation('dashboard');

  const onKeyDown = useCallback<
    React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>
  >(
    (e) => {
      if (e.key === 'Enter') {
        onSubmit();
      }
    },
    [onSubmit],
  );

  // FIXME: value as controlled (왜냐면 username 검증 실패시 리셋하는 로직이 있기 때문)

  return (
    <Container>
      <FieldInput
        field={t('Name')}
        placeholder="e.g., Junho Yeo"
        defaultValue={draft.displayName}
        onKeyDown={onKeyDown}
        onChange={(e) =>
          setDraft((v) => ({ ...v, displayName: e.target.value }))
        }
      />
      <FieldInput
        field={t('Username')}
        placeholder={t('username (will be shown after @)')}
        defaultValue={draft.username}
        onKeyDown={onKeyDown}
        onChange={(e) => setDraft((v) => ({ ...v, username: e.target.value }))}
      />
      <FieldTextArea
        field={t('Description')}
        placeholder="e.g., 19 y.o. Builder from Seoul"
        defaultValue={draft.bio}
        onKeyDown={onKeyDown}
        onChange={(e) => setDraft((v) => ({ ...v, bio: e.target.value }))}
        rows={5}
      />
      <SaveButton onClick={onSubmit}>{t('Save')}</SaveButton>
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
