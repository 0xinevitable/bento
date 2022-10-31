import styled from '@emotion/styled';
import axios, { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, Checkbox, MetaHead } from '@/components/system';
import { useSession } from '@/hooks/useSession';

import { LinkBlock } from '@/profile/blocks';
import { FeatureFlags, toast } from '@/utils';

// import { Modal } from '@/components/system';
import { LinkBlockItem } from '../blocks/LinkBlockItem';
import { FieldInput } from '../components/FieldInput';
import { FixedLoginNudge } from '../components/LoginNudge';
import { useProfile } from '../hooks/useProfile';
// import { FieldTextArea } from '../components/FieldTextArea';
// import { BlockEditItem } from './components/BlockEditItem';
import { Preview } from './components/Preview';
import { TabBar } from './components/TabBar';

type Props = {
  isVisible?: boolean;
  onDismiss?: () => void;
};

type FeedItem = {
  link?: string;
  guid?: string;
  title?: string;
  pubDate?: string;
  creator?: string;
  summary?: string;
  content?: string;
  contentSnippet?: string;
  isoDate?: string;
  categories?: string[];
  enclosure?: {
    url: string;
    length?: number;
    type?: string;
  };
  ogImageURL: string | null;
};

const RSS_FEED_LIMIT = 15;

const emptyBlock: LinkBlock = {
  type: 'link',
  title: '',
  description: '',
  url: '',
  images: [''],
};

export const getServerSideProps: GetServerSideProps = async () => {
  if (!FeatureFlags.isProfileDetailedEditorEnabled) {
    return { notFound: true };
  }
  return { props: {} };
};

const ProfileEditPage = () => {
  const { session } = useSession();
  const { profile } = useProfile({ type: 'MY_PROFILE' });

  const [username, setUsername] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [blocks, setBlocks] = useState<LinkBlock[]>([]);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!profile) {
      return;
    }
    setUsername(profile.username);
    setDisplayName(profile.display_name);
    setBio(profile.bio);

    // FIXME:
    setBlocks([]);

    if (!!profile.images) {
      setImages(profile.images);
    } else {
      setImages(['/assets/mockups/profile-default.png']);
    }
  }, [profile]);

  const profileDraft = useMemo(
    () =>
      !profile
        ? null
        : {
            ...profile,
            username,
            display_name: displayName,
            bio,
            links: blocks,
            images,
            verified: false,
            tabs: [],
          },
    [username, displayName, images, bio, blocks],
  );

  const onSubmit = useCallback(async () => {
    const { data } = await axios.post(`/api/profile`, {
      username,
      display_name: displayName,
      bio,
      links: blocks,
    });
    console?.log(data);
  }, [username, displayName, bio, blocks]);

  const [rssURL, setRssURL] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

  const onClickSubscribe = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://feed.inevitable.team/api/rss?rssURL=${rssURL}&limit=${RSS_FEED_LIMIT}`,
      );
      setLoading(false);
      setFeedItems(data);
    } catch (error) {
      setLoading(false);
      setRssURL('');
      console.error(error);

      let description = 'Something went wrong';
      if (error instanceof AxiosError) {
        description = error.response?.data?.message || description;
      } else {
        description = (error as any).message || description;
      }
      toast({
        type: 'error',
        title: 'Server Error',
        description,
      });
    }
  }, [rssURL]);

  const blockURLs = useMemo(() => blocks.map((v) => v.url), [blocks]);

  return (
    <>
      <MetaHead />

      <Wrapper>
        <Preview profileDraft={profileDraft} />
        <EditorWrapper>
          <TabBar onClick={onSubmit} />
          <Container>
            {/* <ProfileContainer id="profile">
              <FieldInput
                field="사용자 이름"
                placeholder="여러분의 링크에 들어가는 이름이에요"
                defaultValue={profile?.username ?? ''}
                onChange={(e) => setUsername(e?.target.value)}
              />
              <FieldInput
                field="프로필에 보여질 이름"
                placeholder="당신의 이름을 적어주세요"
                defaultValue={profile?.display_name ?? ''}
                onChange={(e) => setDisplayName(e?.target.value)}
              />
              <FieldTextArea
                field="한 줄 소개"
                placeholder="한 문장으로 당신을 표현해 주세요"
                defaultValue={profile?.bio ?? ''}
                onChange={(e) => setBio(e?.target.value)}
              />
            </ProfileContainer> */}
            {/* <ProfileLinkList id="links">
              {blocks.map((item, index) => {
                return (
                  <BlockEditItem
                    key={`item-${index}`}
                    linkDraft={item}
                    // FIXME: default block
                    // defaultBlock={profile?.blocks?.[index]}
                    onChange={(updated) =>
                      setBlocks(
                        blocks.map((link, i) => (i === index ? updated : link)),
                      )
                    }
                    onDelete={() => {
                      const deletedLinks = blocks.filter(
                        (_, i) => !(i === index),
                      );
                      setBlocks(deletedLinks);
                    }}
                  />
                );
              })}
            </ProfileLinkList> */}
            {/* <button onClick={() => setBlocks([...blocks, emptyBlock])}>
              Add link
            </button> */}

            {FeatureFlags.isProfileRSSSubscriptionEnabled &&
              (loading ? (
                <Title>Loading...</Title>
              ) : !feedItems.length ? (
                <>
                  <Title>Subscribe RSS</Title>
                  <FieldInput
                    field="URL"
                    value={rssURL}
                    onChange={(e) => setRssURL(e.target.value)}
                  />
                  <Button onClick={onClickSubscribe}>Subscribe</Button>
                </>
              ) : (
                <ProfileLinkList>
                  {feedItems.map((item, index) => {
                    const description =
                      item.summary || item.contentSnippet || item.content;

                    const linkItem: LinkBlock = {
                      type: 'link',
                      title: item.title || '',
                      description: description,
                      url: item.link || '',
                      images: [item.ogImageURL || ''],
                    };
                    const isIncluded = blockURLs.includes(item.link || '');
                    return (
                      <LinkBlockItemWrapper key={index}>
                        <Checkbox
                          checked={isIncluded}
                          readOnly
                          onClick={() => {
                            if (isIncluded) {
                              setBlocks(
                                blocks.filter((v) => v.url !== item.link),
                              );
                            } else {
                              setBlocks([...blocks, linkItem]);
                            }
                          }}
                        />
                        <LinkBlockItem
                          title={item.title || ''}
                          description={description}
                          url={item.link || ''}
                          images={[item.ogImageURL || '']}
                          type="link"
                        />
                      </LinkBlockItemWrapper>
                    );
                  })}
                </ProfileLinkList>
              ))}
          </Container>
        </EditorWrapper>

        <FixedLoginNudge visible={!session} />
      </Wrapper>
    </>
  );
};

export default ProfileEditPage;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #111319;
  display: flex;
`;

const EditorWrapper = styled.div`
  height: 100vh;
  padding-top: 64px;
  margin-left: auto;
  width: 55vw;
  background-color: #171c21;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.35);
`;

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 36px 48px;
`;

const ProfileContainer = styled.div`
  padding-top: 28px;
  display: flex;
  flex-direction: column;
`;

// const ProfileLinkList = styled.ul`
//   margin: 16px 0 0;
//   padding: 0;
// `;

const Title = styled.span`
  margin: 0;
  color: white;
  font-weight: bold;
  font-size: 18.5px;
  cursor: text;
`;

const ProfileLinkList = styled.ul`
  list-style-type: none;
`;

const LinkBlockItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  & > input {
    width: 24px;
    height: 24px;
  }
`;
