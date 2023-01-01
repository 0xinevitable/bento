<p align="center">
  <a href="https://bento.finance">
    <img alt="Bento" src="https://raw.githubusercontent.com/inevitable-changes/bento/develop/apps/web/public/android-chrome-512x512.png" height="128" />
  </a>
  <h1 align="center">
    Bento, the Open-Source Web3 Dashboard
  </h1>
</p>

<p align="center">
  <a href="https://bento.finance">
    <img alt="GitHub deployments" src="https://img.shields.io/github/deployments/inevitable-changes/bento/production?color=%23000000&label=deploy&logo=Vercel&logoColor=white&style=for-the-badge&labelColor=000" />
  </a>
  <a href="https://opensource.org/licenses/MPL-2.0">
    <img alt="License: MPL 2.0" src="https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg?style=for-the-badge&labelColor=000" />
  </a>
  <a href="https://twitter.com/bentoinevitable">
    <img alt="Twitter" src="https://img.shields.io/badge/Follow%20on%20Twitter-1DA1F2.svg?style=for-the-badge&logo=twitter&labelColor=000000&logoWidth=20&logoColor=white" />
  </a>
  <a href="https://discord.gg/zXmRRBxYqD">
    <img alt="Discord" src="https://img.shields.io/discord/1025289479059157012?style=for-the-badge&label=&labelColor=000&logo=discord&logoColor=fff&color=7289da" />
  </a>
</p>

> **Note**<br/>
> LIVE at [bento.finance](https://bento.finance) ⚡️

> **Warning**<br/>
> This product is still under rapid development 🛠

[![Group wallets across all chains. Bento — the Web3 Dashboard Built as Open Source.](https://github.com/inevitable-changes/bento/blob/develop/apps/web/public/assets/og-image.jpg?raw=true)](https://bento.finance)

## 🚀 Preparing Local Dev Environment

```bash
git clone https://github.com/inevitable-changes/bento
cd bento
yarn
```

First, clone this repo.

```env
ENVIRONMENT=debug
MAIN_API_BASE_URL=https://www.bento.finance
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
NEXT_PUBLIC_OPENSEA_API_KEYS=
NEXT_PUBLIC_CMC_PRO_API_KEYS=

COVALENT_API_KEYS=
SLACK_NEW_PROFILE_WEBHOOK=
SUPABASE_SERVICE_KEY=
REDIS_URL=
```

Copy `.env.example` inside `@bento/api`(`apps/api/.env.*`) and `@bento/web`(`apps/web/.env.*`) and fill in the contents.

```bash
yarn build
```

We're using [Turborepo](https://turbo.build/repo) with Yarn Workspaces.

```bash
yarn workspace @bento/web dev
```

Finally, we start the development server. By default, the port is set to `3000`.

## 🏛️ Licensing

<img align="right" src="http://opensource.org/trademarks/opensource/OSI-Approved-License-100x137.png">

- All our branding resources(such as trademarks, assets, and design) are copyright of Inevitable, all rights reserved. Other third-party assets and branding elements included in this repository are the copyright of their rightful owners.

- The project is licensed under the [Mozilla Public License Version 2.0](https://opensource.org/licenses/MPL-2.0). You must include this license and copyright notice if you use this work. This also means that you'll have to notify changes and open-source your work(the modified software) in the same license(or, in certain cases, one of the GNU licenses).

**Copyright (c) 2023 Inevitable**
