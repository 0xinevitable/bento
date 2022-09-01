export const Base64 = {
  encode: (value: string): string =>
    Buffer.from(value, 'binary').toString('base64'),
  decode: (encoded: string): string =>
    Buffer.from(encoded, 'base64').toString('utf8'),
};
