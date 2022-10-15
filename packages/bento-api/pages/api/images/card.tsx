import { ImageResponse } from '@vercel/og';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'experimental-edge',
};

export default function (req: NextRequest, _res: NextResponse) {
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
              JOINED 16.10.22
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
              <span
                style={{
                  fontWeight: 900,
                  fontSize: 32,
                  lineHeight: '100%',
                  letterSpacing: '-0.5px',
                  color: '#E1F664',
                }}
              >
                JUNHO YEO
              </span>
              <span
                style={{
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
                  fontWeight: 900,
                  fontSize: 16,
                  lineHeight: '100%',
                  letterSpacing: '-0.2px',
                  color: '#E1F664',
                }}
              >
                @junhoyeo
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 620,
      height: 800,
    },
  );
}
