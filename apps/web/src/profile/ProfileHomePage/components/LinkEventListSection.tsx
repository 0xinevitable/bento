import styled from '@emotion/styled';
import React from 'react';

import { ExampleUserProfile } from '@/profile/constants/ExampleUserProfile';

export const LinkEventListSection: React.FC = () => {
  return (
    <section>
      <LinkEventItemList>
        {ExampleUserProfile.links?.map(({ title }) => (
          <LinkEventItem key={title} title={title!} />
        ))}
      </LinkEventItemList>
    </section>
  );
};

const LinkEventItemList = styled.ul`
  list-style-type: none;
  padding: 0 20px;
  margin: 16px 0 0;
`;

type LinkEventItemProps = {
  title: string;
};
const LinkEventItem: React.FC<LinkEventItemProps> = ({ title }) => {
  return (
    <Container>
      <Title>{title}</Title>
      <EventList>
        <EventItem>
          <EventItemField>Impressions</EventItemField>
          <EventItemValue>243</EventItemValue>
        </EventItem>
        <EventItem>
          <EventItemField>Clicks</EventItemField>
          <EventItemValue>49</EventItemValue>
        </EventItem>
      </EventList>
    </Container>
  );
};
const Container = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background-color: #262b34;
  border-radius: 8px;

  &:not(:last-of-type) {
    margin-bottom: 8px;
  }
`;
const Title = styled.span`
  font-weight: bold;
  color: rgba(255, 255, 255, 0.65);
`;

const EventList = styled.ul`
  display: flex;
  list-style-type: none;
`;
const EventItem = styled.li`
  margin-left: 24px;
  display: flex;
  flex-direction: column;
`;
const EventItemField = styled.span`
  margin-bottom: 4px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.65);
`;
const EventItemValue = styled.span`
  font-weight: bold;
  color: rgb(255, 255, 255);
  font-size: 2.35rem;
`;
