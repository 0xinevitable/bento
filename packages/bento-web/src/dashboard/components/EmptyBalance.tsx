import styled from 'styled-components';

export const EmptyBalance = () => {
  return (
    <div className="w-full pt-12 flex flex-col items-center">
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
