import styled from '@emotion/styled';
import { Input } from '@geist-ui/core';
import { useCallback, useState } from 'react';

import { useLazyEffect } from '@/hooks/useLazyEffect';

export const SearchBar: React.FC = () => {
  const [queryDraft, setQueryDraft] = useState<string>('');

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQueryDraft(e.target.value);
    },
    [setQueryDraft],
  );

  const search = useCallback(async (value: string) => {
    const { identifyWalletAddress } = await import('@bento/core');
    const result = identifyWalletAddress(value);
    console.log({ result });
  }, []);

  useLazyEffect(
    () => {
      search(queryDraft);
    },
    [search, queryDraft],
    500,
  );

  return (
    <StyledInput
      className="sys"
      placeholder="Search Accounts"
      onChange={onChange}
    />
  );
};

const StyledInput = styled(Input)`
  &&& {
    max-width: 400px;
    width: 100%;
  }
`;
