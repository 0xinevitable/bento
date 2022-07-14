import clsx from 'clsx';
import styled from 'styled-components';

type Props = React.HTMLAttributes<HTMLDivElement>;

export const EmptyBalance: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div
      className={clsx('w-full flex flex-col items-center', className)}
      {...props}
    >
      <Illust src="/assets/illusts/bitcoin.png" />
      <Message>Assets will show up here</Message>
    </div>
  );
};

const Illust = styled.img`
  width: 128px;
  height: 128px;
`;

const Message = styled.span`
  margin-top: 8px;

  font-weight: 700;
  font-size: 24px;
  line-height: 120%;
  text-align: center;
  color: rgba(221, 204, 211, 0.88);
`;
