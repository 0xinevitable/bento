# 🍱 Bento, The open-source web3 dashboard

![Dashboard Preview](https://github.com/inevitable-changes/bento/blob/main/docs/images/dashboard-preview.png?raw=true)

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

## 🚀 Preparing Local Dev Environment

```bash
git clone https://github.com/inevitable-changes/dashboard
cd dashboard
yarn install
```

- First, clone this repo.
- Since we're using [Zero-Install](https://yarnpkg.com/features/zero-installs) through Yarn Berry's Plug'n'Play, the repository's initial clone size might be larger than you may think.

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
