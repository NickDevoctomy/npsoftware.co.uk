---
name: fusewalk
# Projects are listed by `order`, lowest first.
order: 2
status: Released
# One or two sentences: shown on the projects page, under the name on the
# project's own page, and in search and social previews.
description: "A word game where you combine 2 words to create 1 or more new words. A fine tuned AI model is run locally for recipes not bundled with the game, opening a whole world of possibilities."
# Shown as buttons. `icon` is a name from _includes/icon.html.
links:
  - label: GitHub
    url: https://github.com/devoctomy/clypse
    icon: github
  - label: Releases on GitHub
    url: https://github.com/NickDevoctomy/fusewalk/releases
    icon: github    
skills: ["Python", "Flutter", "LLM", "Fine-tuning", "HuggingFace", "Qwen"]
# The Markdown below is the write-up on the project's own page. Its `##` and `###`
# headings become the page's contents list.
---

> 🤖 This application is engineered via the use of agentic coding tools, such as Claude Code, Opus 5.5.

## Overview

Fusewalk is an 'Infinite Craft' inspired game where you combine words to make new words. The original game runs AI inference in the cloud, where new recipes are created and the result is attributed to the player that discovered it. My intention of creating this version was to see if it was possible to do all of this on-device.

Via the process of fine-tuning select Qwen 3.x models and building up a 'codex' which also doubles as the training data for the application, I was able to achieve my objective. 🥳

![Fusewalk on Android](/assets/img/screenshots/fusewalk-mobile1.png)

![Fusewalk on Windows Desktop](/assets/img/screenshots/fusewalk-desktop1.png)

The app itself is a Flutter app, written in Python.

## Fine-Tuning

Fusewalk contains everything necessary for creating the underlying fine-tuned model which can run on modern smartphones. This was by far the most time consuming, and expensive part of the process, primarily due to the way that I chose to go about doing this, but I believe the payoff was worth it.

The codex is essentially just an sqlite database. It contains categorised recipes which are used for training, as well as optionally included with the deployed application as 'core recipes' which do not require AI inference.

### Core Recipes

The latest 0.7 codex includes 3381 recipes, 2749 of those are core recipes which means that they make it into the deployed game and do not require inference.

The remainder are not included in the deployed game, but are just used for training, in order to improve output. Here is the complete breakdown,

| Section | Category | Recipes | Description |
| --- | --- | ---: | --- |
| Core | materials | 292 | Wood, stone, metal, glass, fabric, paper, wax |
| Core | actions | 289 | Actions (Eat, Drink, Cut, Break, Wash, Cook, Plant, Sing, Sleep…) used across all categories, each with a loose meaning |
| Core | home | 285 | Buildings, rooms, furniture, kitchen, cleaning, clothing |
| Core | food | 255 | Ingredients, cooking, meals, drinks, sweets |
| Core | nature | 231 | Water, land, sky, weather, fire, plants |
| Core | animals | 226 | Farm, pets, wild animals, insects |
| Core | people | 224 | Life stages, jobs, people combined with things |
| Core | tech | 221 | Electricity, machines, gadgets, vehicles, space |
| Core | fantasy | 195 | Magic, mythical creatures, legends |
| Core | byproducts | 161 | Two results: things that crack, peel, saw, burn, melt or get harvested (Egg + Break = Yolk, Eggshell) |
| Core | time | 112 | Wait: time passing one stage at a time, plus days, seasons and other time items |
| Core | legends | 89 | Public domain myths, folklore, classic fiction and historical figures (Zeus, Robin Hood, Sherlock Holmes) |
| Core | celebrities | 47 | Optional: real living or recently deceased people (Taylor Swift, David Attenborough) |
| Core | places | 45 | Cities, countries and landmarks (Paris, Big Ben, Mount Everest) |
| Core | characters | 42 | Optional: copyrighted characters, films and games (Harry Potter, Pikachu) |
| Core | backbone | 35 | Short paths from the starting items to the 70 goal items (Steel, Bread, Electricity, House…) |
| **Core** | **total** | **2,749** | **Ships in the app and trains the model** |
| Extension 1 | nature | 80 | Nature, weather and the deep earth |
| Extension 1 | kitchen | 76 | Adventurous food |
| Extension 1 | myth | 75 | Myths, legends and folklore |
| Extension 1 | history | 74 | History, places and great works |
| Extension 1 | science | 68 | Science, space and inventions |
| Extension 1 | actions | 65 | Actions with less obvious things |
| Extension 1 | characters | 47 | Characters, films and brands |
| **Extension 1** | **total** | **485** | **Trains the model only, not in the app** |
| Curated | claude-fable-5-1 | 100 | Written by a model for pairs with no recipe yet, then curated |
| Curated | nick | 47 | Written by hand |
| **Curated** | **total** | **147** | **Trains the model only, not in the app** |
| **All** | | **3,381** | |

