# 🍱 Bento, The open-source web3 dashboard

## 🚀 Preparing Local Dev Environment
```bash
git clone https://github.com/inevitable-changes/dashboard
cd dashboard
yarn install
```
First, clone this repo.
Since we're using [Zero-Install](https://yarnpkg.com/features/zero-installs) through Yarn Berry's Plug'n'Play, the repository's initial clone size can be larger than you think.

```bash
yarn workspace @bento/core build
```

The Entire project is managed as a monorepo using Yarn Workspaces.
So the `@bento/core` module must be built first. If there are any modifications to `@bento/core,` you don't have to turn off the `@bento/web` development server—just build it right away, and it will reload itself(still, it might require a restart when there are dependency changes).

```bash
yarn workspace @bento/web dev
```

Finally, we start the development server. By default, the port is set to `3000`.
