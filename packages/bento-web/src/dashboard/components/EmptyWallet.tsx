import clsx from 'clsx';
import styled from 'styled-components';

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type EmptyWalletProps = DivProps & {
  onClickConnect: () => void;
};

export const EmptyWallet: React.FC<EmptyWalletProps> = ({
  className,
  onClickConnect,
  ...props
}) => {
  return (
    <div
      className={clsx('w-full flex flex-col items-center', className)}
      {...props}
    >
      <Illust src="/assets/illusts/wallet.png" />
      <Message>Connect your wallet</Message>
      <Button onClick={onClickConnect}>Connect</Button>
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

const Button = styled.button`
  margin-top: 12px;
  padding: 12px 16px;
  cursor: pointer;

  border-radius: 8px;
  border: 1px solid rgba(255, 165, 165, 0.66);
  background: radial-gradient(98% 205% at 0% 0%, #74021a 0%, #c1124f 100%);
  filter: drop-shadow(0px 10px 32px rgba(151, 42, 53, 0.33));
  transition: all 0.2s ease-in-out;

  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  text-align: center;
  letter-spacing: -0.01px;

  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0px 4px 12px rgba(101, 0, 12, 0.42);

  &:active {
    opacity: 0.45;
  }
`;
