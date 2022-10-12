import useCollapse from 'react-collapsed';
import styled from 'styled-components';

import { Colors } from '@/styles';

import { InlineBadge } from './InlineBadge';

type CollapsePanelProps = {
  title: string;
  count?: number;
  children?: React.ReactNode;
};

export const CollapsePanel: React.FC<CollapsePanelProps> = ({
  title,
  count,
  children,
}) => {
  const { getCollapseProps, getToggleProps } = useCollapse({
    defaultExpanded: true,
  });

  return (
    <Container>
      <Header {...getToggleProps()}>
        <span>{title}</span>
        {typeof count !== 'undefined' && (
          <InlineBadge>{count.toLocaleString()}</InlineBadge>
        )}
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
`;

const Header = styled.button`
  padding: 16px 14px;

  display: flex;
  align-items: center;
  gap: 2px;

  font-size: 18px;
  font-weight: bold;
  color: ${Colors.gray100};
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
