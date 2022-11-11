import { Wallet } from '@bento/common';
import { useEffect, useMemo, useState } from 'react';

import { useCachedPricings } from '@/hooks/pricings';

import {
  BentoDeFiSupportedNetworks,
  BentoSupportedNetwork,
} from '@/constants/adapters';
import { ProtocolResponse, ServiceData } from '@/defi/types/staking';
import { getDeFiStakingValue } from '@/defi/utils/getDeFiStakingValue';

import { useMultipleRequests } from './useMultipleRequests';

export const useProtocols = (wallets: Wallet[]) => {
  const calculatedRequests = useMemo(
    () =>
      wallets.reduce<string[]>(
        (acc, wallet) => [
          ...acc,
          ...wallet.networks.flatMap((network) =>
            !BentoDeFiSupportedNetworks.includes(
              network as BentoSupportedNetwork,
            )
              ? []
              : `/api/protocols/${network}/${wallet.address}`,
          ),
        ],
        [],
      ),
    [JSON.stringify(wallets)],
  );

  // TODO: Implement refetch rule
  const { responses, refetch } =
    useMultipleRequests<ProtocolResponse>(calculatedRequests);
  const { getCachedPrice } = useCachedPricings();

  const [defis, setDefis] = useState<ServiceData[]>([]);

  useEffect(() => {
    let allServices: ServiceData[] = [];

    responses.forEach((response) => {
      if (!response.data) {
        return;
      }
      const services = response.data.map((service) => {
        let protocols = service.protocols.map((protocol) => {
          let accounts = protocol.accounts.map((accountInfo) => {
            return {
              ...accountInfo,
              account: accountInfo.account,
              valuation: getDeFiStakingValue(accountInfo, getCachedPrice),
            };
          });

          accounts = accounts.sort(
            (a, b) => b.valuation.total - a.valuation.total,
          );

          return {
            ...protocol,
            accounts,
            netWorth: accounts.reduce(
              (acc, account) => acc + account.valuation.total,
              0,
            ),
          };
        });

        protocols = protocols.sort((a, b) => b.netWorth - a.netWorth);

        return {
          ...service,
          protocols,
          netWorth: protocols.reduce(
            (acc, protocol) => acc + protocol.netWorth,
            0,
          ),
        };
      });

      services.forEach((service) => {
        const existingService = allServices.find(
          (s) => s.serviceId === service.serviceId,
        );

        if (!existingService) {
          allServices.push(service);
          return;
        }

        existingService.protocols = existingService.protocols.concat(
          service.protocols,
        );
        existingService.netWorth += service.netWorth;
      });
    });

    allServices = allServices.sort((a, b) => b.netWorth - a.netWorth);
    setDefis(allServices);
  }, [responses, getCachedPrice]);

  return { defis };
};
