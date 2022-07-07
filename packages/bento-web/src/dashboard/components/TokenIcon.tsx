import React from 'react';
import styled from 'styled-components';

type TokenIconProps = Omit<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
  'ref'
> & {
  src?: string;
  alt?: string;
};
export const TokenIcon: React.FC<TokenIconProps> = ({
  className,
  ...props
}) => (
  <OuterRing>
    <InnerRing>
      <Image {...props} />
    </InnerRing>
  </OuterRing>
);

const OuterRing = styled.div`
  width: 68px;
  height: 68px;

  display: flex;
  justify-content: center;
  align-items: flex-end;

  background: radial-gradient(
    98.83% 98.83% at 50.83% 1.17%,
    #1d0408 46.35%,
    #4e0505 100%
  );
  border-radius: 157.781px;
`;
const InnerRing = styled.div`
  margin-bottom: 9px;
  width: 54px;
  height: 54px;

  display: flex;
  justify-content: center;
  align-items: flex-end;

  background: radial-gradient(
    to bottom,
    #4b0603 50.52%,
    #840100 84.83%,
    #d30027 100%
  );
  background: radial-gradient(
    101.25% 101.25% at 51.25% -1.25%,
    #4b0603 50.52%,
    #840100 84.83%,
    #d30027 100%
  );
  box-shadow: 0px 4.25px 21.25px #040325;
  border-radius: 157.781px;
`;
const Image = styled.img`
  margin-bottom: 10px;
  width: 54px;
  min-width: 54px;
  max-width: 54px;
  height: 54px;

  background: white;
  outline: 1px solid rgba(176, 171, 83, 0.33);
  filter: drop-shadow(0px 4.25px 4.25px rgba(0, 0, 0, 0.25));
  border-radius: 157.781px;
  object-fit: cover;
`;
