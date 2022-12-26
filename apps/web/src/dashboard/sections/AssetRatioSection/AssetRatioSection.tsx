import styled from '@emotion/styled';
import groupBy from 'lodash.groupby';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useMemo } from 'react';

import { AnimatedToolTip } from '@/components/system';

import { NETWORKS } from '@/constants/networks';
import bitcoinImage from '@/dashboard/assets/bitcoin-v2.png';
import { Breakpoints } from '@/dashboard/constants/breakpoints';
import { displayName } from '@/dashboard/constants/platform';
import { DashboardTokenBalance } from '@/dashboard/types/TokenBalance';
import { ServiceData } from '@/defi/types/staking';
import { Colors } from '@/styles';

import { AssetRatioChart } from './AssetRatioChart';

type AssetRatioSectionProps = {
  netWorthInWallet: number;
  netWorthInProtocols: number;
  tokenBalances: DashboardTokenBalance[];
  services: ServiceData[];
};
export const AssetRatioSection: React.FC<AssetRatioSectionProps> = ({
  tokenBalances,
  netWorthInWallet,
  netWorthInProtocols,
  services,
}) => {
  const { t } = useTranslation('dashboard');

  const netWorthInUSD = useMemo(
    () => netWorthInWallet + netWorthInProtocols,
    [netWorthInWallet, netWorthInProtocols],
  );

  const [summary, assetRatioByPlatform] = useMemo(() => {
    const groups = groupBy(tokenBalances, 'platform');

    let items = NETWORKS.map(({ id: platform }) => {
      const assets = groups[platform] || [];
      let netWorth = assets.reduce((acc, info) => acc + info.netWorth, 0);

      services.forEach((service) => {
        if (service.chain === platform) {
          netWorth += service.netWorth;
        }
      });

      let ratio = (netWorth / netWorthInUSD) * 100;
      if (isNaN(ratio)) {
        ratio = 0;
      }

      return {
        platform,
        netWorth,
        name: displayName(platform),
        ratio,
      };
    });

    items = items.sort((a, b) => b.ratio - a.ratio);
    return [items.slice(0, 3), items];
  }, [netWorthInUSD, tokenBalances]);

  return (
    <Container>
      <Illust />
      <BitcoinIllust
        alt=""
        src={bitcoinImage}
        sizes="240px"
        placeholder="blur"
      />

      <Information>
        <Field>{t('Net Worth')}</Field>
        <Title>{`$${netWorthInUSD.toLocaleString()}`}</Title>
      </Information>

      <div>
        <AssetRatioChart
          tokenBalances={tokenBalances}
          totalNetWorth={netWorthInUSD}
          assetRatioByPlatform={assetRatioByPlatform}
        />
      </div>

      <BadgeList>
        {summary.map((item) => (
          <AnimatedToolTip
            key={item.platform}
            label={`$${item.netWorth.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}`}
          >
            <Badge style={{ cursor: 'pointer' }}>
              <img src={`/assets/icons/${item.platform}.png`} alt={item.name} />
              <span>
                {`${item.ratio.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}%`}
              </span>
            </Badge>
          </AnimatedToolTip>
        ))}
      </BadgeList>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 28px 24px;
  gap: 24px;
  flex: 1;
  z-index: 0;

  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  border-radius: 36px;
  background: linear-gradient(180deg, #14191e 0%, #0f1214 100%);

  @media (max-width: ${Breakpoints.Tablet}px) {
    max-width: 100%;
    width: 100%;
    flex: unset;
  }

  @media (max-width: ${Breakpoints.Mobile}px) {
    padding: 24px 20px;
  }

  @media (max-width: ${Breakpoints.Tiny}px) {
    padding: 20px 16px;
    border-radius: 28px;
  }
`;

const BitcoinIllust = styled(Image)`
  width: 120px;
  height: 120px;
  object-fit: contain;

  position: absolute;
  top: 32px;
  right: 20px;
  z-index: -1;

  @media (max-width: ${Breakpoints.Tiny}px) {
    display: none;
  }
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const Field = styled.span`
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  color: ${Colors.gray100};
`;
const Title = styled.h2`
  font-weight: 900;
  font-size: 48px;
  line-height: 100%;
  color: ${Colors.gray050};

  @media (max-width: ${Breakpoints.Mobile}px) {
    font-size: 32px;
    line-height: 120%;
  }

  @media (max-width: ${Breakpoints.Tiny}px) {
    font-size: 28px;
  }
`;

const BadgeList = styled.ul`
  display: flex;
  align-items: center;
  gap: 6px;
`;
const Badge = styled.li`
  padding: 6px 12px 6px 8px;
  gap: 6px;

  display: flex;
  flex-direction: row;
  align-items: center;

  border-radius: 30px;
  background: ${Colors.gray600};

  /* shadow-default */
  box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.18);

  & > img {
    width: 28px;
    height: 28px;
    border: 1px solid rgba(0, 0, 0, 0.25);
    border-radius: 50%;
    user-select: none;
  }

  & > span {
    font-weight: 700;
    font-size: 16px;
    line-height: 100%;
    text-align: center;
    color: ${Colors.gray100};
  }
`;

const Illust: React.FC = () => (
  <svg
    width="229"
    height="382"
    viewBox="0 0 229 382"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: 'absolute',
      top: 0,
      right: 0,
      filter: 'saturate(120%)',
      zIndex: -2,
    }}
  >
    <g clipPath="url(#clip0_199_1955)">
      <g filter="url(#filter0_d_199_1955)">
        <rect
          x="135"
          y="37"
          width="254"
          height="254"
          rx="127"
          fill="url(#paint0_radial_199_1955)"
          shapeRendering="crispEdges"
        />
        <rect
          x="136.814"
          y="38.8143"
          width="250.371"
          height="250.371"
          rx="125.186"
          stroke="url(#paint1_linear_199_1955)"
          strokeWidth="3.62857"
          shapeRendering="crispEdges"
        />
      </g>
      <g filter="url(#filter1_d_199_1955)">
        <rect
          x="213.022"
          y="-103"
          width="254"
          height="254"
          rx="127"
          transform="rotate(57 213.022 -103)"
          fill="url(#paint2_radial_199_1955)"
          shapeRendering="crispEdges"
        />
        <rect
          x="212.489"
          y="-100.49"
          width="250.371"
          height="250.371"
          rx="125.186"
          transform="rotate(57 212.489 -100.49)"
          stroke="url(#paint3_linear_199_1955)"
          strokeWidth="3.62857"
          shapeRendering="crispEdges"
        />
      </g>
      <g filter="url(#filter2_d_199_1955)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M407.578 174.735C380.153 132.84 329.221 109.461 277.033 119.605C208.182 132.988 163.216 199.653 176.599 268.504C183.635 304.698 205.394 334.292 234.454 352.278L236.324 349.167C208.113 331.693 186.992 302.955 180.161 267.812C167.16 200.928 210.841 136.168 277.725 123.167C325.614 113.858 372.413 133.607 399.905 170.125L407.578 174.735Z"
          fill="url(#paint4_linear_199_1955)"
          shapeRendering="crispEdges"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_199_1955"
        x="123"
        y="33"
        width="278"
        height="278"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="8" />
        <feGaussianBlur stdDeviation="6" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_199_1955"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_199_1955"
          result="shape"
        />
      </filter>
      <filter
        id="filter1_d_199_1955"
        x="36.6654"
        y="-58.3346"
        width="278.03"
        height="278.03"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="8" />
        <feGaussianBlur stdDeviation="6" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_199_1955"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_199_1955"
          result="shape"
        />
      </filter>
      <filter
        id="filter2_d_199_1955"
        x="162.242"
        y="113.248"
        width="257.335"
        height="259.03"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="8" />
        <feGaussianBlur stdDeviation="6" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_199_1955"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_199_1955"
          result="shape"
        />
      </filter>
      <radialGradient
        id="paint0_radial_199_1955"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(368 51) rotate(147.832) scale(261.079 359.639)"
      >
        <stop stopColor="#280807" />
        <stop offset="0.328125" stopColor="#280807" stopOpacity="0.666667" />
        <stop offset="1" stopColor="#280807" stopOpacity="0" />
      </radialGradient>
      <linearGradient
        id="paint1_linear_199_1955"
        x1="250"
        y1="37"
        x2="206.5"
        y2="297.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF3856" />
        <stop offset="0.651042" stopColor="#C60126" />
        <stop offset="1" stopColor="#8A283B" stopOpacity="0.27" />
      </linearGradient>
      <radialGradient
        id="paint2_radial_199_1955"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(446.022 -89) rotate(147.832) scale(261.079 359.639)"
      >
        <stop stopColor="#280807" />
        <stop offset="0.328125" stopColor="#280807" stopOpacity="0.666667" />
        <stop offset="1" stopColor="#280807" stopOpacity="0" />
      </radialGradient>
      <linearGradient
        id="paint3_linear_199_1955"
        x1="373.042"
        y1="-82.68"
        x2="223.32"
        y2="61.8181"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF3856" />
        <stop offset="0.447917" stopColor="#C60126" />
        <stop offset="0.765625" stopColor="#8A283B" stopOpacity="0.27" />
        <stop offset="1" stopColor="#8A283B" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint4_linear_199_1955"
        x1="236.5"
        y1="348"
        x2="177.461"
        y2="183.423"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF3856" />
        <stop offset="0.477161" stopColor="#C60126" />
        <stop offset="0.6114" stopColor="#9A1E35" />
        <stop offset="0.782341" stopColor="#8A283B" stopOpacity="0.53" />
        <stop offset="1" stopColor="#8A283B" stopOpacity="0" />
      </linearGradient>
      <clipPath id="clip0_199_1955">
        <rect
          width="414.089"
          height="484.612"
          fill="white"
          transform="translate(-1.52588e-05 -103)"
        />
      </clipPath>
    </defs>
  </svg>
);
