import styled from 'styled-components';

import { SectionBadge } from '../components/SectionBadge';
import { SectionTitle } from '../components/SectionTitle';

export const RoadmapSection: React.FC = () => {
  return (
    <Wrapper>
      <SectionContainer>
        <Section>
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
              <RoadmapTitle>API Refactoring</RoadmapTitle>
              <RoadmapDate>2022.09</RoadmapDate>
            </RoadmapItem>
            <RoadmapItem>
              <RoadmapTitle>Identity API Beta</RoadmapTitle>
              <RoadmapDate>2022.09</RoadmapDate>
            </RoadmapItem>
            <RoadmapItem>
              <RoadmapTitle>Automation of Archivement Generation</RoadmapTitle>
              <RoadmapDate>2022.09</RoadmapDate>
            </RoadmapItem>
            <RoadmapItem>
              <RoadmapTitle>Devnet Release</RoadmapTitle>
              <RoadmapDate>2022 Q4</RoadmapDate>
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

    background-image: linear-gradient(to top, black, rgba(0, 0, 0, 0));
  }
`;
const SectionContainer = styled.div`
  padding: 0 20px;
  width: 100%;

  display: flex;
  background-color: black;
`;
const Section = styled.section`
  margin: 0 auto;
  max-width: 1180px;
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
`;
const RoadmapTitle = styled.h3`
  color: white;
  font-weight: bold;
  font-size: 24px;
`;
const RoadmapDate = styled.span`
  color: rgba(255, 255, 255, 0.65);
  font-weight: bold;
  font-size: 18px;
`;
