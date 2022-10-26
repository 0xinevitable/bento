export type LinkBlock = {
  type: 'link';
  title: string;
  description?: string;
  url: string;
  images?: string[];
  stickers?: string[];
  large?: boolean;
};

export type TextBlock = {
  type: 'text';
  title: string;
  description?: string;
};

export type VideoBlock = {
  type: 'video';
  title?: string;
  url: string;
  provider?: 'youtube';
  thumbnailURL?: string;
};

export type BlockOptions = {
  meta?: {
    textColor?: string;
    backgroundColor?: string;
    collapsed?: boolean;
  };
  hidden?: boolean;
};
export type Block = (LinkBlock | TextBlock | VideoBlock) & BlockOptions;
