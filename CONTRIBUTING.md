# Contributing

Thank you for being interested in contributing to the DX Backstage plugin!

## Developing locally

### Requirements

- [Node](https://nodejs.org/en) >= 20.0.0
- [Yarn](https://yarnpkg.com/)
- [Yalc](https://github.com/wclr/yalc)
- [Watchexec](https://github.com/watchexec/watchexec) (recommended)

### First-time setup

- Clone the repository.

- Enter the repository directory.

- Install dependencies:

  ```shell
  yarn install
  ```

### Developing with the dev server (easiest)

This will start a local dev server showing the UI of this component. See `dev/index.tsx` for setup.

- Run the following:

  ```shell
  yarn start
  ```

### Developing with your own Backstage instance (recommended)

This workflow depends on installing your local working copy of `@get-dx/backstage-plugin` into your Backstage instance using [`yalc`](https://github.com/wclr/yalc).

#### Setup

In backstage-plugin repo:

```shell
yarn build && yalc publish
```

In your backstage instance repo, `packages/app` directory:

```shell
yalc add @get-dx/backstage-plugin
```

Then run the backstage instance dev server.

#### Iteration loop

You can do a `yalc publish` from one repo and `yalc update` in the other, but that's a lot of manual back-and-forth.

For a more seamless experience, we recommend installing [`watchexec`](https://github.com/watchexec/watchexec).

In the backstage-plugin repo, run:

```shell
watchexec --watch src 'yarn build && yalc publish --push --changed'
```

Now, whenever you save changes in the `src` directory of the backstage-plugin repo, they will be picked up by your backstage instance's dev server.

#### Switching back to the released package version

In your backstage instance repo, `packages/app` directory, revert the working copy changes to `package.json` and `yarn.lock`. Then run:

```shell
yarn install
```

This will install the `@get-dx/backstage-plugin` package from the npm registry like normal.

## Publishing (for maintainers)

- Update [CHANGELOG.md](./CHANGELOG.md) with release notes.

- Edit the version number in `package.json`:

  ```diff
   {
     "name": "@get-dx/backstage-plugin",
  -  "version": "1.0.0",
  +  "version": "1.1.0", (Insert whatever version is appropriate according to semver)
   ...
   }
  ```

  - Submit a PR and merge the changes to the `main` branch.

  - The [Publish Package action](https://github.com/get-dx/backstage-plugin/actions/workflows/publish.yaml) will run based off of the new commit on the `main` branch, but the workflow will be in a pending state until approved.

  - Reach out to the team's Tech Lead to approve the deployment in GitHub. This will cause the workflow to fully run and publish the new version to NPM. Once the workflow is complete, the new version will be visible in the [package's versions tab](https://www.npmjs.com/package/@get-dx/backstage-plugin?activeTab=versions).
