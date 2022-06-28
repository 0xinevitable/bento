import styled from 'styled-components';

import { NavigationBar } from '@/components/NavigationBar';

import { BackgroundSection } from './sections/BackgroundSection';
import { DashboardSection } from './sections/DashboardSection';
import { HeaderSection } from './sections/HeaderSection';
import { WalletSection } from './sections/WalletSection';

const LandingPage = () => {
  return (
    <Container>
      <NavigationBar />
      <HeaderSection />
      <BackgroundSection />
      <DashboardSection />
      <WalletSection />

      <Footer>
        <a title="INEVITABLE" href="https://inevitable.team" target="_blank">
          2022 INEVITABLE
        </a>
      </Footer>
    </Container>
  );
};

export default LandingPage;

const Container = styled.div`
  padding-bottom: 100px;

  display: flex;
  flex-direction: column;
  background-color: black;
`;

const Footer = styled.footer`
  margin-top: 120px;
  margin-bottom: 160px;

  font-family: 'Poppins';
  font-weight: 700;
  font-size: 24px;
  line-height: 120%;
  text-align: center;
  color: rgba(221, 204, 211, 0.88);

  & > a {
    color: unset;
  }
`;
