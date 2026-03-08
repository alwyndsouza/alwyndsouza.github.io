---
title: "Automate Your Python Workflow with zsh-autoswitch-virtualenv"
slug: "automate-your-python-workflow-with-zsh-autoswitch-virtualenv"
date: 2025-02-09
category: "devops"
excerpt: "In the world of Python development, managing virtual environments can be a tedious task. Enter zsh-autoswitch-virtualenv, a ZSH plugin designed to streamline th..."
published: true
tags:
  - devops
  - automation
  - ci-cd
coverImage: "https://cdn-images-1.medium.com/max/800/1*Cgt5p-un4rVW68_2K2RZFg.png"
---
In the world of Python development, managing virtual environments can be a tedious task. Enter `zsh-autoswitch-virtualenv`, a ZSH plugin designed to streamline this process by automatically switching Python virtual environments as you navigate between directories. This tool is a game-changer for developers who frequently switch between projects and need a seamless way to manage their environments.

#### What is zsh-autoswitch-virtualenv ?

`zsh-autoswitch-virtualenv` is a simple yet powerful ZSH plugin that detects and activates Python virtual environments automatically. Whether you're using `virtualenv`, `pipenv`, or `poetry`, this plugin ensures that the correct environment is activated as you move between directories

#### Key Features

1. Automatic Detection and Activation: The plugin automatically detects Python projects and activates the corresponding virtual environment. It supports `setup.py`, `requirements.txt`, `Pipfile`, and `poetry.lock` files
2. Seamless Integration: It integrates seamlessly with `pipenv` and `poetry`, requiring no additional setup
3. Customizable: You can customize the plugin to switch to a default Python virtual environment by setting the `AUTOSWITCH_DEFAULTENV` environment variable

#### How It Works

The plugin works by creating a `.venv` file in the project directory, which contains the name of the virtual environment. A precommand hook checks for this file and switches to the specified environment if found. For `pipenv` and `poetry` projects, it looks for `Pipfile` and `pyproject.toml` files, respectively, and activates the corresponding environment

#### **Installation Steps for zsh**

`autoswitch-virtualenv` requires [virtualenv](https://pypi.org/project/virtualenv/) to be installed. You will also need to make sure that `python` (without a suffix; both Python 2 and 3 are supported) is available in your `$PATH`.

Copy this repository to `$ZSH_CUSTOM/plugins`, where `$ZSH_CUSTOM` is the directory with custom plugins of oh-my-zsh [(read more)](https://github.com/robbyrussell/oh-my-zsh/wiki/Customization/):

```
git clone "https://github.com/MichaelAquilina/zsh-autoswitch-virtualenv.git" "$ZSH_CUSTOM/plugins/autoswitch_virtualenv"
```

Then add this line to your `.zshrc`. Make sure it is before the line `source $ZSH/oh-my-zsh.sh`.

```
plugins=(autoswitch_virtualenv $plugins)
```

Once the installation is complete, when you navigate to the repository which has `setup.py`, `requirements.txt`, `Pipfile`, and `poetry.lock` files, you will be provide with an option to create virtual environment.

To create an virtual environment, run the below command

*mkvenv*

to deactivate an virtual environment, run the below command

*rmvenv*

#### **References**

<https://github.com/MichaelAquilina/zsh-autoswitch-virtualenv>

---

*This article was originally published at <https://medium.com/@aradsouza/automate-your-python-workflow-with-zsh-autoswitch-virtualenv-8aac9d933ff9>*
