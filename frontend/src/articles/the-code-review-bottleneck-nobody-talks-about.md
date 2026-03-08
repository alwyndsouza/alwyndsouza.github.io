---
title: "The Code Review Bottleneck Nobody Talks About"
slug: "the-code-review-bottleneck-nobody-talks-about"
date: 2025-11-24
category: "ai"
excerpt: "Read the main article in the series before doing a deep dive."
published: true
tags:
  - ai
  - artificial-intelligence
  - automation
coverImage: "https://cdn-images-1.medium.com/max/800/1*3ebe9_Jt8oZJYOBRLY31vw.png"
---
Read the main article in the series before doing a deep dive.

#### [From 4 Days to 2 Hours: How Context-Aware AI Transformed Our Code Reviews](https://medium.com/@aradsouza/from-4-days-to-2-hours-how-context-aware-ai-transformed-our-code-reviews-f30b5da9db6b)

### Part 1: How We Got Here and Why Standard Solutions Aren’t Working

Let me start with something that might sound contradictory: despite having more automation, better tooling, and smarter CI/CD pipelines than ever before, code reviews have become slower and more painful.

If you’re a developer, you know the frustration. You submit a PR that you’re confident about. The code works. Tests pass. You’ve followed the patterns you’ve seen elsewhere in the codebase. Then you wait. And wait. Two days later, you get feedback about missing a specific configuration, or not following a pattern that’s documented somewhere in a wiki you’ve never been able to find.

If you’re a reviewer, you know the exhaustion. You’re checking the same things on every PR — is the config correct? Are the tests comprehensive? Is the documentation updated? Did they follow the twelve different standards we’ve accumulated over the years? Your brain hurts, you miss things, and you’re acutely aware that you’ve become the bottleneck holding everyone back.

This is the reality for most engineering teams working with data pipelines, infrastructure as code, or any domain with established patterns and standards. And it’s getting worse, not better.

### The numbers that made us realize something was broken

Before I explain what we tried (and what eventually worked), here’s where we started:

* Pull requests taking **2–4 days** on average from submission to approval
* **35% of commits** failing pre-commit hooks and CI checks
* **2–4 revision cycles** per PR on average before approval
* Test coverage hovering around **60%**
* Documentation compliance at **45%**
* Code standards adherence at **70%** (meaning 30% of merged code didn’t fully follow our patterns)

The cost wasn’t just in time. Developer morale was suffering. “Why does it take so long to get anything merged?” became a constant refrain. Reviewers were burning out. “I spend all day reviewing code and never get to my actual work” was equally common.

We had documentation. We had standards. We had wiki pages explaining exactly how things should be done. None of it mattered because documentation doesn’t review code — people do. And people are inconsistent, they get tired, and they can’t possibly keep every project-specific rule in their heads while reviewing dozens of PRs.

### Why this isn’t just about being “too slow”

The deeper problem isn’t the time itself — it’s what that time represents. Slow code reviews are a symptom of several underlying issues:

**Knowledge is trapped in people’s heads.** Every experienced engineer on your team knows dozens of patterns, gotchas, and standards that never make it into documentation. Or if they do, the documentation is so scattered and outdated that nobody reads it.

**Reviewers become gatekeepers, not collaborators.** When the review process is primarily about catching compliance issues, the reviewer’s role devolves into being a human checklist. That’s frustrating for everyone and wastes the reviewer’s actual expertise.

**Standards drift over time.** Different reviewers emphasize different things. What passes with one reviewer gets rejected by another. New team members pick up inconsistent patterns depending on who reviews their code.

**The learning loop is broken.** When feedback comes days after you wrote the code, you’ve already context-switched to something else. The learning doesn’t stick the way it would with immediate feedback.

**Junior developers struggle disproportionately.** They don’t know what they don’t know. They see code that works, submit it, and get surprised by feedback about standards they’d never heard of. The onboarding curve is brutal.

### The first attempt: “just use AI”

Like many teams, when AI coding assistants became available, we were optimistic. Finally, a tool that could help with code reviews! We enabled GitHub Copilot for the team and waited for the magic to happen.

It didn’t.

Don’t get me wrong — Copilot is impressive. It can autocomplete code, suggest refactorings, and catch common issues. But when we asked it to review our data transformation code, it gave us feedback like:

* “This SELECT statement could be written more clearly”
* “Consider adding comments to explain complex logic”
* “This function could be broken into smaller functions”

Helpful? Sure, in a generic sense. But it completely missed the things that actually mattered to us:

* It didn’t know that certain models required specific pre-processing steps
* It didn’t catch missing configurations that were mandatory in our architecture
* It had no idea about our naming conventions or organizational patterns
* It couldn’t enforce our testing requirements or documentation standards

The subject matter expert still had to do the entire manual review. We’d just added another tool without actually solving the problem.

### Understanding why generic AI falls short

Here’s the fundamental issue: AI coding assistants are trained on millions of repositories. They understand general software engineering principles, common patterns, and language-specific best practices. What they don’t have — what they can’t have out of the box — is knowledge of your specific architecture, your team’s accumulated decisions, and the context of why you do things a particular way.

