import Head from 'next/head';
import { useRouter } from 'next/router';

const meta = {
  title: 'Bento | Your Cross-chain Web3 Dashboard',
  description:
    'The open-source, cross-chain web3 dashboard. Add multiple wallets, group your crypto—native tokens, DAOs, and NFTs—into one, and keep track of your favorite DeFi investments.',
  image: 'https://bento.finance/assets/og-image-v2.png',
  url: 'https://bento.finance',
};

type MetaHeadProps = {
  title?: string;
  children?: React.ReactNode;
};

const MetaHead = ({ title, children }: MetaHeadProps) => {
  const router = useRouter();
  const currentTitle = title ?? meta.title;

  return (
    <Head>
      <title>{currentTitle}</title>
      <meta name="title" content={currentTitle} />
      <meta name="description" content={meta.description} />
      <link
        rel="canonical"
        href={`${meta.url}${router.asPath.split('?')[0]}`}
      />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={meta.url} />
      <meta property="og:title" content={currentTitle} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={meta.url} />
      <meta property="twitter:title" content={currentTitle} />
      <meta property="twitter:description" content={meta.description} />
      <meta property="twitter:image" content={meta.image} />
      <meta name="theme-color" content="#050606" />
      {children}
    </Head>
  );
};

export default MetaHead;
