import styled from 'styled-components';

import { Badge } from '@/components/Badge';

export const RoadmapSection: React.FC = () => {
  return (
    <Wrapper>
      <SectionContainer>
        <Section>
          <Information>
            <Badge>Near Future</Badge>
            <Title>Roadmap</Title>
          </Information>
        </Section>
      </SectionContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
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

    background-image: linear-gradient(to top, black, rgba(255, 255, 255, 0));
  }
`;
const SectionContainer = styled.div`
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
const Title = styled.h2`
  margin-top: 27px;

  font-weight: 900;
  font-size: 52px;
  line-height: 103%;
  letter-spacing: 0.01em;
  color: #ffffff;
`;
