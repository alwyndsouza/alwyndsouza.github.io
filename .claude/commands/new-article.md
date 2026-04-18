Create a new article in this portfolio.

Ask the user for:
1. Article title
2. Category (data-engineering | dataops | ai | data-governance)
3. Tags (comma-separated)
4. A short excerpt (1–2 sentences shown on listing pages)
5. Whether it should be published immediately or saved as a draft (`published: true/false`)

Then:
- Generate a slug from the title (lowercase, hyphens, no special chars)
- Create `frontend/src/articles/{slug}.md` with correct YAML frontmatter:

```yaml
---
title: "{title}"
slug: "{slug}"
date: {today's date as YYYY-MM-DD}
category: "{category}"
excerpt: "{excerpt}"
published: {true|false}
tags:
  - {tag1}
  - {tag2}
coverImage: ""
---
```

- Leave the body as a placeholder comment: `<!-- Write your article here -->`
- Confirm the file path created and remind the user to set `coverImage` if they have one.

Do not commit — let the user review first.
