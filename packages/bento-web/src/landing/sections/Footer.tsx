import styled from 'styled-components';

import { systemFontStack } from '@/styles';
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
  margin-bottom: 100px;

  font-weight: 900;
  font-size: 24px;
  line-height: 120%;
  text-align: center;
  color: rgba(221, 204, 211, 0.88);

  /* FIXME: Tailwind */
  &,
  & * {
    font-family: ${systemFontStack} !important;
  }

  & > a {
    color: unset;
  }
`;
