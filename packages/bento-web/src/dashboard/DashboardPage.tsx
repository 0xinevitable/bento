import { Icon } from '@iconify/react';
import groupBy from 'lodash.groupby';
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { AnimatedTooltip } from '@/components/AnimatedToolTip';
import { Badge } from '@/components/Badge';
import { NoSSR } from '@/components/NoSSR';
import { PageContainer } from '@/components/PageContainer';
import { walletsAtom } from '@/recoil/wallets';

import { AddWalletModal, NETWORKS } from './components/AddWalletModal';
import { AssetRatioChart } from './components/AssetRatioChart';
import { AssetRatioListItem } from './components/AssetRatioListItem';
import { TokenBalanceItem } from './components/TokenBalanceItem';
import { WalletList } from './components/WalletList';
import { displayName } from './constants/platform';
import { WalletBalance } from './types/balance';
import { useNFTBalances } from './utils/useNFTBalances';
import { useWalletBalances } from './utils/useWalletBalances';

const walletBalanceReducer =
  (symbol: string, callback: (acc: number, balance: WalletBalance) => number) =>
  (acc: number, balance: WalletBalance) =>
    balance.symbol === symbol ? callback(acc, balance) : acc;

const DashboardPage = () => {
  const wallets = useRecoilValue(walletsAtom);
  const { balances: walletBalances } = useWalletBalances({ wallets });
  const { balances: NFTBalances } = useNFTBalances({ wallets });

  const tokenBalances = useMemo(() => {
    // NOTE: `balance.symbol + balance.name` 로 키를 만들어 groupBy 하고, 그 결과만 남긴다.
    // TODO: 추후 `tokenAddress` 로만 그룹핑 해야 할 것 같다(같은 심볼과 이름을 사용하는 토큰이 여러개 있을 수 있기 때문).
    const balancesByPlatform = Object.entries(
      groupBy<WalletBalance>(
        [...walletBalances, ...NFTBalances],
        (balance) => balance.symbol + balance.name,
      ),
    ).map((v) => v[1]);

    const tokens = balancesByPlatform
      .map((balances) => {
        // NOTE: balances 는 모두 같은 토큰의 정보를 담고 있기에, first 에서만 정보를 꺼내온다.
        const [first] = balances;

        const amount = balances.reduce(
          walletBalanceReducer(
            first.symbol,
            (acc, balance) =>
              acc +
              balance.balance +
              ('delegations' in balance ? balance.delegations : 0),
          ),
          0,
        );

        return {
          platform: first.platform,
          symbol: first.symbol,
          name: first.name,
          logo: first.logo,
          type: 'type' in first ? first.type : undefined,
          tokenAddress: 'address' in first ? first.address : undefined,
          balances: balances,
          netWorth: amount * first.price,
          amount,
          price: first.price,
        };
      })
      .flat();

    tokens.sort((a, b) => b.netWorth - a.netWorth);
    return tokens.filter((v) => v.netWorth > 0);
  }, [walletBalances, NFTBalances]);

  const netWorthInUSD = useMemo(
    () => tokenBalances.reduce((acc, info) => acc + info.netWorth, 0),
    [tokenBalances],
  );

  const assetRatioByPlatform = useMemo(() => {
    const groups = groupBy(tokenBalances, 'platform');
    return Object.entries(groups).map(([platform, assets]) => {
      const netWorth = assets.reduce((acc, info) => acc + info.netWorth, 0);
      return {
        platform,
        netWorth,
        name: displayName(platform),
        ratio: (netWorth / netWorthInUSD) * 100,
      };
    });
  }, [netWorthInUSD]);

  const [isAddWalletModalVisible, setAddWalletModalVisible] =
    useState<boolean>(false);

  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  useEffect(() => setPageLoaded(true), []);

  const hasWallet = wallets.length > 0;

  return (
    <PageContainer className="pt-0 z-10">
      <TopLeftBlur src="/assets/blurs/top-left.png" />
      <TopRightBlur src="/assets/blurs/top-right.png" />

      {!pageLoaded ? null : !hasWallet ? (
        <React.Fragment>
          <div className="mt-[64px] flex flex-col items-center">
            <Badge>⚡ Bento.Finance</Badge>
            <h1 className="mt-4 text-white text-5xl font-black leading-[120%] text-center">
              Group Identity
              <br />
              From Web3 Finance
            </h1>

            <div className="mt-6 flex flex-col gap-2">
              <Button onClick={() => setAddWalletModalVisible((prev) => !prev)}>
                Connect Wallet
              </Button>
              <a
                title="About"
                className="mt-2 text-white/50 text-sm flex items-center gap-1 mx-auto"
                href="https://bento.finance"
                target="_blank"
              >
                <span className="leading-none mt-[1.5px]">About</span>
                <Icon icon="heroicons-solid:external-link" />
              </a>
            </div>
          </div>

          <ProtocolSection>
            <Subtitle>Your favorite chains and protocols</Subtitle>
            <ProtocolList>
              {NETWORKS.map((network) => (
                <li key={network.id}>
                  <AnimatedTooltip label={network.name}>
                    <img
                      className="cursor-pointer"
                      alt={network.name}
                      src={network.logo}
                    />
                  </AnimatedTooltip>
                </li>
              ))}
            </ProtocolList>
          </ProtocolSection>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="mt-6 flex w-full min-h-[345px] gap-6">
            <Card>
              <CardTitle>Net Worth</CardTitle>
              <span className="mt-2 text-3xl font-bold text-slate-50">{`$${netWorthInUSD.toLocaleString()}`}</span>
              <div className="w-full flex">
                <div className="w-1/2">
                  <AssetRatioChart
                    tokenBalances={tokenBalances}
                    netWorthInUSD={netWorthInUSD}
                  />
                </div>
                {assetRatioByPlatform.length && (
                  <AssetCardList className="w-1/2">
                    {assetRatioByPlatform.map((item) => (
                      <AssetRatioListItem key={item.platform} {...item} />
                    ))}
                  </AssetCardList>
                )}
              </div>
            </Card>
            <Card className="max-w-[400px]">
              <NoSSR>
                <React.Fragment>
                  <CardTitle>
                    Wallets
                    {wallets.length > 0 && (
                      <span className="ml-1 text-slate-50/80 text-[#88a9ca]">
                        {`(${wallets.length.toLocaleString()})`}
                      </span>
                    )}
                  </CardTitle>

                  {wallets.length > 0 && (
                    <WalletList
                      onClickConnect={() =>
                        setAddWalletModalVisible((prev) => !prev)
                      }
                    />
                  )}
                </React.Fragment>
              </NoSSR>
            </Card>
          </div>

          <Card className="mt-12" style={{ flex: 0 }}>
            <CardTitle>
              Assets
              {tokenBalances.length > 0 && (
                <span className="ml-1 text-slate-50/80 text-[#88a9ca]">
                  {`(${tokenBalances.length.toLocaleString()})`}
                </span>
              )}
            </CardTitle>
            {tokenBalances.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {tokenBalances.map((info) => (
                  <TokenBalanceItem
                    key={`${info.symbol}-${
                      'tokenAddress' in info ? info.tokenAddress : 'native'
                    }`}
                    {...info}
                  />
                ))}
              </ul>
            )}
          </Card>
        </React.Fragment>
      )}

      <AddWalletModal
        visible={isAddWalletModalVisible}
        onDismiss={() => setAddWalletModalVisible((prev) => !prev)}
      />
    </PageContainer>
  );
};

