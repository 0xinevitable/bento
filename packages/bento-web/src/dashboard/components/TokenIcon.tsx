import React from 'react';
import styled from 'styled-components';

type TokenIconProps = Omit<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
  'ref'
> & {
  src: string;
  alt: string;
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
    #00001e 0%,
    #01011b 50.52%,
    #060642 100%
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
    101.25% 101.25% at 51.25% -1.25%,
    #00001e 0%,
    #04042a 50.52%,
    #0b0d7a 85.79%,
    #2123b8 100%
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
  border: 1px solid rgba(0, 255, 240, 0.33);
  filter: drop-shadow(0px 4.25px 4.25px rgba(0, 0, 0, 0.25));
  border-radius: 157.781px;
  object-fit: cover;
`;