The majority of the recipes were created using Foundation models, such as Opus 5.5. I did try the cheaper models but the recipes were pretty bad. I'm not suggesting cheaper models can't be used, but the quality of the output can swing wildly.

The codex itself can be explored and updated using the explorer application, where you can even create your own human, or AI curated categories.

![Codex Explorer Codex Selection](/assets/img/screenshots/fusewalk-codexexplorer1.png)

![Codex Explorer Main Menu](/assets/img/screenshots/fusewalk-codexexplorer2.png)

### Training Process

Fine-tuning of the model is done entirely through another terminal based python application. Allowing you to easily configure how the training is to be performed. A breakdown of the training parameters is as follows,

| Param name | Data type | Description |
| --- | --- | --- |
| `base_model` | text (Hugging Face model id) | The model to fine-tune, e.g. `Qwen/Qwen3-1.7B`. Picked in its own step |
| `codex` | choice (a Codex version) | Which Codex version to train on, e.g. `v0.7`. Picked in its own step |
| `name` | text | The run's name. Blank uses the run id, `<time>-<model>-<codex>`, ending in `-x` if the model explains its answers |
| `exclude` | text (comma-separated tags) | Codex blocks to skip by tag, e.g. `celebrities, characters`. Default: blank (none) |
| `method` | choice: auto, lora, full, qlora | How to train. auto = full fine-tune up to ~1.2B parameters, LoRA above; qlora = LoRA on 4-bit weights, for models too big for the GPU. Default: auto |
| `format` | choice: auto, chat, raw | chat = the model's chat template; raw = `"A" + "B" = "X"`; auto = raw for base models, chat otherwise. Default: auto |
| `epochs` | decimal number | Passes over the training data. Default: 3 |
| `learning_rate` | decimal number | 0 = the default for the method (LoRA 2e-4, full 3e-5). Default: 0 |
| `batch_size` | whole number | 0 = auto: the largest that fits in GPU memory, with the effective batch kept at 32. Default: 0 |
| `grad_accum` | whole number | Effective batch = batch size × this. Default: 1 |
| `max_length` | whole number | Longest example in tokens, prompt + answer. Default: 96 |
| `lora_r` | whole number | LoRA only: the adapter's size. Default: 16 |
| `lora_alpha` | whole number | LoRA only: usually 2 × rank. Default: 32 |
| `eval_every` | whole number | Training steps between validation-loss checks. Default: 50 |
| `val_ratio` | decimal number (0–1) | Share of recipes held out for validation; ignored when `data/codex/validation.json` fixes the split. Default: 0.1 |
| `holdout_items` | decimal number (0–1) | Share of items never seen in training; ignored with `validation.json`. Default: 0.05 |
| `seed` | whole number | Random seed for the split, the shuffle and the starting weights. Default: 42 |
| `swap` | yes/no | Also train on B + A, not just A + B. Default: yes |
| `verbosity` | choice: brief all, verbose all, verbose training | brief all = trains on and answers `"X"`; verbose all = trains on and answers `(link) "X"` (explains its answers); verbose training = trains on both, answers `"X"`. Default: brief all |
| `core_weight` | whole number | How many times core recipes (the ones the app ships) appear in the training data. Default: 2 |
| `core_only` | yes/no | Train on core recipes only, not the whole Codex. Default: no |
| `generated_val` | whole number | Model-made recipes held out as a second validation set, to see whether it learns that data or memorises it; 0 = off. Default: 500 |
| `drop_copies` | yes/no | Leave out generated recipes where a result equals an input (`"Pencil" + "Wood" = "Pencil"`). Default: yes |
| `unreachable` | choice: error, keep, drop | Generated recipes whose inputs can't be made: error = refuse to train; keep = train on them anyway; drop = leave them out. Default: drop |
| `checkpoint` | choice: last, best | last = the final weights; best = the weights with the lowest validation loss. Default: last |
| `run_eval` | yes/no | After training, the model answers every validation pair and is scored against the Codex. Default: yes |
| `run_judge` | yes/no | After evaluating, rate every answer with the judge picked in Judge setup (local GPU or OpenRouter). Default: yes |


