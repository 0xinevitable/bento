import { Icon } from '@iconify/react';
import { useMemo } from 'react';

import { formatLocalizedString } from '@/utils/format';

import { ServiceData } from '@/defi/types/staking';

import { Badge } from './common/Badge';
import { Container } from './common/Container';
import { LogoWithChain } from './common/LogoWithChain';

type DeFiProtocolItemProps = {
  service: ServiceData;
  valuation: number;
  currentLanguage: string;
  onClick?: () => void;
};

export const DeFiProtocolItem: React.FC<DeFiProtocolItemProps> = ({
  service,
  valuation,
  currentLanguage,
  onClick,
}) => {
  const count = useMemo(
    () => service.protocols.reduce((acc, v) => acc + v.accounts.length, 0),
    [service],
  );

  return (
    <Container onClick={onClick}>
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
    </Container>
  );
};
