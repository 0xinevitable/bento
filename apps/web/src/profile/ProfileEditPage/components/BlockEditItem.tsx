import styled from '@emotion/styled';
import React from 'react';

import { LinkBlock } from '@/profile/blocks';
import { ShadowedImage } from '@/profile/components/ShadowedImage';

type Props = {
  defaultBlock?: LinkBlock;
  linkDraft: LinkBlock;
  onChange: (link: LinkBlock) => void;
  onDelete: () => void;
};

export const BlockEditItem: React.FC<Props> = ({
  defaultBlock,
  linkDraft,
  onChange,
  onDelete,
}) => {
  return (
    <Container>
      <button onClick={onDelete}>Delete</button>
      <LinkImageWrapper>
        <LinkImage src={defaultBlock?.images?.[0]} />
      </LinkImageWrapper>
      <Information>
        <BoldInput
          placeholder="이름"
          defaultValue={defaultBlock?.title ?? ''}
          onChange={(e) => onChange({ ...linkDraft, title: e.target.value })}
        />
        <Input
          placeholder="설명"
          defaultValue={defaultBlock?.description ?? ''}
          onChange={(e) =>
            onChange({ ...linkDraft, description: e.target.value })
          }
        />
        <Input
          placeholder="링크"
          defaultValue={defaultBlock?.url ?? ''}
          onChange={(e) => onChange({ ...linkDraft, url: e.target.value })}
        />
      </Information>
    </Container>
  );
};

const Container = styled.li`
  margin-top: 4px;
  margin-bottom: 12px;
  padding: 16px;
  background-color: #262b34;
  border-radius: 8px;
  display: flex;
`;

const LinkImageWrapper = styled.div`
  z-index: 9;
`;
const LinkImage = styled(ShadowedImage)`
  width: 86px;
  height: 86px;
`;

const Information = styled.div`
  flex: 1;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 9;
`;

const BoldInput = styled.input`
  margin: 0;
  padding: 12px 8px;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.2;
  letter-spacing: -0.3px;
  color: black;
  word-break: keep-all;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.25);
  color: rgba(255, 255, 255, 0.85);
`;

const Input = styled.input`
  margin: 0;
  padding: 12px 8px;
  margin-top: 8px;
  font-size: 20px;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: rgba(255, 255, 255, 0.85);
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.25);
`;
