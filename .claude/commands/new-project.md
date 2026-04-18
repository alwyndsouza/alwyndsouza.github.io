Create a new project in this portfolio.

Ask the user for:
1. Project title
2. Short description (shown on the listing card)
3. Status: `production` | `development` | `beta` | `archived`
4. Category (data-engineering | ai | dataops | data-governance)
5. Tech stack (comma-separated list)
6. GitHub repo URL (optional)
7. Demo URL (optional)
8. Should it be featured on the home page? (yes/no)
9. Order number (lower = appears first; ask user or default to 99)

Then:
- Generate an id from the title (lowercase, hyphens)
- Create `frontend/src/projects/{id}.md` with correct YAML frontmatter:

```yaml
---
id: "{id}"
title: "{title}"
description: "{description}"
status: {status}
category: "{category}"
featured: {true|false}
draft: false
order: {order}
tech:
  - {tech1}
  - {tech2}
links:
  github: "{github_url}"   # omit if not provided
  demo: "{demo_url}"        # omit if not provided
coverImage: ""
---
```

- Leave the body as: `<!-- Describe your project here -->`
- Remind the user: set `status: production` for it to appear in Featured Projects on the home page.

Do not commit — let the user review first.
