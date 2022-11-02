import styled from '@emotion/styled';
import React from 'react';

type Props = React.HTMLAttributes<HTMLButtonElement>;

export const SyncRSSButton: React.FC<Props> = (props) => {
  return (
    <Button {...props}>
      <ButtonTitle>Sync links from Social Media</ButtonTitle>
      <SocialMediaList>
        {SOCIAL_MEDIA_ICONS.map((item) => (
          <SocialMediaIcon key={item.alt} {...item} />
        ))}
      </SocialMediaList>
      <NoLoginRequired>No Login Required</NoLoginRequired>
      <UpdatesAutomatically>Updates Automatically</UpdatesAutomatically>
    </Button>
  );
};

const Button = styled.button`
  width: 100%;
  padding-top: 28px;
  padding-bottom: 24px;

  background-color: #e19ddd;
  background-image: conic-gradient(
    from -79.58deg at 50% 50%,
    #e19ddd 0deg,
    #a679df 84.38deg,
    #82bdfb 163.12deg,
    #9ee6c8 260.62deg,
    #e19ddd 360deg
  );
  border-radius: 12px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  filter: saturate(120%);
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translate3d(0, -8px, 0);
    box-shadow: 0px 8px 24px rgba(155, 226, 207, 0.44);
  }
`;
const ButtonTitle = styled.h3`
  font-weight: 700;
  font-size: 18px;
  line-height: 100%;
  text-align: center;
  color: #ffffff;
  text-shadow: 0px 2px 16px rgba(73, 64, 121, 0.54);
`;

const NoLoginRequired = styled.span`
  margin-top: 13px;

  padding: 12px 18px;
  background: #17181a;
  border-radius: 32px;

  font-weight: 700;
  font-size: 14px;
  line-height: 100%;
  text-align: center;
  color: #ffffff;
`;
const UpdatesAutomatically = styled.span`
  margin-top: 8px;

  font-weight: 700;
  font-size: 11px;
  line-height: 100%;
  text-align: center;
  color: #17181a;
`;

const SOCIAL_MEDIA_ICONS = [
  {
    src: '/assets/profile/rss/social-media-telegram.png',
    alt: 'Telegram',
  },
  {
    src: '/assets/profile/rss/social-media-instagram.png',
    alt: 'Instagram',
  },
  {
    src: '/assets/profile/rss/social-media-naver-blog.png',
    alt: 'Naver Blog',
  },
  {
    src: '/assets/profile/rss/social-media-twitter.png',
    alt: 'Twitter',
  },
  {
    src: '/assets/profile/rss/social-media-more.png',
    alt: 'And More',
  },
];
const SocialMediaList = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 6px;
`;
const SocialMediaIcon = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 15px;
  filter: drop-shadow(0px 2px 8px rgba(73, 64, 121, 0.2));
`;
