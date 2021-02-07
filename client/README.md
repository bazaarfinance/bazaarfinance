## Bazaar Finance Client

### Running the frontend client locally

From this directory, run `yarn react-app:start` to start the client on localhost:3000. The page will
automatically reload if with changes to the code. Build errors and lint warnings are in the browser
console.

### Deploying the frontend client on github.io

To run the frontend on github.io, github.io will need to serve the code that has been built in the
`client/packages/react-app/build` directory. To make this happen do the following:

#### Initial Setup

1. Add the `gh-pages` package:

```
cd client/packages/react-app && yarn add gh-pages -D
```

1. Remove `build/` from `client/packages/react-app/.gitignore` so that the built client code will
   get checked in.
1. Make sure git knows about the new subtree:

```
git add client/packages/react-app/build && git commit -m "Initial build subtree commit"
```

3. Use git's `subtree push` from the repo's base dir to push the subtree branch to a `gh-pages`
   branch on GitHub:

```
git subtree push --prefix client/packages/react-app/build origin gh-pages
```

### Updating frontend client on github.io

1. From any branch you hvae checked out that has frontend changes you want to from the repo's root
   dir run:

```
yarn deploy:frontend
```

This updates the `gh-pages` branch and goes live on github.io

### Ssetting Custom URL

For the github.io page read here:
https://docs.github.com/en/github/working-with-github-pages/configuring-a-custom-domain-for-your-github-pages-site

1. Follow the steps there for how to setup your domain.
2. Create a CNAME file in `client/packages/react-app/` that contains the CNAME of the desired
   domain. Edit `client/packages/react-app/package.json` and set `"homepage": "CNAME_OF_CUSTOM_URL"`
3. Setup a `predeploy` task `client/packages/react-app/package.json` to copy the CNAME file to the
   build dir. See here:
   https://github.com/bazaarfinance/bazaarfinance/blob/gh-pages-new-client-frontend/client/packages/react-app/package.json#L53

And done!
