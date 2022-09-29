import dedent from 'dedent';

export const basicFontStack = dedent`
  'Raleway', ui-sans-serif, system-ui, -apple-system,
  BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
  Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji
`;

export const systemFontStack = `'Inter', ${basicFontStack}`;
export const ralewayFontStack = `'Raleway', ${basicFontStack}`;
