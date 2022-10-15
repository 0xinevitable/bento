export const formatUsername = (username: string, prefix: string = '@') => {
  if (username.length >= 36) {
    return prefix + username.slice(0, 13);
  }
  return prefix + username;
};
