import styled from 'styled-components';

import { Analytics } from '@/utils';

export const Footer: React.FC = () => {
  return (
    <Container>
      <a
        title="INEVITABLE"
        href="https://inevitable.team"
        target="_blank"
        onClick={() =>
          Analytics.logEvent('click_team_link', {
            medium: 'dashboard_landing',
          })
        }
      >
        2022 INEVITABLE
      </a>
    </Container>
  );
};

const Container = styled.footer`
  margin-top: 120px;
  margin-bottom: 100px;

  font-weight: 700;
  font-size: 24px;
  line-height: 120%;
  text-align: center;
  color: rgba(221, 204, 211, 0.88);

  & > a {
    color: unset;
  }
`;
