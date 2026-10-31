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
  - label: Releases on GitHub
    url: https://github.com/NickDevoctomy/LlamaWebUI/releases
    icon: github    
skills: ["Python", "TypeScript", "LLM"]
# The Markdown below is the write-up on the project's own page. Its `##` and `###`
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

One feature I was keen to add to this application was an AI assistant that can operate the application, download models, create profiles, benchmark them, optimise the profiles and create reports of its findings. Once you have configured a valid OpenRouter access token you will have access to the 'Assistant' button via the left-side navigation menu and have access to this very feature set.

![Lama AI Assistant](/assets/img/screenshots/llamawebui-assistant1.png)

Lama, the AI assistant built into LlamaWebUI will happily chug away for hours, tweaking your profiles, running benchmarks and comparing run statistics in order to find the most optimal settings for your system. If it doesn't understand anything, it will perform research and create research documents which can then be used by other Lama sessions.

This whole process can be done via inexpensive models, such as Qwen 3.8 Omni Flash, or Gemini 3.8 Flash. I've run many assisted optimisation runs while testing and never even come close to the default spend cap of $2. With that said, it's still advised that you restruct the spend on your API tokens just incase.

In terms of real world results, I've had it boost token generation by 10~ tp/s on the 2 machines I have so I know that it works. 

### User Management

Users can be easily managed via UI, allowing you to setup access with a strict set of access priviledges. Allowing you to decide who can download new models / runtimes into the server, create new profiles, use the assistant etc. 

Of course the primary use case for LLamaWebUI is serving models using llama-server by generating Access keys, which you can then use from another machine on your network using an agentic harness, such as opencode (recommended).

An example of such a configuration would be,

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "llamawebui": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "http://192.168.1.69:1234/v1",
        "apiKey": "{env:LLAMA_WEB_UI_API_KEY}"
      },
      "models": {
        "qwen3.8-flash-next": {
          "name": "Qwen3.8 Flash Next",
          "reasoning": true,
          "options": { "reasoningEffort": "medium" },
          "variants": {
            "off":    { "reasoningEffort": "none" },
            "low":    { "reasoningEffort": "low" },
            "medium": { "reasoningEffort": "medium" },
            "max":    { "reasoningEffort": "xhigh" }
          }		  
        }
      }
    }
  },
  "model": "llamawebui/qwen3.8-flash-next",
}
```

> The above example requires that you store your generated API key (from LLamaWebUI) in an environment variable 'LLAMA_WEB_UI_API_KEY'. This way it is not directly entered into the configuration file.

![Access Keys Configuration](/assets/img/screenshots/llamawebui-accesskeys1.png)

![User Configuration](/assets/img/screenshots/llamawebui-users1.png)

![Role Configuration](/assets/img/screenshots/llamawebui-addrole1.png)

### Dashboard

The dashboard in LlamaWebUI takes inspiration from a host of different applications which allow you to serve LLM models locally, offering information critical to getting the most out of your system. Token rates, memory usage breakdowns, system resources over time etc.

![Dashboard](/assets/img/screenshots/llamawebui-dashboard1.png)

### Releases

LlamaWebUI is available for download as a release, which are packaged as a compiled executable with a single dependent directory. Just unzip the release and run the executable with your required arguments. Personally I would recommend creating a powershell script to startup the application with, something like this,

```
$env:LLAMAWEBUI_HOST = '127.0.0.1'
$env:LLAMAWEBUI_PORT = '8080'
$env:LLAMAWEBUI_ROUTER_HOST = '127.0.0.1'
$env:LLAMAWEBUI_ROUTER_PORT = '1234'
$env:LLAMAWEBUI_DATA_DIR = 'C:\LlamaWebUI\data'

.\llamawebui.exe serve
```

> Changing the IP addresses in the above script to '0.0.0.0' would serve LlamaWebUI on your local network which requires the generation of at least 1 Access Token. It is recommended you try it out on localhost first, create your access token, and then serve on the network if you wish to access from another machine.

The pre-compiled releases are currently only available as windows x64 builds, if anyone shows interest in this application I may create other targets in the future.

[LlamaWebUI Releases on GitHub](https://github.com/NickDevoctomy/LlamaWebUI/releases)