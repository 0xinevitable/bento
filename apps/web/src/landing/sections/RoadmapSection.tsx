import styled from '@emotion/styled';

import { TrackedSection, TrackedSectionOptions } from '@/components/system';

import { Colors } from '@/styles';

import { SectionBadge } from '../components/SectionBadge';
import { SectionTitle } from '../components/SectionTitle';

export const RoadmapSection: React.FC<TrackedSectionOptions> = ({
  ...trackedSectionOptions
}) => {
  return (
    <Wrapper>
      <SectionContainer>
        <Section {...trackedSectionOptions}>
          <Information>
            <SectionBadge>Near Future</SectionBadge>
            <SectionTitle>Roadmap</SectionTitle>
          </Information>

          <RoadmapList>
            <RoadmapItem>
              <RoadmapTitle>User Profiles</RoadmapTitle>
              <RoadmapDate>2022.08</RoadmapDate>
            </RoadmapItem>
            <RoadmapItem>
              <RoadmapTitle>Archivements Beta</RoadmapTitle>
              <RoadmapDate>2022.08</RoadmapDate>
            </RoadmapItem>
            <RoadmapItem>
              <RoadmapTitle>Anon Login</RoadmapTitle>
              <RoadmapDate>2022.08</RoadmapDate>
            </RoadmapItem>
            <RoadmapItem>
              <RoadmapTitle>Support for Optimism/Evmos</RoadmapTitle>
              <RoadmapDate>~2022.09</RoadmapDate>
            </RoadmapItem>
            <RoadmapItem>
              <RoadmapTitle>
                Dashboard V2 with Improved Reliability
                <br />
                <small>(API Refactoring, Edge Proxies, Data Caching...)</small>
              </RoadmapTitle>
              <RoadmapDate>2022.09</RoadmapDate>
            </RoadmapItem>
            <RoadmapItem>
              <RoadmapTitle>
                Support major Ethereum DeFis
                <br />
                <small>(MakerDAO, Lido, Uniswap, Curve, Aave, Sushi...)</small>
              </RoadmapTitle>
              <RoadmapDate>2022.09</RoadmapDate>
            </RoadmapItem>
            <RoadmapItem>
              <RoadmapTitle>Automation of Archivement Generation</RoadmapTitle>
              <RoadmapDate>2022.09</RoadmapDate>
            </RoadmapItem>
            <RoadmapItem>
              <RoadmapTitle>Support Osmosis LP Pools</RoadmapTitle>
              <RoadmapDate>2022.10</RoadmapDate>
            </RoadmapItem>
            <RoadmapItem>
              <RoadmapTitle>
                Dashboard V3
                <br />
                <small>(Improved UI/UX, Staking Interface...)</small>
              </RoadmapTitle>
              <RoadmapDate>2022.10</RoadmapDate>
            </RoadmapItem>
            <RoadmapItem>
              <RoadmapTitle>Identity API Beta</RoadmapTitle>
              <RoadmapDate>2022.10</RoadmapDate>
            </RoadmapItem>
            <RoadmapItem>
              <RoadmapTitle>Devnet Release</RoadmapTitle>
              <RoadmapDate>~2022 Q4</RoadmapDate>
            </RoadmapItem>
          </RoadmapList>
        </Section>
      </SectionContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: -100px;
  padding-top: 200px;

  width: 100%;
  display: flex;

  position: relative;

  &:before {
    content: '';
    width: 100%;
    height: 200px;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    background-image: linear-gradient(
      to top,
      ${Colors.gray900},
      rgba(0, 0, 0, 0)
    );
  }
`;
const SectionContainer = styled.div`
  padding: 0 20px;
  width: 100%;

  display: flex;
  background-color: ${Colors.gray900};
`;
const Section = styled(TrackedSection)`
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
  position: relative;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
`;

const RoadmapList = styled.ul`
  margin-top: 40px;
  margin-left: 20px;
  padding-left: 32px;
  position: relative;

  &:before {
    content: '';
    left: 0;
    position: absolute;
    width: 2px;
    height: 100%;
    background-color: #ffffff;
    border-radius: 1px;
  }
`;
const RoadmapItem = styled.li`
  padding: 10px 0;
  position: relative;

  &:not(:last-of-type) {
    margin-bottom: 20px;
  }

  &:before {
    content: '';
    left: ${-32 - 9}px;
    top: 18px;
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 4px solid white;
    background-color: black;
  }

  @media (max-width: 840px) {
    &:before {
      top: 12px;
    }
  }
`;
const RoadmapTitle = styled.h3`
  color: white;
  font-weight: bold;
  font-size: 24px;

  @media (max-width: 840px) {
    font-size: 18px;
  }
`;
const RoadmapDate = styled.span`
  color: rgba(255, 255, 255, 0.65);
  font-weight: bold;
  font-size: 18px;

  @media (max-width: 840px) {
    font-size: 16px;
  }
`;
