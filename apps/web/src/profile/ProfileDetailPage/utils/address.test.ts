import { shortenAddress } from './address';

it('Shorten address', () => {
  expect(shortenAddress('0x4a003f0a2c52e37138eb646aB4E669C4A84C1001')).toBe(
    '0x4a00...1001',
  );
});
