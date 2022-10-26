declare module 'compressed-json' {
  export module compress {
    export function toString<T extends any>(obj: T): string;
  }
  export module decompress {
    export function fromString<T extends any>(obj: string): T;
  }
}
