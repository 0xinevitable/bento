import styled from '@emotion/styled';
import React, { useMemo } from 'react';
import YouTube from 'react-youtube';

import { VideoBlock } from '@/profile/blocks';

type Props = VideoBlock & {};

// NOTE: ThisYouTube only for now
export const VideoBlockItem: React.FC<Props> = (props) => {
  const youtubeID = useMemo(() => {
    const regex =
      /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
    return regex.exec(props.url)?.[3] || null;
  }, [props.url]);

  if (!youtubeID) {
    return null;
  }

  return (
    <Wrapper>
      <YouTubeVideo
        videoId={youtubeID}
        title={props.title}
        opts={{
          width: '100%',
          height: '100%',
          playerVars: {
            // autoplay: 1,
            controls: 0,
            autohide: 1,
            wmode: 'opaque',
          },
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled.li`
  margin-top: 8px;
  width: 100%;
  cursor: pointer;

  border-radius: 8px;
  overflow: hidden;
  display: flex;
`;
const YouTubeVideo = styled(YouTube)`
  width: 100%;
  height: 258px;
`;
