import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo, useState } from 'react';

export type TabProps<T extends string> = Omit<
  React.HTMLAttributes<HTMLUListElement>,
  'onChange'
> & {
  selected: T;
  onChange?: (tab: T) => void;
  items: T[];
  primaryColor?: string;
  shadowColor?: string;
};

const tabWidth = 128;

export const Tab = <T extends string>({
  selected,
  onChange,
  items,
  primaryColor = '#ffa927',
  shadowColor = 'rgba(255, 169, 39, 0.85)',
  ...containerProps
}: TabProps<T>) => {
  const { t } = useTranslation('dashboard');
  const tabIndex = useMemo(() => items.indexOf(selected), [items, selected]);
  const [left, setLeft] = useState<number>(0);

  useEffect(() => setLeft(tabIndex * tabWidth), [tabIndex]);

  return (
    <Container {...containerProps}>
      {items.map((item, index) => {
        const isTabDisabled = onChange === undefined;

        return (
          <TabItem
            id={item}
            key={`tab-${index}`}
            selected={selected === item}
            disabled={isTabDisabled}
            onClick={() => onChange?.(item)}
            primaryColor={primaryColor}
          >
            <TabItemText>{t(item)}</TabItemText>
          </TabItem>
        );
      })}
      <TabIndicator
        primaryColor={primaryColor}
        shadowColor={shadowColor}
        style={{ left }}
      />
      <TabBottomBorder />
    </Container>
  );
};

const Container = styled.ul`
  margin: 0 auto 8px;
  padding: 0;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  position: relative;
`;

type TabItemProps = {
  selected: boolean;
  disabled: boolean;
  primaryColor: string;
};
const TabItem = styled.li<TabItemProps>`
  padding: 8px 0 12px;
  width: 128px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  ${({ selected, primaryColor }) =>
    selected &&
    css`
      & > span {
        color: ${primaryColor};
      }
    `};

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: default;
    `};
`;
const TabItemText = styled.span`
  color: rgba(255, 255, 255, 0.45);
  font-weight: 600;
  font-size: 18px;
  transition: color 0.2s ease-in-out;
  user-select: none;
`;

type TabIndicatorProps = {
  primaryColor: string;
  shadowColor: string;
};
const TabIndicator = styled.div<TabIndicatorProps>`
  height: 4px;
  width: ${tabWidth}px;
  position: absolute;
  bottom: 0;
  border-radius: 2px;
  transition: all 0.2s ease-in-out;

  ${({ primaryColor, shadowColor }) => css`
    background-color: ${primaryColor};
    box-shadow: 0 4px 12px ${shadowColor};
  `};
`;

const TabBottomBorder = styled.div`
  width: 100vw;
  max-width: 576px;
  height: 1px;
  position: absolute;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
`;
