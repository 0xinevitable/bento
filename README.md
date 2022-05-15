# Multichain Dashboard

- 체인별로 데이터랑 서비스가 분산화되어 있음.
- 대시보드 같은 제품이 하나 나와도 특정 체인에서 나오거나, 체인이나 플랫폼을 미는 VC에서 투자받으니까, 서비스가 특정 체인에만 귀속될 수밖에 없음

## References

대시보드 하는 애들(심심할 때 위에서 세 개만 보면 될 듯)

- [Apeboard](https://apeboard.finance/)
- [Zapper.fi](https://zapper.fi/)
- [Keplr](https://www.keplr.app/)
- [DeBank](https://debank.com/)
- [Zerion](https://zerion.io/)

## Milestones

3.0 까지 올해 안에 해보는 게 목표

### 1.0

- 사용자는 주소 여러 개를 하나의 계정에 연동할 수 있습니다.
- 사용자는 연결한 모든 계정들의 **네이티브 토큰** 의 잔액을 한눈에 볼 수 있습니다.

### 2.0

- 사용자는 각각의 체인(플랫폼) 위에 있는 여러 토큰의 잔액을 함께 볼 수 있습니다.

### 3.0

- 트랜잭션 라벨링 → 사용자 특성 도출
- 프로필 기능

### 4.0

- 타인의 투자 포트폴리오 유동화

## 체인(Chains)

### EVM

- 이더리움, 폴리곤, 아발란체, 클레이튼 등 EVM(이더리움 가상 머신) 기반 블록체인
- 토큰
  - 네이티브 토큰(Currency)이 네트워크별로 한 개
    - 이더리움(ETH), 폴리곤의 매틱(MATIC), 아발란체(AVAX), 클레이튼(KLAY)
  - 다른 토큰들은 `ERC20` 표준에 맞게 구현/배포된 컨트랙트의 상태로 정의됨

### Tendermint

- [텐더민트 기반](https://academy.binance.com/ko/articles/tendermint-explained) 블록체인. Cosmos SDK 쓰는 애들
- 코스모스 허브(Cosmos Hub), 오스모시스(Osmosis), ~~테라(Terra, 뒤짐)~~ 등

- 토큰

  - 네이티브 토큰이 체인마다 여러 개 있을 수 있음
    - 코스모스 허브의 아톰(ATOM), 오스모시스의 오스모(OSMO) 그리고 아이온(ION)
    - ~~뒤진~~ 테라 같은 경우에는 LUNA, UST, KST, ... 등등 스테이블코인들이 모두 네이티브로 구현되어 있음
  - 다른 토큰들은 `CW20` 표준에 맞게 구현/배포된 컨트랙트의 상태로 정의됨
  - 네이티브 토큰과 다른 토큰은 `IBC` 를 통해 다른 Cosmos SDK 기반 체인으로 이동이 가능하다.
    - 즉 코스모스 허브의 아톰(ATOM)이 오스모시스 체인으로 이동할 수 있다.

- [ADR-036](https://docs.cosmos.network/master/architecture/adr-036-arbitrary-signature.html)
  - 하나의 주소가 다른 Cosmos SDK 기반 체인별로 호환됨
    - `cosmos15zysaya5j34vy2cqd7y9q8m3drjpy0d2hhgxh0`
    - `osmo15zysaya5j34vy2cqd7y9q8m3drjpy0d2lvmkpa`

### Others

솔라나 등
