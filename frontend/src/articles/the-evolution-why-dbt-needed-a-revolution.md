---
title: "The Evolution — Why dbt Needed a Revolution"
slug: "the-evolution-why-dbt-needed-a-revolution"
date: 2025-12-13
category: "dbt"
excerpt: "You are an analytics engineer at 3 PM on a Friday. Your stakeholder needs a new metric for Monday’s board meeting. You write the SQL, hit dbt run, and... wait...."
published: true
tags:
  - dbt
  - rust
  - dbt-cloud
  - dbt-core
  - dbt-labs
coverImage: "https://cdn-images-1.medium.com/max/2600/1*b7rnonvZvBCphARODxMoaA.png"
---

You are an analytics engineer at 3 PM on a Friday. Your stakeholder needs a new metric for Monday’s board meeting. You write the SQL, hit `dbt run`, and... wait. And wait. Five minutes later, you discover a typo. Fix it. Run again. Wait again. By the time you've iterated through three errors, it's 6 PM, and you've spent more time waiting than coding.

Sound familiar? For nearly a decade, this has been the reality for dbt developers worldwide. But not anymore.

When dbt launched in 2016, it revolutionised analytics engineering by enabling data practitioners to work like software engineers. The framework was brilliant. The execution? Built in Python—a language chosen for accessibility, not speed.

For larger projects, dbt Core became unworkably slow. Even smaller projects needed step-change improvements to power great developer experiences. Parse times stretched into minutes. Compilation cycles became coffee breaks. And the worst part? dbt Core renders SQL but doesn’t comprehend it—treating SQL as text to template and pass to the warehouse.

---

*This article was originally published at <https://medium.com/towards-data-engineering/the-evolution-why-dbt-needed-a-revolution-8099efbf4522?source=rss-670f6306e3c0------2>*
