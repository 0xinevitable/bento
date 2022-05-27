import clsx from 'clsx';
import React from 'react';

type TokenIconProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  src: string;
  alt: string;
};
export const TokenIcon: React.FC<TokenIconProps> = ({
  className,
  ...props
}) => (
  <img
    className={clsx(
      'w-12 min-w-fit h-12 rounded-full overflow-hidden shadow-md ring-2 ring-slate-600/50',
      className,
    )}
    {...props}
  />
);
