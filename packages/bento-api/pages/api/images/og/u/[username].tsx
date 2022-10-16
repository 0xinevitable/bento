import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import satori from 'satori';

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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const username = req.query.username as string;
  if (!username) {
    return res.status(400).send('Invalid params.');
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
          bottom: 223,
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
