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
