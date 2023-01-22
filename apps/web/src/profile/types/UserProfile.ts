export type UserProfile = {
  user_id: string;
  username: string;
  display_name: string;
  images: string[] | null;
  verified: boolean;
  bio: string;
};
