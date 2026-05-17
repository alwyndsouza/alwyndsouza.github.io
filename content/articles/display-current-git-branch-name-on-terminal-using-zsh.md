---
title: "Display current git branch name on Terminal using zsh"
slug: "display-current-git-branch-name-on-terminal-using-zsh"
date: 2023-08-20
category: "devops"
excerpt: "Open ~/.zshrc in your favorite editor and add the following content to the bottom."
published: true
tags:
  - devops
  - automation
  - ci-cd
coverImage: "https://cdn-images-1.medium.com/max/800/1*ROkYs83rgv8pi2p9P9ZcgQ@2x.png"
---
### Install

Open `~/.zshrc` in your favorite editor and add the following content to the bottom.

```
parse_git_branch() {
 git branch 2> /dev/null | sed -n -e 's/^\* \(.*\)/[\1]/p'
}
COLOR_DEF='%f'
COLOR_USR='%F{243}'
COLOR_DIR='%F{197}'
COLOR_GIT='%F{39}'
NEWLINE=$'\n'
setopt PROMPT_SUBST
export PROMPT='${COLOR_USR}%n@%M ${COLOR_DIR}%d ${COLOR_GIT}$(parse_git_branch)${COLOR_DEF}${NEWLINE}%% '
```

The script consists of the following parts:

* The `parse_git_branch()` function. This function uses the `git branch` command to list all of the branches in the current working directory. It then uses the `sed` command to filter the output to only the current branch, which is marked with an asterisk (\*).
* The `COLOR_DEF`, `COLOR_USR`, `COLOR_DIR`, and `COLOR_GIT` variables. These variables define the colors that will be used to format the prompt.
* The `NEWLINE` variable. This variable defines the newline character.
* The `setopt PROMPT_SUBST` command. This command tells zsh to substitute variables in the prompt.
* The `export PROMPT` command. This command sets the prompt to the value of the `PROMPT` variable.

### Script Usage

To use this script, you need to save it in a file called `.zshrc` in your home directory. Then, you need to open a new shell or source the `.zshrc` file.

```
source ~/.zshrc
```

Once you have done this, the current git branch name will be displayed in the prompt.

---

*This article was originally published at <https://medium.com/@aradsouza/display-current-git-branch-name-on-terminal-using-zsh-14c3ade27ee9>*
