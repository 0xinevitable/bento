import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styled from 'styled-components';

import { MetaHead } from '@/components/system';

import { Colors } from '@/styles';
import { Analytics } from '@/utils';

import { BackgroundSection } from './sections/BackgroundSection';
import { DashboardSection } from './sections/DashboardSection';
import { Footer } from './sections/Footer';
import { FooterSection } from './sections/FooterSection';
import { HeaderSection } from './sections/HeaderSection';
import { IdentitySection } from './sections/IdentitySection';
// import { RoadmapSection } from './sections/RoadmapSection';
import { StatusQuoSection } from './sections/StatusQuoSection';
import { WalletSection } from './sections/WalletSection';

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['landing'])),
    },
  };
};

const LandingPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    Analytics.logEvent('view_landing', undefined);
  }, []);

  return (
    <Container>
      <MetaHead />

      <HeaderSection />

      <BackgroundSection
        id="dashboard-background"
        event="view_landing_section"
      />
      <DashboardSection id="dashboard" event="view_landing_section" />
      <WalletSection id="dashboard-wallets" event="view_landing_section" />

      <OurMissionContainer>
        <OurMissionTypography />
      </OurMissionContainer>

      <StatusQuoSection id="status-quo" event="view_landing_section" />
      <IdentitySection id="identity" event="view_landing_section" />

      <FooterSection id="footer" event="view_landing_section" />

      {/* <RoadmapSection id="roadmap" event="view_landing_section" /> */}

      <Footer />
    </Container>
  );
};

export default LandingPage;

const Container = styled.div`
  width: 100vw;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  section * {
    &:not(h1, h1 span) {
      transition: all 0.2s ease-in-out;
    }
  }

  & img {
    user-select: none;
  }
`;

