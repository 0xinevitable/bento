# 🍱 Bento, The open-source web3 dashboard

> **This product is under rapid development and will be available during July 2022**<br />
> Follow us on [Twitter(@inevitable_odvw)](https://twitter.com/inevitable_odvw) for early access

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0) [![Twitter](https://img.shields.io/twitter/url/https/twitter.com/inevitable_odvw.svg?style=social&label=Follow%20%40inevitable_odvw)](https://twitter.com/inevitable_odvw)

[![Dashboard Preview](https://github.com/inevitable-changes/bento/blob/main/docs/images/dashboard-preview.png?raw=true)](https://twitter.com/inevitable_odvw/status/1540084741269254144)

## The Status Quo

- All **dashboard services** out there are either:
  - **Associated with specific Layer-1 chains built by the same team or shared VCs**
    - Timid movement outside of their current eco
  - **Maintained as close source software; Development is centralized to the team**
    - If you want your protocol listed, you have to depend on the team to add support

## Mission

- Make **every user track every asset they own,** regardless of chains and types
- Make **any builder add support** for their protocol/app freely
- Provide **social profiles** based on web3

## Community & Contribution
- Add questions via [GitHub Issues](https://github.com/inevitable-changes/bento/issues), or by mentioning our [Twitter](https://twitter.com/inevitable_odvw)(we reply quite fast!).
- Discord community coming soon.

## 🚀 Preparing Local Dev Environment

```bash
git clone https://github.com/inevitable-changes/dashboard
cd dashboard
yarn install
```

- First, clone this repo.
- Since we're using [Zero-Install](https://yarnpkg.com/features/zero-installs) through Yarn Berry's Plug'n'Play, the repository's initial clone size might be significantly larger than you think.

```js
{
  "CMC_PRO_API_KEYS": [""],
  "COVALENT_API_KEYS": [""],
  "RPC_URL": { ... },
  "STORAGE": { ... }
}
```

- Copy `src/config/secrets.example.json` inside `@bento/common` to `src/config/secrets.json` and fill in the contents.

```bash
yarn workspace @bento/common build
yarn workspace @bento/client build
yarn workspace @bento/core build
```

- The Entire project is managed as a monorepo using Yarn Workspaces, so you must build the dependencies first.
- TIP: You don't have to turn off the `@bento/web` development server when you have modifications to local modules. Just build them right away, and it'll automatically reload. Still, it requires a restart when there are dependency changes.

```bash
yarn workspace @bento/web dev
```

- Finally, we start the development server. By default, the port is set to `3000`.

## Licensing

<img align="right" src="http://opensource.org/trademarks/opensource/OSI-Approved-License-100x137.png">

- All our branding resources(such as trademarks, assets, and design, "Assets") are copyright of Inevitable, all rights reserved.

- Other third-party Assets included in this repository are the copyright of their rightful owners.

- The project is licensed under the [Mozilla Public License Version 2.0](https://opensource.org/licenses/MPL-2.0). You must notice this license and copyright notice if you use this work. This also means that you'll have to notify changes and open-source your work(the modified software) in the same license(or, in certain cases, one of the GNU licenses):

**Copyright (c) 2022 Inevitable**
