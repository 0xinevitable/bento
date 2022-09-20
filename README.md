# 🍱 Bento, The open-source web3 dashboard

> **LIVE at [https://bento.finance](https://bento.finance), This product is still under rapid development 🎉**<br />
> Follow us on [Twitter(@bentoinevitable)](https://twitter.com/bentoinevitable) for updates!

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0) [![Twitter](https://img.shields.io/twitter/url/https/twitter.com/bentoinevitable.svg?style=social&label=Follow%20%40bentoinevitable)](https://twitter.com/bentoinevitable)

|                                                                                                    Bento Profiles                                                                                                     |                                                                                           Cover Artwork                                                                                            |                                                                                      Dashboard Preview                                                                                       |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <a href="https://bento.finance/profile/intro"><img width="500" alt="Bento Profiles" src="https://raw.githubusercontent.com/inevitable-changes/bento/main/packages/bento-web/public/assets/profile/og-image.png"/></a> | <a href="https://bento.finance"><img width="500" alt="Cover Artwork" src="https://raw.githubusercontent.com/inevitable-changes/bento/main/packages/bento-web/public/assets/og-image-v3.png" /></a> | <a href="https://bento.finance/home"><img width="500" alt="Dashboard Preview" src="https://raw.githubusercontent.com/inevitable-changes/bento/main/docs/images/dashboard-preview.png" /></a> |

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

- Add questions via [GitHub Issues](https://github.com/inevitable-changes/bento/issues), or by mentioning our [Twitter](https://twitter.com/bentoinevitable)(we reply quite fast!).
- Discord community coming soon.

## 🚀 Preparing Local Dev Environment

```bash
git clone https://github.com/inevitable-changes/bento
cd bento
git submodule update --init --recursive
yarn install
```

- First, clone this repo.
- Install private submodules(We'll soon make the project buildable for external users without access).
- Since we're using [Zero-Install](https://yarnpkg.com/features/zero-installs) through Yarn Berry's Plug'n'Play, the repository's initial clone size might be significantly larger than you think.

```env
ENVIRONMENT=development
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SLACK_NEW_PROFILE_WEBHOOK=
NEXT_PUBLIC_OPENSEA_API_KEYS=
NEXT_PUBLIC_COVALENT_API_KEYS=ckey_xxx:,ckey_xxx:
NEXT_PUBLIC_CMC_PRO_API_KEYS=
```

- Copy `.env.example` inside `@bento/web` to `.env.debug.local`/`.env.development.local` and fill in the contents.

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

## Production Deployment

Since this project uses [`vercel-submodules`](https://github.com/junhoyeo/vercel-submodules), we have our custom `Install Command` set in Vercel:

```bash
npx vercel-submodules --paths packages/bento-private packages/linky-profile-engine && yarn install
```

## 🏛️ Licensing

<img align="right" src="http://opensource.org/trademarks/opensource/OSI-Approved-License-100x137.png">

- All our branding resources(such as trademarks, assets, and design, "Assets") are copyright of Inevitable, all rights reserved. Other third-party Assets included in this repository are the copyright of their rightful owners.

- The project is licensed under the [Mozilla Public License Version 2.0](https://opensource.org/licenses/MPL-2.0). You must include this license and copyright notice if you use this work. This also means that you'll have to notify changes and open-source your work(the modified software) in the same license(or, in certain cases, one of the GNU licenses).

**Copyright (c) 2022 Inevitable**
