---
name: llamawebui
# Projects are listed by `order`, lowest first.
order: 1
status: Released
# One or two sentences: shown on the projects page, under the name on the
# project's own page, and in search and social previews.
description: "A web front-end for llamacpp. Easily configure and optimise profiles tailored to your requirements."
# Shown as buttons. `icon` is a name from _includes/icon.html.
links:
  - label: GitHub
    url: https://github.com/NickDevoctomy/LlamaWebUI
    icon: github
skills: ["Python", "TypeScript", "LLM"]
# The Markdown below is the write-up on the project's own page. Its `##`
# headings become the page's contents list.
---

> 🤖 This application is built primarily via the use of agentic coding tools. While a reasonable amount of care and attention has been put into making sure it does what I need it to do, it was developed primarily for me to use personally. As a result, the quality of the software is not exactly exception and you should expect there to be bugs. Please do not use this for anything important and do not expose it to the public internet as it likely contains security issues. Use at your own risk.

## Overview

LlamaWebUI is a web front-end for [llamacpp](https://llama-cpp.com/) (llama-server). The intention is to do away with having to manually work out the best command line arguments to use for your system. Instead LlamaWebUI offers an array of features that make profile creation, sharing, benchmarking and even optimisation a breeze.

### Runtimes

Built to support llama-server, this Web UI supports all official releases as well as any custom builds / forks as long as they haven't deviated too much from the way llama-server is operated. The UI offters an easy way to download a release straight into the apps data directory and have it ready for use in seconds.

If you have a custom build you're working on, there are even debug profiling capabilities build into LlamaWebUI that allow you to easily capture CPU call stacks and/or CUDA kernel graphs. If you're trying to make some tweaks, and add new functionality to llama-server this may be of use to you.

### Profiles

Create your own profiles using a simplified profile editor which catalogues all of the various command line arguments for llama-server, and trust me there are a lot. Each argument has been categorised and described via reference to official documentation as well as llama-server's very own --help command.

![Profile Editor](/assets/img/screenshots/llamawebui-profileeditor1.png)

![Profile Editor Settings Search](/assets/img/screenshots/llamawebui-profileeditor2.png)

#### Recommended Profiles

For super quick deployment of a new model I am also adding recommended profiles, allowing you to find a model, select the variant you want that matches your hardware and quickly deploy it to your system for use.

> You'll have to bear with me on this one as at the moment I'm only creating profiles I can actually use on my machine, but if you have profiles that you'd like to share, please do. I'll get in a feature that lets you just add a git repository of profiles, then you will be able to share to hearts delight; without having to wait on me.

### Benchmarking

Run simple or complex benchmarks, using a selection of simple tools. This feature allows you to very quickly test the effectiveness of a model / profile based on your actual use cases. At current you can only run the benchmarks that have been bundled into the UI, but I will extend this feature in due-course to allow for custom benchmarks to easily be added into the system, in the same way that I intend to get recommended profiles customisable.

![Detailed Benchmark Analysis](/assets/img/screenshots/llamawebui-benchmark1.png)

![Benchmark Result Previewing](/assets/img/screenshots/llamawebui-benchmark2.png)

### Assistant

... more information to come ...

### User Management

... more information to come ...

### Dashboard

... more information to come ...