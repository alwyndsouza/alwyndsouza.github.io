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

<h3>Install</h3><p>Open <code>~/.zshrc</code> in your favorite editor and add the following content to the bottom.</p><pre spellcheck="false">parse_git_branch() {<br /> git branch 2&gt; /dev/null | sed -n -e &#x27;s/^\* \(.*\)/[\1]/p&#x27;<br />}<br />COLOR_DEF=&#x27;%f&#x27;<br />COLOR_USR=&#x27;%F{243}&#x27;<br />COLOR_DIR=&#x27;%F{197}&#x27;<br />COLOR_GIT=&#x27;%F{39}&#x27;<br />NEWLINE=$&#x27;\n&#x27;<br />setopt PROMPT_SUBST<br />export PROMPT=&#x27;${COLOR_USR}%n@%M ${COLOR_DIR}%d ${COLOR_GIT}$(parse_git_branch)${COLOR_DEF}${NEWLINE}%% &#x27;</pre><p>The script consists of the following parts:</p><ul><li>The <code>parse_git_branch()</code> function. This function uses the <code>git branch</code> command to list all of the branches in the current working directory. It then uses the <code>sed</code> command to filter the output to only the current branch, which is marked with an asterisk (*).</li><li>The <code>COLOR_DEF</code>, <code>COLOR_USR</code>, <code>COLOR_DIR</code>, and <code>COLOR_GIT</code> variables. These variables define the colors that will be used to format the prompt.</li><li>The <code>NEWLINE</code> variable. This variable defines the newline character.</li><li>The <code>setopt PROMPT_SUBST</code> command. This command tells zsh to substitute variables in the prompt.</li><li>The <code>export PROMPT</code> command. This command sets the prompt to the value of the <code>PROMPT</code> variable.</li></ul><h3>Script Usage</h3><p>To use this script, you need to save it in a file called <code>.zshrc</code> in your home directory. Then, you need to open a new shell or source the <code>.zshrc</code> file.</p><pre spellcheck="false">source ~/.zshrc</pre><p>Once you have done this, the current git branch name will be displayed in the prompt.</p>

<hr>

<p><em>This article was originally published at <a href="https://medium.com/@aradsouza/display-current-git-branch-name-on-terminal-using-zsh-14c3ade27ee9" target="_blank" rel="nofollow">https://medium.com/@aradsouza/display-current-git-branch-name-on-terminal-using-zsh-14c3ade27ee9</a></em></p>