export default DashboardPage;

const TOP_LEFT_BLUR = 262.9;
const TopLeftBlur = styled.img`
  position: absolute;
  top: 360px;
  left: 63px;

  margin: ${-TOP_LEFT_BLUR}px;
  width: ${280.42 + TOP_LEFT_BLUR * 2}px;
  height: ${280.42 + TOP_LEFT_BLUR * 2}px;
  z-index: -1;
  user-select: none;
`;
const TOP_RIGHT_BLUR = 256;
const TopRightBlur = styled.img`
  position: absolute;
  top: -35px;
  right: 64.48px;

  margin: ${-TOP_RIGHT_BLUR}px;
  width: ${402 + TOP_RIGHT_BLUR * 2}px;
  height: ${47 + TOP_RIGHT_BLUR * 2}px;
  z-index: -1;
  user-select: none;
`;

const Card = styled.section`
  padding: 24px;
  background: rgba(30, 29, 34, 0.44);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  flex: 1;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1ㅌ), 0 2px 8px #191722;
`;
const CardTitle = styled.h2`
  margin: 0;
  margin-bottom: 8px;

  font-weight: 600;
  font-size: 18px;
  line-height: 100%;
  color: #ffffff;
`;

const AssetCardList = styled.ul`
  margin: 0;
  margin-left: 20px;
  padding: 10px 12px;
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  gap: 8px;

  background: #16181a;
  background: linear-gradient(145deg, #141617, #181a1c);
  border: 1px solid #2a2e31;
  box-shadow: inset 5px 5px 16px #0b0c0e, inset -5px -5px 16px #212426;
  border-radius: 8px;
`;

const Button = styled.button`
  padding: 20px 32px;
  /* width: 100%; */
  width: fit-content;
  /* max-width: 282px; */
  position: relative;

  border-radius: 8px;
  border: 1px solid rgba(255, 165, 165, 0.66);
  background: radial-gradient(98% 205% at 0% 0%, #74021a 0%, #c1124f 100%);
  filter: drop-shadow(0px 10px 32px rgba(151, 42, 53, 0.33));

  font-style: normal;
  font-weight: 700;
  font-size: 21.3946px;

  line-height: 100%;
  text-align: center;
  letter-spacing: -0.05em;

  /* color: rgba(255, 255, 255, 0.92); */
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0px 4px 12px rgba(101, 0, 12, 0.42);

  &:hover {
    border-color: rgba(255, 165, 165, 0.45);

    /* 85% opacity */
    background: radial-gradient(
      98% 205% at 0% 0%,
      rgba(116, 2, 27, 0.85) 0%,
      rgba(193, 18, 79, 0.85) 100%
    );
  }
`;

const ProtocolSection = styled.section`
  margin-top: 86px;
  margin-bottom: 100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Subtitle = styled.h2`
  font-weight: 700;
  font-size: 18px;
  line-height: 103%;
  letter-spacing: 0.01em;
  color: #ffffff;
`;
const ProtocolList = styled.ul`
  margin-top: 24px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  img {
    width: 56px;
    height: 56px;

    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.05);
    user-select: none;
  }
`;
