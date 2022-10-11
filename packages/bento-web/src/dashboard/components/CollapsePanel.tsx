import useCollapse from 'react-collapsed';
import styled from 'styled-components';

import { Metadata } from '@/defi/klaytn/constants/metadata';
import { Colors } from '@/styles';

import { InlineBadge } from './InlineBadge';

type CollapsePanelProps = {
  title: string;
  metadata: Metadata | undefined;
  count?: number;
  children?: React.ReactNode;
  currentLanguage: string;
};

export const CollapsePanel: React.FC<CollapsePanelProps> = ({
  title,
  metadata,
  count,
  children,
  currentLanguage,
}) => {
  const lang = currentLanguage === 'ko' ? 'ko' : 'en';
  const { getCollapseProps, getToggleProps } = useCollapse({
    defaultExpanded: true,
  });

  return (
    <Container>
      <Header {...getToggleProps()}>
        <HeaderTitleRow>
          <ProtocolLogo alt={title} src={metadata?.logo} />
          <span>{title}</span>
          {typeof count !== 'undefined' && (
            <InlineBadge>{count.toLocaleString()}</InlineBadge>
          )}
        </HeaderTitleRow>
        <Paragraph>{metadata?.description[lang]}</Paragraph>
      </Header>
      <Content {...getCollapseProps()}>{children}</Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  background: ${Colors.gray800};
  border: 1px solid ${Colors.gray600};
  border-radius: 8px;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 16px 14px;

  display: flex;
  flex-direction: column;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${Colors.gray700};
  }
`;

const HeaderTitleRow = styled.div`
  display: flex;
  align-items: center;

  font-size: 18px;
  font-weight: bold;
  color: ${Colors.gray100};
`;
const ProtocolLogo = styled.img`
  margin-right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;
const Paragraph = styled.p`
  margin-top: 8px;
  font-size: 14px;
  color: ${Colors.gray400};
  line-height: 1.2;
`;

const Content = styled.div`
  padding: 8px 8px 12px;
  border-top: 1px solid ${Colors.gray600};

  & > ul {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
`;
