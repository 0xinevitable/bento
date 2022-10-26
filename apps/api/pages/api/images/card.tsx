import { Resvg } from '@resvg/resvg-js';
import { createHmac } from 'crypto';
import { format } from 'date-fns';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import satori from 'satori';

import { ServerSupabase as Supabase } from '@/utils/ServerSupabase';
import { withCORS } from '@/utils/middlewares/withCORS';

const fileDirectory = path.join(process.cwd(), '_files');

const getFontBuffer = async (filename: string) => {
  const fontPath = path.join(fileDirectory, filename);
  const out = await fs.promises.readFile(fontPath);
  return out;
};

const getDataURL = async (
  mimeType: string,
  filename: string,
): Promise<string> => {
  const jsonDirectory = path.join(process.cwd(), '_files');
  const filePath = path.join(jsonDirectory, filename);
  const buffer = await fs.promises.readFile(filePath);
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
};

export const formatUsername = (
  username: string | undefined,
  prefix: string = '@',
) => {
  if (!username) {
    return prefix + 'unknown';
  }
  if (username.length >= 36) {
    return prefix + username.slice(0, 13);
  }
  return prefix + username;
};

type UserProfile = {
  user_id: string;
  username: string;
  display_name: string | null;
  images: string[] | null;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user_id = req.query.user_id as string;
  const token = req.query.token as string;

  if (process.env.NODE_ENV === 'production' || !!token) {
    const hmac = createHmac('sha256', 'my_secret');
    hmac.update(JSON.stringify({ user_id }));
    const verifyToken = hmac.digest('hex');

    if (token !== verifyToken) {
      return res.status(401).send('Invalid token.');
    }
  }

  if (!user_id) {
    return res.status(400).send('Invalid params.');
  }

  const [fontData, backgroundImageDataURL, userQueryRes, profileQueryRes] =
    await Promise.all([
      getFontBuffer('Pretendard-Black.otf'),
      getDataURL('image/png', 'card-background-01.png'),
      Supabase.auth.api.getUserById(user_id),
      Supabase.from('profile') //
        .select('*')
        .eq('user_id', user_id),
    ]);

  const user = userQueryRes.data;
  if (!user) {
    return res.status(404).send('User not found.');
  }
  const profile = profileQueryRes.data?.[0] as UserProfile | undefined;
  const defaultZapImageDataURL = !profile?.images?.[0]
    ? await getDataURL('image/png', 'default-zap.png')
    : '';

  const svg = await satori(
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        filter: 'saturate(120%)',
      }}
    >
      <img
        src={backgroundImageDataURL}
        style={{ width: '100%', height: '100%' }}
        width={620}
        height={800}
      />
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
        }}
      >
        <div
          style={{
            width: 342,
            height: 452,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              padding: 8,
              backgroundColor: '#E1F664',
              boxShadow: '0px 4px 12px rgba(72, 82, 13, 0.32)',
              borderRadius: 5,
              fontWeight: 900,
              fontSize: 16,
              lineHeight: '100%',
              letterSpacing: '-0.5px',
              textTransform: 'uppercase',
              color: 'black',
            }}
          >
            {`JOINED ${format(new Date(user.created_at), 'yyyy-MM-dd')}`}
          </span>
          <div
            style={{
              marginTop: 80,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {!!profile?.images?.[0] ? (
              <img
                style={{
                  width: 212,
                  height: 212,
                  border: '1px solid #E1F664',
                  borderRadius: 14,
                  backgroundColor: 'black',
                }}
                src={profile.images[0]}
              />
            ) : (
              <img
                width={212}
                height={212}
                style={{
                  width: 212,
                  height: 212,
                }}
                src={defaultZapImageDataURL}
              />
            )}
          </div>
          <div
            style={{
              marginTop: 32,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                // paddingLeft: 20,
                // paddingRight: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                style={{ marginRight: 8 }}
                width="19"
                height="33"
                viewBox="0 0 19 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.15 0L0.475 2.86738L0 10.5137H4L0.475 18.5L4 20L0.95 32.497L16.15 12.9032L13 11L19 5.73476L16.15 0Z"
                  fill="#E1F664"
                />
              </svg>
              <span
                style={{
                  fontWeight: 900,
                  fontSize: 32,
                  lineHeight: '100%',
                  letterSpacing: '-0.5px',
                  color: '#E1F664',
                  // textOverflow: 'ellipsis',
                }}
              >
                {profile?.display_name || 'Unknown'}
              </span>
            </div>
            <span
              style={{
                marginTop: 8,
                fontWeight: 900,
                fontSize: 18,
                lineHeight: '100%',
                letterSpacing: '-0.2px',
                color: '#FAFAFA',
              }}
            >
              BENTO OG
            </span>
            <span
              style={{
                marginTop: 4,
                fontWeight: 900,
                fontSize: 16,
                lineHeight: '100%',
                letterSpacing: '-0.2px',
                color: '#E1F664',
              }}
            >
              {formatUsername(profile?.username)}
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 620,
      height: 800,
      fonts: [
        {
          name: 'Pretendard',
          data: fontData,
          weight: 900,
          style: 'normal',
        },
      ],
    },
  );

  const resvg = new Resvg(svg, {});
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  res.setHeader('content-type', 'image/png');
  res.setHeader(
    'cache-control',
    'public, immutable, no-transform, max-age=31536000',
  );
  res.send(pngBuffer);
};

export default withCORS(handler);
