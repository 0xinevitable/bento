import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useMemo, useState } from 'react';
import useCollapse from 'react-collapsed';

import { formatLocalizedString } from '@/utils/format';

import { ServiceData } from '@/defi/types/staking';
import { Colors } from '@/styles';

import { InlineBadge } from './InlineBadge';

type CollapsePanelProps = {
  service: ServiceData;
  children?: React.ReactNode;
  valuation: number;
  currentLanguage: string;
};

export const CollapsePanel: React.FC<CollapsePanelProps> = ({
  service,
  children,
  valuation,
  currentLanguage,
}) => {
  const count = useMemo(
    () => service.protocols.reduce((acc, v) => acc + v.accounts.length, 0),
    [service],
  );

  const { getCollapseProps, getToggleProps } = useCollapse({
    defaultExpanded: false,
  });

  const [isHeaderHovered, setHeaderHovered] = useState<boolean>(false);

  return (
    <Container className={isHeaderHovered ? 'header-hovered' : undefined}>
      <Header
        {...getToggleProps()}
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
        onPointerEnter={() => setHeaderHovered(true)}
        onPointerLeave={() => setHeaderHovered(false)}
      >
        <HeaderTitleRow>
          <ProtocolInfo>
            {!!service.logo ? (
              <ProtocolLogo alt="" src={service.logo} />
            ) : (
              <ProtocolLogoEmpty />
            )}
            <span>{formatLocalizedString(service.name, currentLanguage)}</span>
            {typeof count !== 'undefined' && (
              <span className="sys">
                <InlineBadge>{count.toLocaleString()}</InlineBadge>
              </span>
            )}
          </ProtocolInfo>

          <Valuation className="sys">
            {`$${valuation.toLocaleString(undefined, {
              maximumFractionDigits: 6,
            })}`}
          </Valuation>
        </HeaderTitleRow>
        <Paragraph className="sys">
          {formatLocalizedString(service?.description, currentLanguage)}
        </Paragraph>
      </Header>
      <Content {...getCollapseProps()}>{children}</Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  background: ${Colors.gray900};
  border: 1px solid ${Colors.gray800};
  border-radius: 8px;
  overflow: hidden;

  &.header-hovered {
    border: 1px solid ${Colors.gray700};
  }
`;

const Header = styled.div`
  padding: 16px 14px;

  display: flex;
  flex-direction: column;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${Colors.gray800};
  }
`;

const HeaderTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  font-size: 18px;
  font-weight: bold;
  color: ${Colors.gray100};
`;
const ProtocolInfo = styled.span`
  display: flex;
  align-items: center;
`;

const logoStyles = css`
  margin-right: 8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
`;
const ProtocolLogo = styled.img`
  ${logoStyles}
  object-fit: cover;
`;
const ProtocolLogoEmpty = styled.div`
  ${logoStyles}
  background: ${Colors.gray500};
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
const Valuation = styled.span`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  font-weight: bold;
  color: ${Colors.gray050};
`;
