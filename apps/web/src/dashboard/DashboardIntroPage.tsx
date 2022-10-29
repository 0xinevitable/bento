import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { PageContainer } from '@/components/PageContainer';
import { MetaHead } from '@/components/system';
import { useSession } from '@/hooks/useSession';

import { DashboardIntro } from './DashboardIntro';

const DashboardIntroPage = () => {
  const router = useRouter();
  const { session } = useSession();

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }

    router.push(`/u/${session.user?.id}`);
  }, [router, JSON.stringify(session)]);

  return (
    <>
      <MetaHead />
      <Black />
      <PageContainer style={{ paddingTop: 0 }}>
        {!session && <DashboardIntro session={session} />}

        {/* TODO: Show loading */}
        {!!session && null}
      </PageContainer>
    </>
  );
};

export default DashboardIntroPage;

const Black = styled.div`
  width: 100%;
  height: 64px;
  background-color: rgba(0, 0, 0, 0.5);
`;
