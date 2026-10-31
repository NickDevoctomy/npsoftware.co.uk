---
name: clypse
# Projects are listed by `order`, lowest first.
order: 1
status: Work in progress
# One or two sentences: shown on the projects page, under the name on the
# project's own page, and in search and social previews.
description: "A self-hosted, serverless password manager that lives in your own Amazon S3 bucket. Super easy, and super cheap."
# Shown as buttons. `icon` is a name from _includes/icon.html.
links:
  - label: GitHub
    url: https://github.com/devoctomy/clypse
    icon: github
skills: ["Amazon S3", "Amazon Cognito", "AWS IAM", "Amazon CloudFront", "Serverless", "Cryptography"]
# The Markdown below is the write-up on the project's own page. Its `##` and `###`
# headings become the page's contents list.
---
## Overview

Clypse is a complete password management system that you host yourself in Amazon S3 that I am currently working on.

It's completely 'serverless', static website with some additional Cognito configuration for user management. Super easy, and super cheap.

> Once complete it will be easy to setup your own clypse system which can handle many users, all you will require is an AWS account.

### How it works

clypse is built as a Blazor WASM static website, which can be installed to your device as a PWA (Personal Web App), with integration points in the frontend to a few key serverless AWS technologies,

* **Cognito** - Provides user access management and login. Once logged in the user is provided with a set of AWS credentials that allow them read/write access to their own user area of the S3 data bucket. The credentials do not perform any kind of encryption / decryption, that is done via a separate mechanism.
* **S3** - User data files are stored in S3, but are subjected to a secondary layer of encryption, above what the S3 bucket itself is configured to perform. Files are encrypted / decrypted in the browser using the users passphrase which never leaves their system using Argon2id.

> ⚠️ clypse is currently undergoing some major changes which make me reluctant to provide too much information here just yet as it's subject to change. I am currently developing a new underlying framework for creating static web apps with cloud syncing and security built-in. That will become the new basis of clypse and will be even easier to deploy and manage, you'll even be able to make your own apps using that very framework.
