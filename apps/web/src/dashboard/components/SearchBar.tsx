import { ChainType, shortenAddress } from '@bento/common';
import { identifyWalletAddress } from '@bento/core';
import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { Button } from '@/components/system';
import { useLazyEffect } from '@/hooks/useLazyEffect';

import { Colors } from '@/styles';

export const SearchBar: React.FC = () => {
  const [queryDraft, setQueryDraft] = useState<string>('');
  const [queryChainType, setQueryChainType] = useState<ChainType | null>(null);

  const search = useCallback(async (value: string) => {
    const walletType = identifyWalletAddress(value);
    setQueryChainType(walletType);
  }, []);

  useLazyEffect(
    () => {
      search(queryDraft);
    },
    [search, queryDraft],
    500,
  );

  const router = useRouter();
  const onClickSearch = useCallback(() => {
    const account = queryDraft;
    if (!queryChainType || !account) {
      return;
    }
    router.push(`/wallet/${queryChainType}/${account}`);
  }, [router, queryChainType, queryDraft]);

  return (
    <Container>
      <InputWrapper>
        <Input
          placeholder="Look up any wallet address or ENS"
          onChange={(e) => setQueryDraft(e.target.value)}
        />

        <AnimatePresence>
          {queryChainType && (
            <ButtonContainer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SearchButton onClick={onClickSearch}>Search</SearchButton>
            </ButtonContainer>
          )}
        </AnimatePresence>
      </InputWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const InputWrapper = styled.div`
  margin-top: 24px;
  position: relative;
  width: 100%;
  max-width: 500px;
`;
const Input = styled.input`
  width: 100%;

  padding: 20px 16px;
  padding-right: 142px;

  background-color: ${Colors.gray800};
  border-radius: 8px;
  color: ${Colors.gray100};
  border: 1px solid ${Colors.gray700};
`;
const ButtonContainer = styled(motion.div)`
  position: absolute;
  top: 10px;
  right: 10px;
  bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SearchButton = styled(Button)`
  height: unset;
  padding: 18px 26px;
  font-size: 16px;
`;
