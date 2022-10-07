// import { getLPPoolBalance, getLPPoolList } from './kokonutswap/lp';
import { getNodeStakes } from './klaystation/staking';

const main = async () => {
  await getNodeStakes();
  // const kokonutswapPools = await getLPPoolList();
  // for (const pool of kokonutswapPools) {
  //   const balance = await getLPPoolBalance(
  //     pool,
  //     kokonutswapPools,
  //     '0x7777777141f111cf9f0308a63dbd9d0cad3010c4',
  //   );
  //   console.log(balance);
  // }
};
main();
