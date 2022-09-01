export type LinkBlock = {
  type: 'link';
  title: string;
  url: string;
  images?: string[];
  stickers?: string[];
  hidden: boolean;
  large?: boolean;
};

export type TextBlock = {
  type: 'text';
  title: string;
  description?: string;
  hidden: boolean;
};

export type VideoBlock = {
  type: 'video';
  title?: string;
  url: string;
  provider?: 'youtube';
  thumbnailURL?: string;
  hidden: boolean;
};

export type BlockOptions = {
  meta?: {
    textColor?: string;
    backgroundColor?: string;
    collapsed?: boolean;
  };
};
export type Block = (LinkBlock | TextBlock | VideoBlock) & BlockOptions;
