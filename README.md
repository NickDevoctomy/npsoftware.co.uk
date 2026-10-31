# npSoftware.co.uk

Source for [www.npsoftware.co.uk](https://www.npsoftware.co.uk), built with [Eleventy](https://www.11ty.dev/).

## Setting up WSL (Ubuntu)

Install Node.js 22 or later (see `.nvmrc`), for example from the distro or with [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install
```

Then install the dependencies:

```bash
npm ci
```

## Building and previewing

```bash
npm run build   # output in _site/
npm run serve   # http://localhost:8080, rebuilds on change
npm run compare # compare _site/ with the live site
```

`npm run compare -- <url or directory>` compares against another copy of the site instead. It ignores differences a browser wouldn't show, such as whitespace and entity encoding.

## Writing a post

```bash
./initpost.sh -c My New Post Title
```

This creates `_posts/YYYY-MM-DD-my-new-post-title.md` with the front matter filled in. The post's URL is its file name without the date, e.g. `/my-new-post-title/`.

## Updating dependencies

```bash
npm outdated
npm install --save-exact <package>@<version>
npm run build
npm run compare
```

Commit the updated `package.json` and `package-lock.json`.

## Deployment

- `.github/workflows/build.yml` builds every push and pull request. It never deploys.
- `.github/workflows/deploy.yml` deploys the head of `main`. It's started by hand and refuses to run from any other branch. It works out the next release tag (`vYYYY.MM.DD`, then `.1`, `.2`… for later releases the same day), builds the site with that version in the footer, publishes a GitHub release for it, syncs `_site/` to S3 and invalidates CloudFront.

To release, merge your PR into `main`, then go to **Actions → Deploy → Run workflow** and run it on `main`. Don't create tags or releases by hand.
