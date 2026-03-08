---
title: "How did I gain 40% reduction of docker image build for dbt databricks"
slug: "how-did-i-gain-40-reduction-of-docker-image-build-for-dbt-databricks"
date: 2023-08-14
category: "devops"
excerpt: "I was recently buiding a docker images for dbt-databricks and even through I used the slim version of the python image the size of the overall docker image was..."
published: true
tags:
  - devops
  - automation
  - ci-cd
coverImage: "https://cdn-images-1.medium.com/max/800/1*A-Fzxw5CFSD89Zk8MNQbUA.png"
---
I was recently buiding a docker images for dbt-databricks and even through I used the slim version of the python image the size of the overall docker image was close to 1GB which not very convincing.

Did the following improvements on my docker file to reduce the size of the image drastically and achive around 40% reduction.

**Original image size without any improvements**

`FROM python:3.11-slim-bullseye`

![](https://cdn-images-1.medium.com/max/800/1*sBNXYopvrnGwJlb5bjQ6hQ.png)

1. **Removed unnecessary package install which reduced the size massively.**

> Original code

```
RUN apt-get update && apt-get install -qq -y --no-install-recommends \
 git gcc build-essential libpq-dev ca-certificates --fix-missing --no-install-recommends \ 
 && update-ca-certificates
```

> After changes

```
RUN apt-get update && apt-get install -qq -y --no-install-recommends \
 && update-ca-certificates
```

![](https://cdn-images-1.medium.com/max/800/1*5-CL9JJB8PCHYXTSg7E00g.png)

**2. Removed all the packages downloaded for OS**

> *rm -rf /var/lib/apt/lists/\* \
> apt-get clean*

```
RUN apt-get update && apt-get install -qq -y --no-install-recommends \
```

![](https://cdn-images-1.medium.com/max/800/1*iEMhdBAcSmYTFcNohHVOEg.png)

**3. Cleared pip cache**

> *pip cache clear*

```
RUN pip install -r requirements.txt \
 && pip cache purge
```

![](https://cdn-images-1.medium.com/max/800/1*RdYihaRtkHJbxKa9ohxRtg.png)

By making small changes to the images we were able to reduce the overall size from 915.44mb to 544.58mb which is about 370.86mb, and 40% reduction in size.

**Modified docker file.**

```
##
# base image (abstract)
##
FROM python:3.11-slim-bullseye

LABEL maintainer="emp0"

# Env vars
ENV PYTHONIOENCODING=utf-8
ENV LANG=C.UTF-8

WORKDIR /usr/src/dbt

# Add trusted hosts for pip install
RUN pip config set global.trusted-host \
 "pypi.org files.pythonhosted.org pypi.python.org"

# Install OS dependencies
RUN apt-get update && apt-get install -qq -y --no-install-recommends \
 && update-ca-certificates -v \
 && rm -rf /var/lib/apt/lists/* \
 && apt-get clean

# Make sure we are using latest pip
RUN pip install --upgrade pip

# Copy requirements.txt
COPY requirements.txt requirements.txt

# Install dependencies
RUN pip install -r requirements.txt \
 && pip cache purge

CMD dbt deps && sleep infinity
```

---

*This article was originally published at <https://medium.com/@aradsouza/how-did-i-gain-40-reduction-of-docker-image-269a62412e13>*