![Trainer Main Menu](/assets/img/screenshots/fusewalk-trainer1.png)

### AI Judging Process

One technique I employed in order to improve the training process by giving me a rough indication of the quality of the final model was to integrate with OpenRouter and ask a low cost model to judge recipies created by the model. This is where I ended up spending a whole bunch of money refining this process, which was extremely tedious. I liken it to calibrating a 3D printer, it really was a matter of repeated training, testing, refining, etc. over and over, with me occasionally having to top up my credit on OpenRouter. I opted to use Gemini 3.8 Flash in the end as it gave a good compromise of quality and price.

The Judge will mark a prediction from the model as Good, Nonsense or a 'Mashup'. Where a 'Mashup is where 2 words are just joined together, this is allowed but considered lazy and unimaginative so the model is discouraged from doing this. Obviously sometimes it is correct, so it's not stopped entirely.

![Trainer Run Selection](/assets/img/screenshots/fusewalk-trainer2.png)

Training runs are costing around \$0.70c to \$0.85c to train on average.

### Reasoning

One thing that became apparent to me while training the models, is that it would produce strange outputs repeatedly with no way to understand how it came to the conclusion it did. In order to help combat that I implemented a form of training that also includes the reasoning. Where the model is trained to produce not only a result, but a line of text (just before its answer) in an attempt to improve the output quality via a kind of reasoning process. I thought if it actually had to write the reason, it is more likely to make sense. The placement of the reasoning before the answer was also important as otherwise it would likely try to fit the reasoning to the answer instead.

One thing we don't want to do is for the model to produce too much text before its actual answer, as this would run incredibly slow on smartphones. Instead I opted for a simple, short explanation.

![Trainer Prediction Review, post-training](/assets/img/screenshots/fusewalk-trainer3.png)

This certainly wasn't the silver bullet I had hoped it to be, but it did improve the output marginally and also adds a little humour into the game.

## HuggingFace Model Distribution

I had originally considered getting this onto the Google Play store, but changed my mind in the end as I want to spend my time on other projects. One cost to consider was the distribution of the models, if I had uploaded them to S3 and allowed the game to download it directly, I could have ended up just costing myself $$$ a month, assuming anyone played it of course.

That's where HuggingFace comes in, not only can I share the models I fine-tuned for others to use freely, conforming to any licensing requirements for using the Qwen model, but as a public model, downloads are free, completely removing that cost to me.

The training tool, not only quantises the trained model for use in the game, but also publishes directly to HuggingFace, updating the index file used by the game and any additional licenses.

You can view the repository here, [Fusewalk Models on HuggingFace](https://huggingface.co/npateman/fusewalk-models).

![Fusewalk Model Download](/assets/img/screenshots/fusewalk-desktop2.png)

As you can see from the above screenshot I also added benchmarking capabilities in to the app to allow for the creation of timing reports. When I asked a friend to try it out, his S23 Ultra was barely capable of running the 4b model, even though my S24 Ultra ran it with ease. In the end he opted for the 1.7b model which runs super fast on both devices and produces a reasonable quality of output. Personally I would still opt for the 4b model if your device can handle it.

## Conclusions

I actually had quite a bit of fun making this one, despite the costs (OpenRouter expenses, and additional Claude Code credits), and I am happy with the output, I regularly play with the game on my mobile device. If you have a Windows PC or Android device, give it a try, it might keep you entertained for a short while.

The pre-compiled releases are currently only available as Windows x64 and Android builds. If anyone shows interest in this application I may create other targets in the future.

[Fusewalk Releases on GitHub](https://github.com/NickDevoctomy/fusewalk/releases)

> ⚠️ The Android release is not signed for use on the Google play store, so will require side loading, only install if you are confident with that process.