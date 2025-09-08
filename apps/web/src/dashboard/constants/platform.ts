export const displayName = (platform: string) => {
  if (platform === 'mitosis') {
    return 'Mitosis';
  }
  return platform.charAt(0).toUpperCase() + platform.slice(1);
};
