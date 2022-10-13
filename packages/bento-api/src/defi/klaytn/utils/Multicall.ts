// Soon be published on NPM; https://github.com/junhoyeo/klaytn-multicall/blob/main/index.ts
import Caver, { Contract } from 'caver-js';

const MULTICALL_ABI: any[] = [
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'target', type: 'address' },
          { internalType: 'bytes', name: 'callData', type: 'bytes' },
        ],
        internalType: 'struct Multicall2.Call[]',
        name: 'calls',
        type: 'tuple[]',
      },
    ],
    name: 'aggregate',
    outputs: [
      { internalType: 'uint256', name: 'blockNumber', type: 'uint256' },
      { internalType: 'bytes[]', name: 'returnData', type: 'bytes[]' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const MULTICALL_ADDRESS = {
  cypress: '0xd11dfc2ab34abd3e1abfba80b99aefbd6255c4b8',
};

export type MulticallOptions = {
  provider: Caver;
  multicallV2Address?: string;
};

export class Multicall {
  provider: Caver;
  multicall: Contract;
  multicallV2Address: string;

  constructor(options: MulticallOptions) {
    this.provider = options.provider;
    this.multicallV2Address =
      options.multicallV2Address || MULTICALL_ADDRESS.cypress;
    this.multicall = new this.provider.klay.Contract(
      MULTICALL_ABI,
      this.multicallV2Address,
    );
  }

  aggregate = async (calls: any[]): Promise<any[]> => {
    const callRequests = calls.map((call) => ({
      target: call._parent._address,
      callData: call.encodeABI(),
    }));

    const { returnData } = await this.multicall.methods
      .aggregate(callRequests)
      .call();

    const output = returnData.map((hex: string, index: number) => {
      const types = calls[index]._method.outputs.map((o: any) =>
        o.internalType !== o.type && o.internalType !== undefined ? o : o.type,
      );

      const result = Caver.abi.decodeParameters(types, hex);
      return Object.values(result);
    });

    return output;
  };
}
