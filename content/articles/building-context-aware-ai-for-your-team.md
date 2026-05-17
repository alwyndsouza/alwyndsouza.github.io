---
title: "Building Context-Aware AI for Your Team"
slug: "building-context-aware-ai-for-your-team"
date: 2025-11-26
category: "ai"
excerpt: "In Parts 1 and 2, we explored why code reviews are broken and how context-aware AI fixes them. Now let’s get practical: exactly how do you implement this for yo..."
published: true
tags:
  - ai
  - artificial-intelligence
  - automation
coverImage: "https://cdn-images-1.medium.com/max/800/1*8oBb2mJdow7cxTlOPnh5fA.png"
---
### Part 3: A Practical Implementation Guide

In Parts 1 and 2, we explored why code reviews are broken and how context-aware AI fixes them. Now let’s get practical: exactly how do you implement this for your team?

* [Part 1: The Code Review Bottleneck Nobody Talks About](https://medium.com/@aradsouza/the-code-review-bottleneck-nobody-talks-about-4e601a3e556f)
* [Part 2: Teaching AI to Understand Your Codebase](https://medium.com/@aradsouza/teaching-ai-to-understand-your-codebase-8e95865ebffc)

This isn’t theoretical. This is a step-by-step guide based on implementing context-aware Copilot on real projects with real teams, learning what works and what doesn’t.

### The five-phase rollout

We learned (sometimes the hard way) that successful implementation follows five distinct phases:

1. **Foundation:** Set up the structure
2. **Core Content:** Document your most critical standards
3. **Testing:** Validate with real PRs
4. **Refinement:** Iterate based on feedback
5. **Scale:** Expand across teams and technologies

Let’s walk through each phase in detail.

### Phase 1: Foundation (2–4 hours)

The first phase is about creating the structure that everything else builds on.

### Step 1: Create the folder structure

Start simple with repository-wide instructions:

```
.github/
└── copilot-instructions.md
```

**Important:** This single file approach works in all IDEs: VS Code, Visual Studio, JetBrains, Xcode, and GitHub.com.

**Later, if needed,** you can add path-specific instructions:

```
.github/
├── copilot-instructions.md (repository-wide)
└── instructions/ (path-specific, advanced)
 ├── dbt.instructions.md
 ├── airflow.instructions.md
 └── glue.instructions.md
```

**Compatibility note:**

* Repository-wide: Works everywhere ✓
* Path-specific: Best in VS Code and GitHub.com (for Copilot Coding Agent and Code Review)

**Recommendation:** Start with just `.github/copilot-instructions.md`. Add path-specific files only when you need different rules for different file types.

### Step 2: Write the orchestrator

The `copilot-instructions.md` file should start simple. Here's a template:

markdown

```
# Code Review Instructions

## Purpose
These instructions help GitHub Copilot understand our codebase
standards and provide context-aware code reviews.
## Repository Overview
[Brief description of what this repo does]
## Technology Stack
- [Technology 1]: See [technology1].instructions.md
- [Technology 2]: See [technology2].instructions.md
- [Technology 3]: See [technology3].instructions.md
## General Principles
1. All code must be tested
2. All code must be documented 
3. Follow DRY (Don't Repeat Yourself)
4. Fail fast with clear error messages
5. Use configuration over hardcoding
## How to Use These Instructions
When reviewing code:
1. Identify which technology is being modified
2. Apply the technology-specific guidelines
3. Check against general principles
4. Flag CRITICAL issues that break functionality
5. Warn about STANDARD violations
6. Suggest IMPROVEMENTS for code quality
```

This gives Copilot the big picture and a framework for thinking about reviews.

### Step 3: Pick your first technology

Don’t try to document everything at once. Pick the technology where:

* You have the most PRs
* Standards are clearest
* Pain points are biggest
* You have the most expertise

For many teams, this might be your backend framework, your infrastructure-as-code tool, or your data transformation layer.

### Phase 2: Core Content (20–40 hours)

This is where the real work happens. You’re encoding years of accumulated knowledge into structured instructions.

### Start with the critical path

For your chosen technology, identify the top 5–10 patterns that:

1. Are required for code to work correctly
2. Are frequently missed in reviews
3. Cause problems when violated
4. New developers always get wrong

These become your CRITICAL rules.

### Document with this structure

For each pattern, include:

**1. The Rule** Clear, specific statement of what’s required.

**2. Why It Exists** The reasoning — often from painful lessons learned.

**3. How to Implement** Code example showing the correct pattern.

**4. Common Mistakes** What you often see done wrong, with examples.

**5. How to Check** What reviewers should look for to verify compliance.

### Instruction file length best practices

**Keep files focused and manageable:**

**Maximum recommended length:** ~1,000 lines per file

* Beyond this, Copilot may overlook some instructions
* Response quality can deteriorate with very long files
* Context limits mean not everything gets processed

**Starting point:** 10–20 critical instructions

* Test what works with real PRs
* Add incrementally based on actual needs
* Don’t try to document everything at once

**If files grow too large:**

* Split into multiple path-specific instruction files
* Each focusing on a specific domain or file type
* This also improves maintainability and clarity

**Example split:**

```
.github/
├── copilot-instructions.md (general, 200 lines)
└── instructions/
 ├── dbt.instructions.md (400 lines)
 ├── airflow.instructions.md (300 lines)
 └── glue.instructions.md (200 lines)
```

Each focused file is more effective than one 1,100-line mega-file.

### Real example: Incremental data models

Here’s how we documented incremental model patterns:

markdown

```
## Incremental Models Must Include Data Cleanup

### The Rule
Any model using incremental materialization MUST include a pre-hook 
that deletes stale records before inserting new ones.
### Why This Exists
Without cleanup, incremental runs append data without removing old 
versions. Over time, this causes:
- Duplicate records in the target table
- Incorrect aggregations and counts
- Data quality failures that are hard to trace
- Need for full refreshes that take hours
We learned this after an incident where a critical dashboard showed 
inflated numbers for three days before anyone noticed.
### How to Implement
```sql\
{{ config(\
 materialized='incremental',\
 unique_key='id',\
 pre_hook=[\
 "{{ delete_old_records() }}"\
 ]\
) }}\
SELECT \
 id,\
 name,\
 updated_at\
FROM {{ source('raw', 'customers') }}\
{% if is_incremental() %}\
 WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }})\
{% endif %}\
```
### Common Mistakes
**Mistake 1:** Forgetting the pre-hook entirely
```sql\
-- WRONG: No cleanup, will duplicate data\
{{ config(\
 materialized='incremental',\
 unique_key='id'\
) }}\
```
**Mistake 2:** Using pre-hook but missing unique_key
```sql\
-- WRONG: Cleanup runs but can't identify which records to delete\
{{ config(\
 materialized='incremental',\
 pre_hook=["{{ delete_old_records() }}"]\
 -- Missing: unique_key='id'\
) }}\
```
**Mistake 3:** Incremental filter without matching cleanup logic
```sql\
-- PROBLEMATIC: Filter checks updated_at but cleanup \
-- doesn't know about this field\
{% if is_incremental() %}\
 WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }})\
{% endif %}\
```
### How to Check
As a reviewer, verify:
- [ ] Config block includes pre_hook with cleanup macro
- [ ] unique_key is specified and matches actual PK
- [ ] Incremental filter logic aligns with cleanup strategy
- [ ] Tests include uniqueness check on the key field
```

This level of detail might seem excessive, but remember: you’re teaching an AI. Specificity and examples are crucial.

### Cover the full lifecycle

Don’t just document happy path patterns. Include:

**Error handling:** How should code fail? What error messages are good?

**Testing requirements:** What tests are mandatory? What’s nice to have?

**Documentation standards:** What needs to be documented? Where?

**Configuration patterns:** What should be configurable? What should be hardcoded?

**Performance considerations:** What patterns are expensive? When does it matter?

**Security requirements:** What data needs protection? How?

### Use the tiered approach

As mentioned in Part 2, organize your rules in three tiers:

**🚨 CRITICAL:** Breaks functionality or creates serious problems

* Flag with “CRITICAL:” prefix
* These are non-negotiable
* Examples: Missing required configs, incorrect data handling

**⚠️ WARNING:** Violates standards, creates technical debt

* Flag with “WARNING:” prefix
* Should be fixed but might have valid exceptions
* Examples: Missing tests, poor naming, inadequate documentation

**ℹ️ INFO:** Improvement opportunities

* Flag with “INFO:” or “SUGGESTION:” prefix
* Makes code better but not essential
* Examples: Refactoring opportunities, performance optimizations

This helps both AI and humans prioritize what matters.

### Phase 3: Testing (4–8 hours)

Before rolling out to your team, you need to validate that your instructions actually work.

### Test with historical PRs

Go back through your merged PRs from the last month. Pick 5–10 that had significant review feedback. Ask Copilot to review them using your new instructions.

**Good signs:**

* Copilot catches the issues that human reviewers caught
* Copilot’s feedback is specific and actionable
* False positives are rare

**Bad signs:**

* Copilot misses critical issues
* Feedback is too generic
* Many false positives on acceptable code

### Refine based on test results

When Copilot misses something important:

* Add more specific guidance to your instructions
* Include examples of that specific pattern
* Make the “why” clearer

When Copilot flags false positives:

* Add examples of acceptable exceptions
* Clarify the conditions when rules apply
* Add nuance to your instructions

### Test with new PRs

Once you’re satisfied with historical testing, try your instructions on 2–3 new PRs before they go to human review.

Ask the PR authors:

* Was the feedback helpful?
* Did you understand what to change?
* Were there false positives?
* What did it miss?

Use this feedback to iterate.

### Phase 4: Refinement (Ongoing)

Your instructions are never “done.” They evolve as your codebase and standards evolve.

### Establish feedback loops

**After each PR review:**

* Did Copilot catch everything the human reviewer caught?
* If not, update the instructions

**Monthly review:**

* What patterns have emerged in recent feedback?
* Are there new common mistakes to document?
* Have any standards changed?

**Quarterly retrospective:**

* What instructions are most/least useful?
* Where are the gaps?
* What can be simplified?

### Version your instructions

Treat instruction files like code:

* Review changes before merging
* Write commit messages explaining updates
* Track what instructions catch what issues
* Roll back if changes cause problems

### Measure effectiveness

Track metrics to understand impact:

**Leading indicators:**

* Time from PR creation to first review
* Time from first review to approval
* Number of revision cycles per PR
* Percentage of PRs approved first try

**Lagging indicators:**

* Pre-commit failure rate
* Post-merge bugs related to standard violations
* Test coverage trends
* Documentation completeness

**Qualitative feedback:**

* Developer satisfaction with review speed
* Reviewer satisfaction with workload
* New hire onboarding time

### Phase 5: Scale (4–8 hours per technology)

Once you’ve proven the approach with one technology, expand to others.

### Add technology-specific files

You have two options for scaling: repository-wide references or path-specific instructions.

**Option 1: Repository-wide with references (simpler)**

```
.github/
└── copilot-instructions.md (all guidelines in one file)
```

Update your main file to include all technology guidelines in sections.

**Option 2: Path-specific instructions (advanced, more granular)**

Create separate files that automatically apply to specific file types:

```
.github/
├── copilot-instructions.md (general principles)
└── instructions/
 ├── dbt.instructions.md
 ├── glue.instructions.md
 ├── airflow.instructions.md
 └── lambda.instructions.md
