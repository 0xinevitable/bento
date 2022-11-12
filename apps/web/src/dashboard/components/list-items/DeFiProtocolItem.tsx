import styled from '@emotion/styled';
import { Icon } from '@iconify/react';
import { useMemo } from 'react';
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

  return (
    <Container>
      <LogoWithChain logo={service.logo} chain={service.chain} />

      <div className="info">
        <span className="name-row">
          <span className="truncate">
            {formatLocalizedString(service.name, currentLanguage)}
          </span>
          {typeof count !== 'undefined' && (
            <Badge>
              <Icon icon="ant-design:bank-twotone" />
              {count.toLocaleString()}
            </Badge>
          )}
        </span>

        <span className="valuation sys">
          {`$${valuation.toLocaleString(undefined, {
            maximumFractionDigits: 6,
          })}`}
        </span>
      </div>

      {/* <Paragraph className="sys">
          {formatLocalizedString(service?.description, currentLanguage)}
        </Paragraph> */}

      {/* TODO: Move to external modal */}
      <Content {...getCollapseProps()}>{children}</Content>
    </Container>
  );
};

const Content = styled.div`
  padding: 8px 8px 12px;
  border-top: 1px solid ${Colors.gray600};

  & > ul {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
`;
