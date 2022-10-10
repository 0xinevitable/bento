import useCollapse from 'react-collapsed';
import styled from 'styled-components';

import { Colors } from '@/styles';

type CollapsePanelProps = {
  title: string;
  children?: React.ReactNode;
};

export const CollapsePanel: React.FC<CollapsePanelProps> = ({
  title,
  children,
}) => {
  const { getCollapseProps, getToggleProps } = useCollapse({
    defaultExpanded: true,
  });

  return (
    <Container>
      <Header {...getToggleProps()}>{title}</Header>
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
  color: ${Colors.gray100};
  display: flex;
  font-size: 18px;
  font-weight: bold;
  padding: 16px 14px;
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
