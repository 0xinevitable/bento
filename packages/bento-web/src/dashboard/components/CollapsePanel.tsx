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
    defaultExpanded: false,
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
  gap: 4px;
  width: 100%;
`;

const Header = styled.button`
  color: ${Colors.gray100};
  display: flex;
  background: ${Colors.gray900};
  border: 1px solid ${Colors.gray800};
  border-radius: 8px;
  font-size: 22px;
`;
const Content = styled.div``;
