import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import useCollapse from 'react-collapsed';

import { formatLocalizedString } from '@/utils/format';

import { ServiceData } from '@/defi/types/staking';
import { Colors } from '@/styles';

import { Badge } from './common/Badge';
import { Container } from './common/Container';
import { LogoWithChain } from './common/LogoWithChain';

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
      <LogoWithChain logo={service.logo} chain={service.chain} />

      <ProtocolInfo>
        <ProtocolInfoRow>
          <span>{formatLocalizedString(service.name, currentLanguage)}</span>
          {typeof count !== 'undefined' && (
            <Badge>
              <Icon icon="ant-design:bank-twotone" />
              {count.toLocaleString()}
            </Badge>
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

      {/* TODO: Move to external modal */}
      <Content {...getCollapseProps()}>{children}</Content>
    </Container>
  );
};

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
