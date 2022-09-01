import { cachedAxios } from '@bento/client';
import { Base64 } from '@bento/common';
import { TokenInput } from '@bento/core/lib/tokens';
import { promises as fs } from 'fs';
import path from 'path';
import prettier from 'prettier';

import coingeckoTokenList from './coingecko-coin-list.json';
import { WORKSPACE_ROOT_PATH, stringify } from './config';

const MANUALLY_OVERRIDED_IDS = [
  ['0x574e9c26bda8b95d7329505b4657103710eb32ea', 'binancecoin'],
  ['0xb40178be0fcf89d0051682e5512a8bab56b9ec3e', 'rai-finance'],
  ['0x9eaefb09fe4aabfbe6b1ca316a3c36afc83a393f', 'ripple'],
  ['0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167', 'tether'],
  ['0x02cbe46fb8a1f579254a9b485788f2d86cad51aa', 'bora'],
];

const MANUALLY_OVERRIDED_NAMES = [
  ['0xd676e57ca65b827feb112ad81ff738e7b6c1048d', 'Kronos DAO'],
];

const MANUALLY_OVERRIDED_COINGECKO_IDS = [
  ['0xd676e57ca65b827feb112ad81ff738e7b6c1048d', undefined],
];

// From Dexata
const getTokenAddressImgURL = (mixedAddr: string) => {
  const addr = mixedAddr.toLowerCase();
  const CDN_URL = 'https://dexata.kr/images';
  const n: Record<string, string> = {
    '0x64a4801eb7433bb543255695f690c6b104c9437e': 'mmt.png',
    '0x0268dbed3832b87582b1fa508acf5958cbb1cd74': 'ijm.png',
    '0x0000000000000000000000000000000000000000': 'klay.svg',
    '0x5c74070fdea071359b86082bd9f9b3deaafbe32b': 'kdai.png',
    '0xa323d7386b671e8799dca3582d6658fdcdcd940a': 'sklay.svg',
    '0x34d21b1e550d73cee41151c77f3c73359527a396': 'keth.svg',
    '0x16d0e1fbd024c600ca0380a4c5d57ee7a2ecbf9c': 'kwbtc.svg',
    '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167': 'kusdt.svg',
    '0xfe41102f325deaa9f303fdd9484eb5911a7ba557': 'korc.svg',
    '0x9657fb399847d85a9c1a234ece9ca09d5c00f466': 'isr.svg',
    '0x275f942985503d8ce9558f8377cc526a3aba3566': 'wiken.png',
    '0xdcd62c57182e780e23d2313c4782709da85b9d6c': 'ssx.svg',
    '0x46f307b58bf05ff089ba23799fae0e518557f87c': 'abl.png',
    '0x1cd3828a2b62648dbe98d6f5748a6b1df08ac7bb': 'redi.svg',
    '0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654': 'ksp.svg',
    '0x588c62ed9aa7367d7cd9c2a9aaac77e44fe8221b': 'agov.svg',
    '0x4dd402a7d54eaa8147cb6ff252afe5be742bdf40': 'hint.png',
    '0x5096db80b21ef45230c9e423c373f1fc9c0198dd': 'wemix.png',
    '0x321bc0b63efb1e4af08ec6d20c85d5e94ddaaa18': 'bbc.svg',
    '0x0c1d7ce4982fd63b1bc77044be1da05c995e4463': 'ktrix.svg',
    '0xafde910130c335fa5bd5fe991053e3e0a49dce7b': 'pib.png',
    '0xc4407f7dc4b37275c9ce0f839652b393e13ff3d1': 'clbk2.png',
    '0x3f34671fba493ab39fbf4ecac2943ee62b654a88': 'khandy.svg',
    '0x27dcd181459bcddc63c37bab1e404a313c0dfd79': 'mnr.svg',
    '0x4b91c67a89d4c4b2a4ed9fcde6130d7495330972': 'trcl.svg',
    '0x9eaefb09fe4aabfbe6b1ca316a3c36afc83a393f': 'kxrp.svg',
    '0x91e0d7b228a33072d9b3209cf507f78a4bd835f2': 'kducato.png',
    '0x3b3b30a76d169f72a0a38ae01b0d6e0fbee3cc2e': 'temco.png',
    '0xe06b40df899b9717b4e6b50711e1dc72d08184cf': 'hibs.svg',
    '0xdfe180e288158231ffa5faf183eca3301344a51f': 'kbelt.svg',
    '0x574e9c26bda8b95d7329505b4657103710eb32ea': 'kbnb.svg',
    '0x507efa4e365fd5def42cb05ae3ecb51a30321588': 'kqbz.png',
    '0x49a767b188b9d782d7b0efcd485ca3796390198e': 'kstpl.png',
    '0x8583063110b5d29036eced4db1cc147e78a86a77': 'kauto.svg',
    '0x100bc15ae8b489c771d9740ea0bb1aea945a1f67': 'kton.png',
    '0x75ad14d0360408dc6f8163e5dfb51aad516f4afd': 'buz.png',
    '0xef82b1c6a550e730d8283e1edd4977cd01faf435': 'six.png',
    '0xe950bdcfa4d1e45472e76cf967db93dbfc51ba3e': 'kai.png',
    '0x37d46c6813b121d6a27ed263aef782081ae95434': 'skai.png',
    '0xb40178be0fcf89d0051682e5512a8bab56b9ec3e': 'krai.png',
    '0x8c783809332be7734fa782eb5139861721f77b33': 'turk.png',
    '0x2fade69ba4dcb112c530c48fdf41fc071685cede': 'krush.png',
    '0xf4546e1d3ad590a3c6d178d671b3bc0e8a81e27d': 'sbwpm.svg',
    '0x7eee60a000986e9efe7f5c90340738558c24317b': 'per.png',
    '0xdb116e2dc96b4e69e3544f41b50550436579979a': 'kfi.png',
    '0x8ef60f0a5a2db984431934f8659058e87cd5c70a': 'kicx.png',
    '0x968d93a44b3ef61168ca621a59ddc0e56583e592': 'bkai.svg',
    '0x158beff8c8cdebd64654add5f6a1d9937e73536c': 'house.png',
    '0x74ba03198fed2b15a51af242b9c63faf3c8f4d34': 'aklay.png',
    '0xa4547080f3310b9ec4ed4b08fbc3762c6d294cc9': 'orca.png',
    '0x44efe1ec288470276e29ac3adb632bff990e2e1f': 'vkai.svg',
    '0xd51c337147c8033a43f3b5ce0023382320c113aa': 'finix.png',
    '0x5a55a1cd5cc5e89019300213f9faf20f57361d43': 'jun.svg',
    '0x69df45d36341f6bad3c4beffb9e77f2b74709c40': 'juns.svg',
    '0x7b7363cf78662b638a87f63871c302be363ddc7a': 'wood.png',
    '0x292725810ab3dde0a01e19acd4e8e9d6c073773b': 'kaergo.png',
    '0xdfc05e7a28ed3a1c22bc7c22383764a4732ead23': 'kseth.svg',
    '0x7a85836f66dbbd53f457855de243f5aa28051e33': 'kssol.svg',
    '0x4afe41cae3bd5133991384d642b82f2d0539e3aa': 'ksluna.svg',
    '0x1add8ba5a695063962abe9b7da70ed2440006def': 'ksdunamu.svg',
    '0xa5c1cd7b9a015243a0ff8f99c5dbe17647175af0': 'ksyanolja.svg',
    '0x88bfd174f9076519a45979ce3122bc15883c0691': 'kscoinbase.svg',
    '0xba9725eaccf07044625f1d232ef682216f5371c2': 'clam.svg',
    '0x754288077d0ff82af7a5317c7cb8c444d421d103': 'kusdc.png',
    '0xb15183d0d4d5e86ba702ce9bb7b633376e7db29f': 'kokoa.png',
    '0x4fa62f1f404188ce860c8f0041d6ac3765a72e67': 'ksd.png',
    '0xdd483a970a7a7fef2b223c3510fac852799a88bf': 'mix.png',
    '0x5388ce775de8f7a69d17fd5caa9f7dbfee65dfce': 'kdon.png',
    '0x1e3a300601aa95ab7ea39bb72c3272716ef1426b': 'kstesla.svg',
    '0x5844b02cc0ab5d5a18be7dde4e245f5edec449ce': 'ksapple.svg',
    '0x3513b2bc58f1f260107fd1ee0dabb5b0637b9ed5': 'xe.png',
    '0xe7d3b78f032e70fabfdb8c0741ea74f775deb32d': 'ksta.svg',
    '0xfe4cd053f1e9200e784b7d60b54e6aa16e09406a': 'kqbt.png',
    '0x9cfc059f64d664f92f3d0329844b8ccca4e5215b': 'ijm_classic.jpeg',
    '0x7f1712f846a69bf2a9dbc4d48f45f1d52ca32e28': 'ufo.svg',
    '0xf445e3d0f88c4c2c8a2751180ae4a525789cfe32': 'bus.jpeg',
    '0xf87a3cf2f1dc059019455323edafb2667ea5cbe9': 'pics.svg',
    '0x02cbe46fb8a1f579254a9b485788f2d86cad51aa': 'bora.png',
    '0x96035fbdd4cb888862ee28c9d8fdadef78311cc9': 'mm.png',
    '0x11dc950ef29594cc19eb573811339df20c86c800': 'kdfa.svg',
    '0x52f4c436c9aab5b5d0dd31fb3fb8f253fd6cb285': 'kcbank.png',
    '0x18814b01b5cc76f7043e10fd268cc4364df47da0': 'ceik.png',
    '0x7f223b1607171b81ebd68d22f1ca79157fd4a44b': 'ct.png',
    '0x1d8246a6e73473ce4e21bc7e40bd5c3cef7930d5': 'tor.png',
    '0x2ef5f2642674f768b4efe9a7de470a6a68bcb8f3': 'bype.png',
    '0x36e936d5f4b6ab59f232da22ce53650dd80a4386': 'nwc.png',
    '0xd676e57ca65b827feb112ad81ff738e7b6c1048d': 'krno.svg',
    '0x8ff0586b6eea63a35e73d09237b4a58b3056f274': 'kbiot.png',
    '0x7a1cdca99fe5995ab8e317ede8495c07cbf488ad': 'pala.png',
    '0x9160421ea3d1a24101d985b026a60cb0442322cc': 'atten.png',
    '0xe815a060b9279eba642f8c889fab7afc0d0aca63': 'meta.svg',
    '0xb57e0038e8027c3de8126a07cac371f31c9c229e': 'akai.svg',
    '0x01cb8563e9c4703f4e6b9fa09edeaed0e5948f28': 'junb.svg',
    '0x210bc03f49052169d5588a52c317f71cf2078b85': 'kbusd.png',
    '0x36e5ea82a099e8188bd5af5709b23628076de822': 'kcake.svg',
    '0xf1ec6fc5b9f280ed43b45d2ba60874a77f343c60': 'kcyclub.png',
    '0x02e7d9ad54a19a9a0721d9515cf9f80f9547d771': 'kdg.png',
    '0x8bc28c926a0fe54b5c56a329cd3b129cc52ae099': 'kdotr.png',
    '0x2842a6d0c182e3f1cf4556311c48a7706d7ba6ad': 'kgala.png',
    '0x735106530578fb0227422de25bb32c9adfb5ea2e': 'kxvs.svg',
    '0x648fd38efefb4f97cf2df3ff93eff70e94da0691': 'mon.svg',
    '0x45dbbbcdff605af5fe27fd5e93b9f3f1bb25d429': 'mudol.svg',
    '0x37c38b19a6ba325486da87f946e72dc93e0ab39a': 'punk.svg',
    '0xe5bbe3aeb87e37a08fd4de05654095d25828f1ea': 'rrt.svg',
    '0x5fff3a6c16c2208103f318f4713d4d90601a7313': 'kleva.svg',
    '0xbc5d3fb02514f975060d35000e99c54253002bd4': 'kpace.svg',
    '0xcf87f94fd8f6b6f0b479771f10df672f99eada63': 'cla.png',
    '0x340073962a8561cb9e0c271aab7e182d5f5af5c8': 'nr.png',
    '0xd3c4242a175a9f6516d773e98f50576970e7e682': 'ggd.png',
    '0xd675dae87d8740b2163b4e232ee51a880495e6c7': 'junc.png',
    '0x8aa6b6b3d6cf0b20c922b626d55e60c7ea706648': 'noah.jpeg',
    '0x0a7356f5df9179c977d4ae5d285809a60f4797e4': 'gct.png',
    '0x95f04d09a8dc87edcf1ba6fed443993fa2466465': 'kpax.jpeg',
    '0xa23e07f7a61ce663b9ca6d6683acaaa28ec3070f': 'ktrv.png',
    '0x30763e9a3898b9a76d0a541380d927a50b9bbe81': 'danta.png',
    '0xad27ace6f0f6cef2c192a3c8f0f3fa2611154eb3': 'mpwr.png',
    '0x113e52528e5848e6ceceb3d8a8c4bd689f793469': 'stc.svg',
    '0xddc42416f16176d835311f710ee78aff63705b37': 'kapt.svg',
    '0x09df4d035b9c57be4fe5282ff63053a417d76d27': 'fleta.svg',
    '0x751899e974a98eaa03d57217414235fc041a6872': 'cherry.svg',
    '0x24703f8497412912106761210bdc30c44ee61b2f': 'kredit.png',
    '0x946bc715501413b9454bb6a31412a21998763f2d': 'klaybank.png',
    '0xdf9e1b5a30d6175cabaaf39964dd979e84753eb1': 'ins2.svg',
    '0x2b5d75db09af26e53d051155f5eae811db7aef67': 'kp.svg',
    '0xe1376ab327b6deb7bebaee1329eb94574d51a8d9': 'kps.svg',
    '0x8ef50fa375fc64b9815e51f28f4b83c05d57ac43': 'hook2.png',
    '0xcd42939dfb8d68ee53ba181704c9b6fe8d519c27': 'clock.png',
    '0xce40569d65106c32550626822b91565643c07823': 'kash.svg',
    '0xcd670d77f3dcab82d43dff9bd2c4b87339fb3560': 'eye.png',
    '0x8888888888885b073f3c81258c27e83db228d5f3': 'swapscanner.svg',
    '0x569f7a27bd82ac6b7027572ba4a416b492323194': 'gpoo.svg',
    '0x29435457053d167a2b1f6f2d54d4176866ffb5f9': 'compass.svg',
    '0x807c4e063eb0ac21e8eef7623a6ed50a8ede58ca': 'ekl.svg',
    '0x6cef6dd9a3c4ad226b8b66effeea2c125df194f1': 'azit.svg',
    '0x119883ee408aa5b9625c5d09a79fa8be9f9f6017': 'mkc.svg',
    '0xe43686e3a798741ea761cd8da6785e27b92ca623': 'hc.png',
    '0x923ff99c3ca96c77e4c111d80b71d2504c364f7a': 'kdrc.svg',
    '0x43de991a0d9b666a215f3eb5801accd260092c2c': 'ibp.png',
    '0x3247abb921c83f81b406e1a87fb7bfa6f79262d0': 'salt.svg',
    '0x46db825593ca7c3fdfc9ccb5850ea96c39b79330': 'ngit.png',
    '0xdabee145a1395e09280c23ea9aa71caca35a1ec0': 'nik2.png',
    '0xe0f2a679390efb0507ae8f99db4b7832202ac808': 'kids.png',
    '0x35f9e17f1a1d0ab6c3e43be8680952f7bda5305f': 'bs.png',
    '0x83c3b5a9a9d1f1438f2505ba972366eecfc4488e': 'golf.png',
    '0x76264ad1b50852c4d8efb55bfaf154dd5a80d0c2': 'jsd.png',
    '0x6f818355f9a64692905291e9a3c8f960edcf117d': 'btry.png',
    '0x4d87baa66061a3bb391456576cc49b77540b9aa9': 'DLP_logo_80x80.png',
    '0xe2541f0c54202fcdad60523fab8bfaa2d2540115': 'GAIA_logo_80x80.png',
    '0xc4edcfed08a169342b479578b01c77efe32630ec': 'GATO_logo_80x80.png',
    '0x0facf2288dd04707c8c9ae2353a5d92a220a0812': 'GRD_logo_80x80.png',
    '0xdcd9c56af7c05194d3a8c4187262130759e91320': 'LBK_logo_80x80.png',
    '0x07ffbdba745f3a98ec462385aedcdcd973021671': 'kstar.png',
    '0xd2137fdf10bd9e4e850c17539eb24cfe28777753': 'usdk.png',
    '0xfbd0314d55eab31c9fc0b2d162748017f1bc7b85': 'krome.png',
    '0x338d7933c367e49905c06f3a819cd60d541c9067': 'sst.png',
    '0x4836cc1f355bb2a61c210eaa0cd3f729160cd95e': 'ghub.svg',
    '0x78e5c7380cd1ecf27bb1234df7633d998eb71cfc': 'kop.jpeg',
    '0x8ea00f38b4bf5ed6997ba53769ff9cdd948e43bb': 'sym.svg',
    '0x5835cf38da6577230ceffd0d1c88171f1046fc88': 'pan.png',
    '0x8a14d0bde789e924ad255a82041c7f761d1c0029': 'aoa.png',
    '0x168439b5eebe8c83db9eef44a0d76c6f54767ae4': 'pusd.png',
    '0xd27a2f12dbf3d07b84232c69e43202b52098206c': 'korn.png',
    '0xe79efff8a61567d932be2a8c33057f7b2a8bc43b': 'favor.svg',
    '0x127a75b751ba810e459121af6207d83841c586b7': 'mesh.png',
    '0xd6243f133ebf7ea191fb0eb47017b809b46b15f1': 'ztc.svg',
    '0xc925f8da1b430334d15fbeba8896c98a098bafc3': 'aca.png',
    '0xce899f5fcf55b0c1d7478910f812cfe68c5bcf0f': 'abc.png',
    '0xe5f59ea8b7c9806dc84e8f0862e0f6176f2f9cf2': 'rstar.png',
    '0x5ab03cdb98ec84846a418d4c7cb1d481a1ef5818': 'cnt.svg',
    '0x6bae4b6afc2856b4ac0fb1165cf85c4923302ba2': 'plwi.svg',
    '0x07709260f6c431bc2cb1480f523f4f7c639a5155': 'blood.png',
    '0x94a2a6308c0a3782d83ad590d82ff0ffcc515312': 'sig.png',
    '0x23b40267e0c526fe4279e507e78d4aa7760d53e6': 'nice.png',
    '0x79bb4d71f6c168531a259dd6d40a8d5de5a34427': 'mard.png',
    '0xd742b1a5af898bcb4b6aff5027e6ab9adee97412': 'turnup.png',
    '0xfe16c99551fb4125cb6162e81048c0650db44266': 'kbi.png',
    '0x9a943f3f84afa673d2a7cf053b8192e372600f57': 'pom.png',
    '0xf092acc2412742f4d5a457799dea57155ed42f9c': 'mint.png',
    '0x17d30e878ba5a546c76fada32d7a30c876fadb49': 'tnt.jpeg',
    '0xfa86afa48e9306826010bc11977cfdb827c727dd': 'wrs.png',
    '0xaf89ca6f4ee85ff31dbe4df6bc50a2779f6ba820': 'jamba.png',
    '0x2b5065d6049099295c68f5fcb97b8b0d3c354df7': 'ict.png',
    '0x5d344cb62452fb1c01587ff85af9ffe7179397dc': 'noa.png',
    '0xfd7e99ab9822edc9b92e1f89a8a0b96a76e5740e': 'mshare.svg',
    '0xfbe0862f1591b2197bbb40970d99b8d20a57f8d5': 'kclank.png',
    '0xeddbbc44fe7cedaf0a2a7b40971a23dae82c1c8c': 'catc.png',
    '0x5afda70db64de4d5d24e4e87a40bc5f429736bc5': 'moneta.svg',
    '0xb1834e4e773a180168f2292e036ca8e17f86196f': 'fdm.png',
    '0x945f68b51cc51709f771e7104990b3f8a3c3ec79': 'drb.png',
    '0xaeeca95c899660dc74886168d0ffdebf3669179d': 'oxdt.png',
    '0xd01d650a5920fc714b2f8ed9d53e3ffc663302e9': 'odka.png',
    '0xd068c52d81f4409b9502da926ace3301cc41f623': 'mbx.svg',
    '0xdde2154f47e80c8721c2efbe02834ae056284368': 'imi.png',
    '0xa8598d1d1e6e5ecf03fc236df3561d276038c174': 'mon.png',
    '0x5ab30f1642e0aed47664635a305b9f778088b4cb': 'veve.jpeg',
    '0x9a8ce99db3c298b1f3fa0ffba752ba95157c6f76': 'vvcla.jpeg',
  };
  if (!n[addr]) {
    return undefined;
  }
  return `${CDN_URL}/token/${n[addr]}`;
};

