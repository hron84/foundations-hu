# Foundations - Hungarian localization

This repository contains an unofficial, hand-tailored, AI-augmented localization for [Foundation](https://store.steampowered.com/app/690830/Foundation/)

The aim is creating a playable, terminology correct and stylistically matching localization for the game

## Development

If you want to work on the localization, you can use any AI agent for this, instruct it to read AGENTS.md
from the repo for basic directions.

If you want to work on the translation manually, reading AGENTS.md is also highly recommended.

### Prerequisites

You will need NodeJS 20+ to run some tools in the translation.

### TL;DR

The localization files are JSON files in a key-value pairs, sometimes with a structure.

It is important to keep the structure intact, as the game loads the localization by its "path"
in the JSON file. For same reason, never translate the JSON key, only the value.

Some words, expressions are put into Translation-memory.md, check it regurarly during the work and when you
translate something that is a "stylistic" alternative, ensure to add it to the memory, becuase it helps
AI agents to keep the style during the augmented automatic translations.
If you translate an expression, ensure you add enough context to the memory to be clear for further human or robotic translators to understand what's the translation is about.

Before you start your work, update the localization under the Steam Library folder of the game (see below). After that, you have to run the update_from_english.js that updates the hungarian localization to include all the missing keys from the english one, and copies over the english localization for that.
**Important:** the tool requires to be run from the Steam Library folder, because it checks for the English localization and updates the hungarian one based on the English.

After updating the translation, copy back JSON files to your workspace, overwrite all files. This is where the work actually starts.

### Installing/Updating the localization 

 - Ensure your game is not running.
 - Copy the "hu" folder under your Steam Library/steamapps/common/Foundation/localization/ folder and ensure you override any file you found there - if there is any
 - Edit the locales.txt in Steam Library/steamapps/common/Foundation/localization/ folder and add the following to the very end (exactly like this, do not add any space, quotes, anything, just copy-paste this string):

```
hu:Magyar
```
 - Save the TXT
 
## Repository rules

 - Never touch locales.txt. The content of it is figured out during playtesting the translation, everything is on the right place. This repo will never accept PRs that touches that file in any way
 - The JSON files are saved with UTF-8 BOM. This is the required format of the game, ensure your editor/AI agent/translation tool respect it.
 - If it is possible, playtest your changes/additions before you make a PR on your changes.
 - If you post a PR, ensure you describe correctly what is your change contains (at least what area is targeted in the translation). Some contexts are spread over several files, I have to get a picture about what are you doing
 - If you used any kind of AI/LLM-based tool during the translation, ensure you mention it in the PR.  
   AI-augmented translations are welcome, just these changes need special review process.
 - Please do not include any other files, folders, etc from the game folder that is not strictly binds to this translation. Do not even add additional language folders for this repository - this repo is only for Hungarian translation.

# License

This translation is under Creative Commons BY-NC-SA 4.5. 

**Note:** This translation is not an official translation for Foundation game, **do not send issues to Polymorph Games regarding to any translation issues**.

Foundation® is a registered trademark of [Polymorph Games](https://store.steampowered.com/developer/PolymorphGames). All rights reserved.