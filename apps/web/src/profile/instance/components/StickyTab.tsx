import styled from '@emotion/styled';
import React, { useCallback, useRef } from 'react';

import { Tab, TabProps } from '../../components/Tab';

export const StickyTab = <T extends string>(props: TabProps<T>) => {
  const tabOverflowRef = useRef<HTMLDivElement>(null);

  const onChange = useCallback((changedTab: T) => {
    props.onChange?.(changedTab);
    const tab = document.getElementById(changedTab);
    if (tab) {
      tab.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  return (
    <StickyContainer>
      <TabOverflow ref={tabOverflowRef}>
        <TabBackground>
          <Tab {...props} onChange={onChange} />
        </TabBackground>
      </TabOverflow>
    </StickyContainer>
  );
};

const StickyContainer = styled.div`
  width: 100%;
  overflow: visible;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
  margin-bottom: -18px;
  pointer-events: none;
`;

const TabOverflow = styled.div`
  width: 100%;
  overflow-x: auto;
  padding-bottom: 18px;
  pointer-events: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;
const TabBackground = styled.div`
  padding-top: 16px;
  background-color: black;
`;
