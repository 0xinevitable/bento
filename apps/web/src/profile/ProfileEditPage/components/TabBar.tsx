import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

const tabs = [
  { selector: '#profile', name: '프로필 정보' },
  { selector: '#links', name: '링크 목록' },
];

type TabBarProps = {
  onClick: () => void;
};

export const TabBar: React.FC<TabBarProps> = ({ onClick, ...props }) => {
  const [currentTab, setCurrentTab] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (window.location.hash) {
      setCurrentTab(window.location.hash);
      return;
    }
    setCurrentTab(tabs[0].selector);
  }, []);

  const moveToSelector = (selector: string) => {
    document.querySelector(selector)?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <Container>
      {/* <TabList>
        {tabs.map(({ selector, name }) => (
          <Tab
            key={selector}
            isCurrentTab={selector === currentTab}
            onClick={() => {
              setCurrentTab(selector);
              moveToSelector(selector);
            }}
          >
            {name}
          </Tab>
        ))}
      </TabList>
      <button onClick={onClick}>submit</button> */}
    </Container>
  );
};

const Container = styled.nav`
  display: flex;
  width: 100%;
  background-color: #202529;
  border-bottom: 1px solid #464f55;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.45);
`;

const TabList = styled.ul`
  margin: 0;
  padding: 12px 24px;
  display: flex;
  user-select: none;
`;

type TabProps = {
  isCurrentTab?: boolean;
};
const Tab = styled.div<TabProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 12px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);
  font-size: 18px;
  border-radius: 8px;
  font-weight: bold;
  text-shadow: 0 8px 16px rgba(0, 0, 0, 0.45);
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:not(:first-of-type) {
    margin-left: 8px;
  }

  ${({ isCurrentTab }) =>
    isCurrentTab &&
    css`
      color: rgba(255, 255, 255, 1);
    `};
`;
