import { ImageResponse } from '@vercel/og';
import { format } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

import { ServerSupabase as Supabase } from '@/utils/ServerSupabase';

const arrayBufferToHex = (arrayBuffer: ArrayBuffer) => {
  return Array.prototype.map
    .call(new Uint8Array(arrayBuffer), (n) => n.toString(16).padStart(2, '0'))
    .join('');
};

const fetchFont = (fontPath: string) =>
  fetch(new URL(fontPath, import.meta.url)).then((res) => res.arrayBuffer());

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

export const config = {
  runtime: 'experimental-edge',
};

const key = crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode('my_secret'),
  { name: 'HMAC', hash: { name: 'SHA-256' } },
  false,
  ['sign'],
);

type UserProfile = {
  user_id: string;
  username: string;
  display_name: string;
};

export default async function (req: NextRequest, _res: NextResponse) {
  const { searchParams } = req.nextUrl;

  const user_id = searchParams.get('user_id');
  const token = searchParams.get('token');

  const verifyToken = arrayBufferToHex(
    await crypto.subtle.sign(
      'HMAC',
      await key,
      new TextEncoder().encode(JSON.stringify({ user_id })),
    ),
  );

  if (token !== verifyToken) {
    return new Response('Invalid token.', { status: 401 });
  }

  if (!user_id) {
    return new Response('Invalid params.', { status: 400 });
  }

  const [fontData, userQueryRes, profileQueryRes] = await Promise.all([
    fetchFont(`${req.nextUrl.origin}/assets/Pretendard-Black.otf`),
    Supabase.auth.api.getUserById(user_id),
    Supabase.from('profile') //
      .select('*')
      .eq('user_id', user_id),
  ]);

  const user = userQueryRes.data;
  if (!user) {
    return new Response('User not found.', { status: 404 });
  }
  const profile = profileQueryRes.data?.[0] as UserProfile | undefined;

  return new ImageResponse(
    (
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
          src={`${req.nextUrl.origin}/assets/card-background-01.png`}
          style={{ width: '100%', height: '100%' }}
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
              <img
                style={{
                  width: 212,
                  height: 212,
                  border: '1px solid #E1F664',
                  borderRadius: 14,
                  backgroundColor: 'black',
                }}
                src={'https://github.com/junhoyeo.png'}
              />
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
                  paddingLeft: 20,
                  paddingRight: 20,
                  display: 'flex',
                  alignItems: 'center',
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
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                    // maxWidth: '275px',
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
                {formatUsername(profile?.display_name)}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 620,
      height: 800,
      fonts: [
        {
          name: 'Pretendard',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
      ],
    },
  );
}
