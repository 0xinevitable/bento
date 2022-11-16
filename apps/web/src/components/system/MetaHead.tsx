import Head from 'next/head';
import { useRouter } from 'next/router';

const meta = {
  title: 'Bento | Your Cross-chain Web3 Dashboard',
  description:
    'The open-source, cross-chain web3 dashboard. Add multiple wallets, group your crypto—native tokens, DAOs, and NFTs—into one, and keep track of your favorite DeFi investments.',
  image: 'https://bento.finance/assets/og-image.jpg',
  url: 'https://bento.finance',
};

type MetaHeadProps = {
  title?: string;
  children?: React.ReactNode;
  image?: string;
};

export const MetaHead = ({ title, image, children }: MetaHeadProps) => {
  const router = useRouter();
  const currentTitle = title ?? meta.title;
  const imageURL = image ?? meta.image;

  return (
    <Head>
      <title>{currentTitle}</title>
      <meta key="title" name="title" content={currentTitle} />
      <meta key="description" name="description" content={meta.description} />
      <link
        key="canonical"
        rel="canonical"
        href={`${meta.url}${router.asPath.split('?')[0]}`}
      />

      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:url" property="og:url" content={meta.url} />
      <meta key="og:title" property="og:title" content={currentTitle} />
      <meta
        key="og:description"
        property="og:description"
        content={meta.description}
      />
      <meta key="og:image" property="og:image" content={imageURL} />

      <meta
        key="twitter:card"
        property="twitter:card"
        content="summary_large_image"
      />
      <meta key="twitter:url" property="twitter:url" content={meta.url} />
      <meta
        key="twitter:title"
        property="twitter:title"
        content={currentTitle}
      />
      <meta
        key="twitter:description"
        property="twitter:description"
        content={meta.description}
      />
      <meta key="twitter:image" property="twitter:image" content={imageURL} />
      <meta key="theme-color" name="theme-color" content="#050606" />
      {children}
    </Head>
  );
};
