<p align="center">
  <a href="https://bento.finance">
    <img alt="Bento" src="https://raw.githubusercontent.com/inevitable-changes/bento/develop/apps/web/public/android-chrome-512x512.png" height="128" />
  </a>
  <h1 align="center">
    Bento, The open-source web3 dashboard
  </h1>
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjunhoyeo%2Fparacosm">
    <img alt="GitHub deployments" src="https://img.shields.io/github/deployments/junhoyeo/paracosm/production?color=%23000000&label=deploy&logo=Vercel&logoColor=white&style=for-the-badge&labelColor=000" />
  </a>
  <a href="https://opensource.org/licenses/MPL-2.0">
    <img alt="License: MPL 2.0" src="https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg?style=for-the-badge&labelColor=000" />
  </a>
  <a href="https://twitter.com/bentoinevitable">
    <img alt="Twitter" src="https://img.shields.io/badge/Follow%20on%20Twitter-1DA1F2.svg?style=for-the-badge&logo=twitter&labelColor=000000&logoWidth=20&logoColor=white" />
  </a>
</p>

> **LIVE at [https://bento.finance](https://bento.finance), This product is still under rapid development 🛠**

## 🚀 Preparing Local Dev Environment

```bash
git clone https://github.com/inevitable-changes/bento
cd bento
yarn
```

- First, clone this repo.
- Since we're using [Zero-Install](https://yarnpkg.com/features/zero-installs) through Yarn Berry's Plug'n'Play, the repository's initial clone size might be significantly larger than you think.

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

- Copy `.env.example` inside `@bento/api`(`apps/api/.env.*`) and `@bento/web`(`apps/web/.env.*`) and fill in the contents.

```bash
yarn build
```

- We're using [Turborepo](https://turbo.build/repo) with Yarn Workspaces.

```bash
yarn workspace @bento/web dev
```

- Finally, we start the development server. By default, the port is set to `3000`.

## 🏛️ Licensing

<img align="right" src="http://opensource.org/trademarks/opensource/OSI-Approved-License-100x137.png">

- All our branding resources(such as trademarks, assets, and design) are copyright of Inevitable, all rights reserved. Other third-party assets and brand logos included in this repository are the copyright of their rightful owners.

- The project is licensed under the [Mozilla Public License Version 2.0](https://opensource.org/licenses/MPL-2.0). You must include this license and copyright notice if you use this work. This also means that you'll have to notify changes and open-source your work(the modified software) in the same license(or, in certain cases, one of the GNU licenses).

**Copyright (c) 2022 Inevitable**