```

Path-specific files require YAML frontmatter with `applyTo` field:

```
---
applyTo:
 - "**/*.py"
 - "src/**/*.py"
---
# Python Backend Standards
These instructions automatically apply when working with Python files.
## Code Style
[Your Python-specific guidelines]

```

**Glob pattern examples:**

* `**/*.sql` - All SQL files anywhere in the repo
* `models/**/*` - All files under the models directory
* `tests/**/*.py` - Python files in tests directory
* `*.yaml` - YAML files in root directory only

**When to use path-specific:**

* Different standards for different languages
* Test files vs production code requirements
* Legacy code vs new code standards
* Frontend vs backend conventions

### Common challenges and solutions

### Challenge 1: Instructions are too generic

**Symptom:** Copilot provides feedback that could apply to any project.

**Solution:** Add more specific examples. Include actual code from your codebase. Reference specific systems, patterns, and architectural decisions unique to your project.

### Challenge 2: Instructions are too rigid

**Symptom:** Copilot flags acceptable variations as violations.

**Solution:** Add examples of valid exceptions. Use language like “typically requires” instead of “must always have.” Explain when rules apply and when they don’t.

### Challenge 3: Instructions get out of sync

**Symptom:** Instructions reference patterns no longer used or miss new standards.

**Solution:** Make instruction updates part of your standard process. When standards change, update instructions in the same PR. Assign ownership of instruction files to tech leads.

### Challenge 4: Too many false positives

**Symptom:** Copilot flags issues in code that’s actually fine.

**Solution:** Review the false positives. Often they reveal ambiguity in your actual standards. Either refine the instructions to allow the pattern, or refine your standards to disallow it. Use this as an opportunity to clarify.

### Challenge 5: Developers ignore AI feedback

**Symptom:** PRs still have issues despite Copilot flagging them.

**Solution:** Make AI review a required step before requesting human review. Add a PR template checkbox: “I’ve reviewed Copilot’s feedback and addressed critical issues.” Set team norms around respecting AI feedback.

### The relationship with CI/CD

One question that comes up frequently: how does this relate to existing CI/CD pipelines?

**Context-aware AI and CI are complementary:**

**CI/CD catches:** Syntax errors, test failures, build breaks, security vulnerabilities (via scanners)

**Context-aware AI catches:** Architecture violations, standard deviations, missing documentation, incomplete tests, anti-patterns

**The key difference:** Timing

* CI runs after you’ve committed and pushed
* AI reviews while you’re writing code or immediately on PR

This means:

* Fewer CI failures (caught by AI first)
* Faster feedback loops (no commit/push/wait cycle)
* Better learning (explanations alongside checks)

But you still need CI! It’s your guardrail. AI is your guide.

### Limitations and realistic expectations

This is powerful, but it’s not magic. Be clear about limitations:

**Context-aware AI is great at:**

* Enforcing known patterns and standards
* Catching missing configurations
* Identifying common mistakes
* Teaching through examples
* Consistent application of rules

**Context-aware AI struggles with:**

* Novel architectural decisions
* Complex business logic
* Subtle bugs requiring deep domain knowledge
* Tradeoff analysis between competing approaches
* Understanding unstated requirements

Human reviewers remain essential for strategic thinking, architectural oversight, and complex problem-solving.

The goal isn’t to replace human reviewers. It’s to elevate them from gatekeepers checking compliance to advisors providing strategic guidance.

---

*This article was originally published at <https://medium.com/@aradsouza/building-context-aware-ai-for-your-team-cc808474ed6f>*