Think about what a senior engineer knows about your codebase:

* Which models are part of which domains
* Why certain patterns exist (often learned from painful incidents)
* What the unwritten rules are that everyone just “knows”
* How different parts of the system interact
* What the common mistakes are and how to avoid them

Generic AI has none of this context. It’s like hiring a brilliant engineer who’s an expert in the programming language but knows nothing about your business, your architecture, or your accumulated wisdom.

### The manual review trap

So we were stuck with manual reviews, which created their own set of problems:

**Inconsistency.** Reviewer A might care deeply about test coverage. Reviewer B might focus on documentation. Reviewer C might be strict about configuration patterns. The feedback you get depends on who reviews your code.

**Fatigue.** Checking the same twenty things on every PR is mind-numbing work. You start skipping checks, or your eyes glaze over, or you rubber-stamp things just to get through the queue.

**Bottlenecks.** If you have one or two senior engineers who really know the standards, they become mandatory reviewers on everything. They’re overwhelmed, PRs pile up, and nothing moves.

**Knowledge silos.** When feedback is given through PR comments, it helps that one developer on that one PR. The next developer makes the same mistake because they never saw that feedback.

**Defensive development.** Developers start to fear code reviews. They hold back on innovation because “the reviewer won’t like it.” They submit smaller, safer PRs that don’t really improve the codebase.

### What we needed but didn’t have

Looking back, what we really needed was:

1. **Instant feedback** that happens while writing code or immediately upon PR submission
2. **Consistent enforcement** that doesn’t vary based on who’s reviewing or how tired they are
3. **Context-aware suggestions** that understand our specific architecture and standards
4. **Teaching, not just catching** so developers learn patterns instead of just fixing individual issues
5. **Reviewer augmentation** that handles the routine checks so humans can focus on strategic feedback

Standard tooling gave us some of these. CI/CD catches issues, but only after you’ve committed and pushed. Linters enforce code style, but not architectural patterns. Documentation exists, but nobody reads all of it consistently.

What we needed was a way to take the knowledge in senior engineers’ heads and make it instantly accessible to everyone, all the time, right at the moment they need it.

### The stakes are higher than you think

Before we move on to solutions, it’s worth understanding why this matters beyond just “code reviews are annoying.”

**Time-to-market suffers.** When every feature requires multiple days of review cycles, your velocity drops significantly. What should take a week takes two or three.

**Innovation slows.** Developers become conservative. They stick with patterns they know will pass review rather than trying better approaches that might get questioned.

**Knowledge doesn’t transfer.** New team members learn slowly because the feedback loop is so long. What could be learned in weeks takes months.

**Technical debt accumulates.** When standards aren’t enforced consistently, the codebase gradually drifts. Different parts follow different patterns. Inconsistency becomes the norm.

**People leave.** Both developers (frustrated by slow feedback) and reviewers (exhausted by the burden) become dissatisfied. Your best people find opportunities elsewhere.

The cost of slow, inconsistent code reviews is enormous — it just shows up gradually rather than all at once, so it’s easy to accept as “just how things are.”

### What makes code reviews slow isn’t what you think

Most teams try to speed up code reviews by optimizing the wrong things:

* Adding more reviewers (which just spreads the bottleneck across more people)
* Creating review checklists (which nobody uses consistently)
* Setting SLAs for review time (which creates pressure but not capability)
* Simplifying standards (which just lowers quality)

None of these address the core problem: the knowledge required to do a good review is expensive to access. It’s in people’s heads, in scattered documentation, in historical context that takes years to accumulate.

The breakthrough comes from making that knowledge cheap to access — instant, consistent, and embedded right in the development workflow.

### The path forward

So that’s where we were: slow reviews, frustrated developers, exhausted reviewers, inconsistent standards, and none of the obvious solutions working.

What eventually worked wasn’t a new tool or a process change. It was finding a way to teach AI our specific context — to take the generic capabilities of AI coding assistants and specialize them for our exact environment, patterns, and standards.

In the next part, we’ll dive into exactly how we did that, what changed, and why context-aware AI is fundamentally different from generic AI for code reviews.

But the key insight is this: the problem isn’t the lack of intelligence (human or artificial). It’s the lack of accessible context. Solve that, and everything else starts to fall into place.

**Want to go deeper?**

Go through the three-part series:

* [Part 1: The Code Review Bottleneck Nobody Talks About](https://aradsouza.medium.com/the-code-review-bottleneck-nobody-talks-about-4e601a3e556f)
* [Part 2: Teaching AI to Understand Your Codebase (deep dive on instruction writing)](https://medium.com/@aradsouza/teaching-ai-to-understand-your-codebase-8e95865ebffc)
* [Part 3: Building Context-Aware AI for Your Team (detailed implementation guide)](https://medium.com/@aradsouza/building-context-aware-ai-for-your-team-cc808474ed6f)

---

*This article was originally published at <https://medium.com/@aradsouza/the-code-review-bottleneck-nobody-talks-about-4e601a3e556f>*
