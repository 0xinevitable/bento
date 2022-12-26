import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';

import { Colors } from '@/styles';

export type TabProps<T extends string> = {
  current: T;
  items: readonly T[];
  onChange: (value: T) => void;
};

export const Tab = <T extends string>({
  current,
  items,
  onChange,
}: TabProps<T>) => {
  const { t } = useTranslation('dashboard');
  return (
    <Container>
      {items.map((item) => {
        const isSelected = current === item;
        return (
          <TabItem
            key={item}
            selected={isSelected}
            onClick={() => onChange(item)}
          >
            {t(item)}
          </TabItem>
        );
      })}
    </Container>
  );
};
const Container = styled.div`
  display: flex;
`;

export type TabItemProps = {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
};
export const TabItem: React.FC<TabItemProps> = ({
  children,
  selected,
  onClick,
}) => {
  return (
    <TabItemContainer className={selected ? 'selected' : undefined}>
      <Button onClick={onClick}>{children}</Button>
      <Indicator className="indicator" />
    </TabItemContainer>
  );
};

const TabItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  &.selected {
    button {
      background: conic-gradient(
        from 181.79deg at 50% 50.01%,
        rgba(0, 0, 0, 0) 0deg,
        #3e3e3e 179.43deg,
        rgba(0, 0, 0, 0) 360deg
      );
      color: ${Colors.gray000};
    }

    .indicator {
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        #ffffff 48.3%,
        rgba(255, 255, 255, 0) 100%
      );
    }
  }

  &:not(.selected):hover {
    button {
      background: ${Colors.gray800};
      color: ${Colors.gray200};
    }
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;

  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  text-align: center;
  color: ${Colors.gray400};
  transition: all 0.2s ease-in-out;
`;

const Indicator = styled.div`
  width: 100%;
  height: 2px;

  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 48.3%,
    rgba(255, 255, 255, 0) 100%
  );
  border-radius: 2px;

  transition: all 0.2s ease-in-out;
`;