const OurMissionContainer = styled.div`
  width: 100%;
  padding: 40px 0;
  background-color: ${Colors.brand500};

  display: flex;
  justify-content: center;
  align-items: center;
`;
const OurMissionTypography: React.FC = () => (
  <svg
    width="284"
    height="64"
    viewBox="0 0 284 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M97.8451 8.466C98.6131 8.646 99.2071 9.018 99.6271 9.582C100.059 10.134 100.275 10.776 100.275 11.508C100.275 12.624 99.9031 13.488 99.1591 14.1C98.4271 14.7 97.3711 15 95.9911 15H89.3131V2.256H95.8111C97.1071 2.256 98.1271 2.538 98.8711 3.102C99.6151 3.666 99.9871 4.488 99.9871 5.568C99.9871 6.312 99.7891 6.942 99.3931 7.458C99.0091 7.962 98.4931 8.298 97.8451 8.466ZM93.3091 7.224H94.8571C95.2171 7.224 95.4811 7.152 95.6491 7.008C95.8291 6.864 95.9191 6.642 95.9191 6.342C95.9191 6.03 95.8291 5.802 95.6491 5.658C95.4811 5.502 95.2171 5.424 94.8571 5.424H93.3091V7.224ZM95.1271 11.796C95.4871 11.796 95.7511 11.73 95.9191 11.598C96.0991 11.454 96.1891 11.226 96.1891 10.914C96.1891 10.302 95.8351 9.996 95.1271 9.996H93.3091V11.796H95.1271ZM105.614 5.442V7.008H109.574V10.014H105.614V11.814H110.114V15H101.618V2.256H110.114V5.442H105.614ZM123.842 15H119.846L115.616 8.592V15H111.62V2.256H115.616L119.846 8.772V2.256H123.842V15ZM135.655 2.256V5.424H132.271V15H128.275V5.424H124.927V2.256H135.655ZM142.949 15.126C141.749 15.126 140.645 14.844 139.637 14.28C138.641 13.716 137.849 12.936 137.261 11.94C136.673 10.944 136.379 9.822 136.379 8.574C136.379 7.326 136.673 6.204 137.261 5.208C137.849 4.212 138.641 3.438 139.637 2.886C140.645 2.322 141.749 2.04 142.949 2.04C144.149 2.04 145.247 2.322 146.243 2.886C147.239 3.438 148.025 4.212 148.601 5.208C149.189 6.204 149.483 7.326 149.483 8.574C149.483 9.822 149.189 10.944 148.601 11.94C148.025 12.936 147.233 13.716 146.225 14.28C145.229 14.844 144.137 15.126 142.949 15.126ZM142.949 11.4C143.741 11.4 144.353 11.148 144.785 10.644C145.217 10.128 145.433 9.438 145.433 8.574C145.433 7.698 145.217 7.008 144.785 6.504C144.353 5.988 143.741 5.73 142.949 5.73C142.145 5.73 141.527 5.988 141.095 6.504C140.663 7.008 140.447 7.698 140.447 8.574C140.447 9.438 140.663 10.128 141.095 10.644C141.527 11.148 142.145 11.4 142.949 11.4ZM153.587 11.814C155.195 10.614 156.467 9.528 157.403 8.556C158.339 7.572 158.807 6.654 158.807 5.802C158.807 5.514 158.741 5.292 158.609 5.136C158.489 4.98 158.327 4.902 158.123 4.902C157.883 4.902 157.691 5.028 157.547 5.28C157.415 5.52 157.367 5.892 157.403 6.396H153.533C153.569 5.28 153.809 4.362 154.253 3.642C154.709 2.922 155.297 2.394 156.017 2.058C156.737 1.722 157.529 1.554 158.393 1.554C159.929 1.554 161.051 1.926 161.759 2.67C162.479 3.402 162.839 4.344 162.839 5.496C162.839 6.708 162.449 7.848 161.669 8.916C160.901 9.972 159.935 10.866 158.771 11.598H162.893V14.82H153.587V11.814ZM163.854 8.232C163.854 6.156 164.292 4.524 165.168 3.336C166.056 2.148 167.418 1.554 169.254 1.554C171.078 1.554 172.434 2.154 173.322 3.354C174.21 4.542 174.654 6.168 174.654 8.232C174.654 10.308 174.21 11.946 173.322 13.146C172.434 14.334 171.078 14.928 169.254 14.928C167.418 14.928 166.056 14.334 165.168 13.146C164.292 11.946 163.854 10.308 163.854 8.232ZM170.712 8.232C170.712 7.272 170.616 6.552 170.424 6.072C170.232 5.58 169.842 5.334 169.254 5.334C168.654 5.334 168.258 5.58 168.066 6.072C167.874 6.552 167.778 7.272 167.778 8.232C167.778 9.204 167.874 9.936 168.066 10.428C168.258 10.908 168.654 11.148 169.254 11.148C169.842 11.148 170.232 10.908 170.424 10.428C170.616 9.936 170.712 9.204 170.712 8.232ZM175.7 11.814C177.308 10.614 178.58 9.528 179.516 8.556C180.452 7.572 180.92 6.654 180.92 5.802C180.92 5.514 180.854 5.292 180.722 5.136C180.602 4.98 180.44 4.902 180.236 4.902C179.996 4.902 179.804 5.028 179.66 5.28C179.528 5.52 179.48 5.892 179.516 6.396H175.646C175.682 5.28 175.922 4.362 176.366 3.642C176.822 2.922 177.41 2.394 178.13 2.058C178.85 1.722 179.642 1.554 180.506 1.554C182.042 1.554 183.164 1.926 183.872 2.67C184.592 3.402 184.952 4.344 184.952 5.496C184.952 6.708 184.562 7.848 183.782 8.916C183.014 9.972 182.048 10.866 180.884 11.598H185.006V14.82H175.7V11.814ZM185.896 11.814C187.504 10.614 188.776 9.528 189.712 8.556C190.648 7.572 191.116 6.654 191.116 5.802C191.116 5.514 191.05 5.292 190.918 5.136C190.798 4.98 190.636 4.902 190.432 4.902C190.192 4.902 190 5.028 189.856 5.28C189.724 5.52 189.676 5.892 189.712 6.396H185.842C185.878 5.28 186.118 4.362 186.562 3.642C187.018 2.922 187.606 2.394 188.326 2.058C189.046 1.722 189.838 1.554 190.702 1.554C192.238 1.554 193.36 1.926 194.068 2.67C194.788 3.402 195.148 4.344 195.148 5.496C195.148 6.708 194.758 7.848 193.978 8.916C193.21 9.972 192.244 10.866 191.08 11.598H195.202V14.82H185.896V11.814Z"
      fill="black"
    />
    <path
      d="M16.6349 58.294C13.8349 58.294 11.2589 57.636 8.90692 56.32C6.58292 55.004 4.73492 53.184 3.36292 50.86C1.99092 48.536 1.30492 45.918 1.30492 43.006C1.30492 40.094 1.99092 37.476 3.36292 35.152C4.73492 32.828 6.58292 31.022 8.90692 29.734C11.2589 28.418 13.8349 27.76 16.6349 27.76C19.4349 27.76 21.9969 28.418 24.3209 29.734C26.6449 31.022 28.4789 32.828 29.8229 35.152C31.1949 37.476 31.8809 40.094 31.8809 43.006C31.8809 45.918 31.1949 48.536 29.8229 50.86C28.4789 53.184 26.6309 55.004 24.2789 56.32C21.9549 57.636 19.4069 58.294 16.6349 58.294ZM16.6349 49.6C18.4829 49.6 19.9109 49.012 20.9189 47.836C21.9269 46.632 22.4309 45.022 22.4309 43.006C22.4309 40.962 21.9269 39.352 20.9189 38.176C19.9109 36.972 18.4829 36.37 16.6349 36.37C14.7589 36.37 13.3169 36.972 12.3089 38.176C11.3009 39.352 10.7969 40.962 10.7969 43.006C10.7969 45.022 11.3009 46.632 12.3089 47.836C13.3169 49.012 14.7589 49.6 16.6349 49.6ZM44.3585 28.264V45.022C44.3585 46.394 44.6525 47.486 45.2405 48.298C45.8565 49.082 46.8365 49.474 48.1805 49.474C49.5245 49.474 50.5185 49.082 51.1625 48.298C51.8065 47.486 52.1285 46.394 52.1285 45.022V28.264H61.4105V45.022C61.4105 47.85 60.8225 50.272 59.6465 52.288C58.4705 54.276 56.8605 55.774 54.8165 56.782C52.7725 57.79 50.4905 58.294 47.9705 58.294C45.4505 58.294 43.2105 57.79 41.2505 56.782C39.3185 55.774 37.8065 54.276 36.7145 52.288C35.6225 50.3 35.0765 47.878 35.0765 45.022V28.264H44.3585ZM80.384 58L74.798 47.332H74.756V58H65.432V28.264H79.292C81.7 28.264 83.758 28.698 85.466 29.566C87.174 30.406 88.448 31.568 89.288 33.052C90.156 34.508 90.59 36.16 90.59 38.008C90.59 39.996 90.03 41.76 88.91 43.3C87.818 44.84 86.236 45.946 84.164 46.618L90.632 58H80.384ZM74.756 41.116H78.452C79.348 41.116 80.02 40.92 80.468 40.528C80.916 40.108 81.14 39.464 81.14 38.596C81.14 37.812 80.902 37.196 80.426 36.748C79.978 36.3 79.32 36.076 78.452 36.076H74.756V41.116ZM136.447 28.264V58H127.165V43.174L122.587 58H114.607L110.029 43.174V58H100.705V28.264H112.129L118.681 46.114L125.065 28.264H136.447ZM149.979 28.264V58H140.655V28.264H149.979ZM165.824 58.294C162.268 58.294 159.328 57.468 157.004 55.816C154.708 54.136 153.462 51.686 153.266 48.466H163.178C163.318 50.174 164.074 51.028 165.446 51.028C165.95 51.028 166.37 50.916 166.706 50.692C167.07 50.44 167.252 50.062 167.252 49.558C167.252 48.858 166.874 48.298 166.118 47.878C165.362 47.43 164.186 46.926 162.59 46.366C160.686 45.694 159.104 45.036 157.844 44.392C156.612 43.748 155.548 42.81 154.652 41.578C153.756 40.346 153.322 38.764 153.35 36.832C153.35 34.9 153.84 33.262 154.82 31.918C155.828 30.546 157.186 29.51 158.894 28.81C160.63 28.11 162.576 27.76 164.732 27.76C168.372 27.76 171.256 28.6 173.384 30.28C175.54 31.96 176.674 34.326 176.786 37.378H166.748C166.72 36.538 166.51 35.936 166.118 35.572C165.726 35.208 165.25 35.026 164.69 35.026C164.298 35.026 163.976 35.166 163.724 35.446C163.472 35.698 163.346 36.062 163.346 36.538C163.346 37.21 163.71 37.77 164.438 38.218C165.194 38.638 166.384 39.156 168.008 39.772C169.884 40.472 171.424 41.144 172.628 41.788C173.86 42.432 174.924 43.328 175.82 44.476C176.716 45.624 177.164 47.066 177.164 48.802C177.164 50.622 176.716 52.26 175.82 53.716C174.924 55.144 173.622 56.264 171.914 57.076C170.206 57.888 168.176 58.294 165.824 58.294ZM192.074 58.294C188.518 58.294 185.578 57.468 183.254 55.816C180.958 54.136 179.712 51.686 179.516 48.466H189.428C189.568 50.174 190.324 51.028 191.696 51.028C192.2 51.028 192.62 50.916 192.956 50.692C193.32 50.44 193.502 50.062 193.502 49.558C193.502 48.858 193.124 48.298 192.368 47.878C191.612 47.43 190.436 46.926 188.84 46.366C186.936 45.694 185.354 45.036 184.094 44.392C182.862 43.748 181.798 42.81 180.902 41.578C180.006 40.346 179.572 38.764 179.6 36.832C179.6 34.9 180.09 33.262 181.07 31.918C182.078 30.546 183.436 29.51 185.144 28.81C186.88 28.11 188.826 27.76 190.982 27.76C194.622 27.76 197.506 28.6 199.634 30.28C201.79 31.96 202.924 34.326 203.036 37.378H192.998C192.97 36.538 192.76 35.936 192.368 35.572C191.976 35.208 191.5 35.026 190.94 35.026C190.548 35.026 190.226 35.166 189.974 35.446C189.722 35.698 189.596 36.062 189.596 36.538C189.596 37.21 189.96 37.77 190.688 38.218C191.444 38.638 192.634 39.156 194.258 39.772C196.134 40.472 197.674 41.144 198.878 41.788C200.11 42.432 201.174 43.328 202.07 44.476C202.966 45.624 203.414 47.066 203.414 48.802C203.414 50.622 202.966 52.26 202.07 53.716C201.174 55.144 199.872 56.264 198.164 57.076C196.456 57.888 194.426 58.294 192.074 58.294ZM216.014 28.264V58H206.69V28.264H216.014ZM234.715 58.294C231.915 58.294 229.339 57.636 226.987 56.32C224.663 55.004 222.815 53.184 221.443 50.86C220.071 48.536 219.385 45.918 219.385 43.006C219.385 40.094 220.071 37.476 221.443 35.152C222.815 32.828 224.663 31.022 226.987 29.734C229.339 28.418 231.915 27.76 234.715 27.76C237.515 27.76 240.077 28.418 242.401 29.734C244.725 31.022 246.559 32.828 247.903 35.152C249.275 37.476 249.961 40.094 249.961 43.006C249.961 45.918 249.275 48.536 247.903 50.86C246.559 53.184 244.711 55.004 242.359 56.32C240.035 57.636 237.487 58.294 234.715 58.294ZM234.715 49.6C236.563 49.6 237.991 49.012 238.999 47.836C240.007 46.632 240.511 45.022 240.511 43.006C240.511 40.962 240.007 39.352 238.999 38.176C237.991 36.972 236.563 36.37 234.715 36.37C232.839 36.37 231.397 36.972 230.389 38.176C229.381 39.352 228.877 40.962 228.877 43.006C228.877 45.022 229.381 46.632 230.389 47.836C231.397 49.012 232.839 49.6 234.715 49.6ZM281.843 58H272.519L262.649 43.048V58H253.325V28.264H262.649L272.519 43.468V28.264H281.843V58Z"
      fill="black"
    />
  </svg>
);
