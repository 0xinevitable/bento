import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Badge } from '@geist-ui/core';
import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import useCollapse from 'react-collapsed';

import { formatLocalizedString } from '@/utils/format';

import { ServiceData } from '@/defi/types/staking';
import { Colors } from '@/styles';

import { LogoWithChain } from '../common/LogoWithChain';

type DeFiProtocolItemProps = {
  service: ServiceData;
  children?: React.ReactNode;
  valuation: number;
  currentLanguage: string;
};

export const DeFiProtocolItem: React.FC<DeFiProtocolItemProps> = ({
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
        <LogoWithChain logo={service.logo} chain={service.chain} />

        <ProtocolInfo>
          <ProtocolInfoRow>
            <span>{formatLocalizedString(service.name, currentLanguage)}</span>
            {typeof count !== 'undefined' && (
              <span className="sys">
                <Badge
                  scale={0.7}
                  type="secondary"
                  style={{
                    display: 'flex',
                    marginLeft: 4,
                    gap: 2,
                    backgroundColor: Colors.gray600,
                  }}
                >
                  <Icon icon="ant-design:bank-twotone" />
                  {count.toLocaleString()}
                </Badge>
              </span>
            )}
          </ProtocolInfoRow>

          <Valuation className="sys">
            {`$${valuation.toLocaleString(undefined, {
              maximumFractionDigits: 6,
            })}`}
          </Valuation>
        </ProtocolInfo>

        {/* <Paragraph className="sys">
          {formatLocalizedString(service?.description, currentLanguage)}
        </Paragraph> */}
      </Header>
      <Content {...getCollapseProps()}>{children}</Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;

  background: ${Colors.gray900};
  border: 1px solid ${Colors.gray800};
  border-radius: 8px;
  overflow: hidden;

  width: calc((100% - 8px) / 3);

  @media (max-width: 1100px) {
    width: calc((100% - 4px) / 2);
  }

  @media (max-width: 880px) {
    width: calc((100% - 8px) / 3);
  }

  @media (max-width: 720px) {
    width: calc((100% - 8px) / 2);
  }

  @media (max-width: 540px) {
    width: 100%;
  }

  &.header-hovered {
    border: 1px solid ${Colors.gray700};
  }
`;

const Header = styled.div`
  padding: 10px;

  display: flex;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${Colors.gray800};
  }
`;

const ProtocolInfo = styled.span`
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
const ProtocolInfoRow = styled.span`
  display: flex;
  align-items: center;

  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${Colors.gray400};
`;

const LogoContainer = styled.div`
  padding: 1px;
  width: 44px;
  height: 44px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  background-color: #aaaaaa;
  background-image: radial-gradient(
    96.62% 96.62% at 10.25% 1.96%,
    #aaaaaa 0%,
    #282c30 37.71%,
    #787d83 100%
  );
`;
const LogoBackground = styled.div`
  background: ${Colors.black};
  width: 100%;
  height: 100%;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
`;
const logoStyles = css`
  width: 34px;
  height: 34px;
  border-radius: 50%;
`;
const Logo = styled.img`
  ${logoStyles}
  object-fit: cover;
`;
const LogoEmpty = styled.div`
  ${logoStyles}
`;

const PlatformBadge = styled.img`
  position: absolute;
  left: -10px;
  bottom: -10px;

  width: 24px;
  height: 24px;
  border-radius: 50%;
  box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.44);
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
  font-size: 18px;
  line-height: 28px;
  font-weight: bold;
  color: ${Colors.gray050};
`;
