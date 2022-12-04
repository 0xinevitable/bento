import { shortenAddress } from '@bento/common';
import styled from '@emotion/styled';
import { AutoComplete, Input } from '@geist-ui/core';
import { AutoCompleteOptions } from '@geist-ui/core/esm/auto-complete';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { useLazyEffect } from '@/hooks/useLazyEffect';

export const SearchBar: React.FC = () => {
  const [queryDraft, setQueryDraft] = useState<string>('');
  const [options, setOptions] = useState<AutoCompleteOptions>([]);

  const onSearch = useCallback(
    (value: string) => setQueryDraft(value),
    [setQueryDraft],
  );

  const search = useCallback(async (value: string) => {
    const { identifyWalletAddress } = await import('@bento/core');
    const walletType = identifyWalletAddress(value);
    if (!walletType) {
      setOptions([]);
      return;
    }

    setOptions([
      { label: shortenAddress(value), value: `${walletType}$${value}` },
    ]);
  }, []);

  useLazyEffect(
    () => {
      search(queryDraft);
    },
    [search, queryDraft],
    500,
  );

  const router = useRouter();
  const onSelect = useCallback(
    (value: string) => {
      const [walletType, account] = value.split('$');
      if (!walletType || !account) {
        return;
      }
      router.push(`/wallet/${walletType}/${value}`);
    },
    [router],
  );

  return (
    <SearchWrapper className="sys">
      <AutoComplete
        placeholder="Search Accounts"
        onSearch={onSearch}
        onSelect={onSelect}
        options={options}
      />
    </SearchWrapper>
  );
};

const SearchWrapper = styled.div`
  && .auto-complete {
    width: 100%;
    max-width: 400px;

    .with-label,
    .input-container {
      width: 100%;
    }
  }
`;
