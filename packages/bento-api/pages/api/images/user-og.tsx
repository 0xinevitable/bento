import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import satori from 'satori';

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

  const layerRelativePath = path.join(jsonDirectory, filename);
  const buffer = await fs.promises.readFile(layerRelativePath);
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

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const username = req.query.username as string;
  if (!username) {
    return new Response('Invalid params.', { status: 400 });
  }

  const [fontData, dataURL] = await Promise.all([
    getFontBuffer('Pretendard-Black.otf'),
    getDataURL('image/jpeg', 'og-background.jpg'),
  ]);

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
      <img src={dataURL} width="1280px" height="640px" />
      <div
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 220,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontWeight: 900,
            fontSize: '66px',
            lineHeight: '100%',
            letterSpacing: '-0.65px',
            color: '#FFD978',
            textAlign: 'center',
          }}
        >
          {formatUsername(username)}
        </span>
      </div>
    </div>,
    {
      width: 1280,
      height: 640,
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

  res.setHeader('content-type', 'image/svg+xml');
  res.setHeader(
    'cache-control',
    'public, immutable, no-transform, max-age=31536000',
  );
  res.send(svg);
}
