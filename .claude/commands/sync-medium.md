Manually sync the latest articles from Medium into the portfolio.

Steps:
1. Fetch the latest RSS feed:
   ```bash
   curl -s "https://medium.com/feed/@aradsouza" -o medium_feed.xml
   ```

2. Run the import script (use the venv if markdownify isn't installed globally):
   ```bash
   python3 import_medium.py
   ```
   If that fails with a missing module error, run:
   ```bash
   python3 -m venv /tmp/medium_venv && /tmp/medium_venv/bin/pip install markdownify -q && /tmp/medium_venv/bin/python import_medium.py
   ```

3. Check which new article files were created (untracked files in `frontend/src/articles/`).

4. Report the new articles found to the user — titles and file paths.

5. Ask the user: "Commit and push these articles?" before doing anything.

6. If yes, stage only the new article files and commit with message:
   `sync: import new articles from Medium`
   Use `git -c user.email="alwyn.anil@gmail.com" -c user.name="alwyndsouza"` for the commit.

Note: The automated GitHub Actions workflow (sync-medium.yml) runs every 6 hours. Only use this command to pull articles immediately without waiting.
