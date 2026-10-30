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
# The Markdown below is the write-up on the project's own page. Its `##`
# headings become the page's contents list.
---
## Overview

Clypse is a complete password management system that you host yourself in Amazon S3. It's completely serverless, hosted as a static website with some additional Cognito configuration for user management. Super easy, and super cheap.

It's designed to use the latest cryptographic standards, but also to be highly customisable.

## How it works

It uses a few other AWS serverless technologies to make the system a reality, including Cognito, IAM and CloudFront. It's still a work in progress, but the software is completely open source.

## What's next

I'm currently developing a new underlying framework for creating static web apps with cloud syncing and high security built in. It isn't open just yet, but watch this space, as it will be available soon.