export const update = async () => {
  const DEXATA_DATA_FILE_PATH = path.resolve(
    WORKSPACE_ROOT_PATH,
    './scripts/assets/raw/dexata.txt',
  );
  let data = await fs.readFile(DEXATA_DATA_FILE_PATH, 'utf8');
  let t = '',
    n = data.length;
  const klaytnTokens: {
    n: string;
    a: string;
    s: string;
    d: number;
    p: number;
    p24: number;
    v: number;
    ut: number;
  }[] =
    ((t =
      n <= 200
        ? data.split('').reverse().join('')
        : `${data.substring(n - 100, n)}${data.substring(
            100,
            n - 100,
          )}${data.substring(0, 100)}`
            .split('')
            .reverse()
            .join('')),
    JSON.parse(decodeURIComponent(Base64.decode(t).replace(/\+/gi, '%20'))));

  const tokens: TokenInput[] = klaytnTokens.flatMap((minToken) => {
    const token = {
      name: minToken.n,
      symbol: minToken.s,
      address: minToken.a,
      decimals: minToken.d,
    };
    if (token.address === '0x0000000000000000000000000000000000000000') {
      return [];
    }

    let wrappedAssetName: string = '';
    let wrappedAssetSymbol: string = '';
    let sp = token.name.split('Orbit Bridge Klaytn ');
    if (sp.length === 2) {
      wrappedAssetName = sp[1].split(' ')[0];
      wrappedAssetSymbol =
        token.symbol.split('o')[1] ?? token.symbol.split('K')[1] ?? '';
    } else {
      sp = token.name.split('Wrapped ');
      if (sp.length === 2) {
        wrappedAssetName = sp[1];
        wrappedAssetSymbol = token.symbol;
      }
    }
    let coinGeckoToken = coingeckoTokenList.find(
      (v) =>
        v.platforms['klay-token']?.toLowerCase() ===
        token.address.toLowerCase(),
    );

    MANUALLY_OVERRIDED_IDS.forEach(([addr, id]) => {
      if (token.address === addr) {
        coinGeckoToken = coingeckoTokenList.find((v) => v.id === id);
      }
    });

    if (!coinGeckoToken && !!wrappedAssetName) {
      coinGeckoToken = coingeckoTokenList.find(
        (v) =>
          v.name.toLowerCase().includes(wrappedAssetName.toLowerCase()) &&
          v.symbol.toLowerCase() === wrappedAssetSymbol.toLowerCase(),
      );
      if (!coinGeckoToken && !!wrappedAssetSymbol) {
        coinGeckoToken = coingeckoTokenList.find(
          (v) => v.symbol.toLowerCase() === wrappedAssetSymbol.toLowerCase(),
        );
      }
    }

    if (!!coinGeckoToken && !coinGeckoToken.platforms?.['klay-token']) {
      console.log(token, coinGeckoToken);
    }

    let tokenName = token.name;
    MANUALLY_OVERRIDED_NAMES.forEach(([addr, newName]) => {
      if (token.address === addr) {
        tokenName = newName;
      }
    });

    let coinGeckoId = coinGeckoToken?.id;
    MANUALLY_OVERRIDED_COINGECKO_IDS.forEach(([addr, coinGeckoId]) => {
      if (token.address === addr) {
        coinGeckoId = coinGeckoId;
      }
    });

    const tokenLogoURI = getTokenAddressImgURL(token.address);
    return {
      symbol: token.symbol.replace('$', ''),
      name: tokenName,
      decimals: token.decimals,
      address: token.address,
      coinGeckoId,
      logo: tokenLogoURI,
    };
  });

  for (const token of tokens) {
    if (!!token.coinGeckoId) {
      try {
        const { data } = await cachedAxios.get(
          `https://api.coingecko.com/api/v3/coins/${token.coinGeckoId}`,
        );
        token.logo = data?.image?.large ?? data?.image?.small ?? undefined;
      } catch (e) {
        console.error(e);
      }
    }
  }

  const CHAIN_OUTPUT_PATH = path.resolve(
    WORKSPACE_ROOT_PATH,
    './packages/bento-core/tokens/klaytn.json',
  );
  let previousTokens: TokenInput[] = [];
  try {
    previousTokens = JSON.parse(await fs.readFile(CHAIN_OUTPUT_PATH, 'utf8'));
  } catch {}
  const newTokens = tokens.reduce((acc, token) => {
    const prev = acc.find(
      (v) => v.address?.toLowerCase() === token.address?.toLowerCase(),
    );
    if (!prev) {
      acc.push(token);
    } else {
      // replace undefined values
      const index = acc.indexOf(prev);
      acc[index] = {
        ...acc[index],
        ...token,
        logo: acc[index].logo ?? token.logo,
      };
    }
    return acc;
  }, previousTokens);
  await fs.writeFile(
    CHAIN_OUTPUT_PATH,
    prettier.format(stringify(newTokens), { parser: 'json' }),
    'utf8',
  );
};
