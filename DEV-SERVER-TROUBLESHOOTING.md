# Dev server breaks after every UI change — read this before "fixing" it again

## What's actually happening

This is **not** a code bug in the pages you're editing. It's Next.js's local
dev build (`.next/`) getting corrupted after a save-triggered rebuild on
Windows. Symptoms:

- Browser shows raw unstyled HTML (no CSS at all).
- Console floods with `404` for `_next/static/chunks/main-app.js`,
  `app/layout.js`, `app/page.js`, `layout.css`.
- Or worse: every route 500s with `Cannot find module './NNN.js'` /
  `Cannot find module './vendor-chunks/@firebase.js'` — webpack's own
  runtime can't find chunks it just built.

It has happened twice now, both times right after editing `src/app/*`
(landing page, then login/register) and both times it went away after a
full clean rebuild. That's the signature of a stale/corrupted `.next`
cache, not a code defect — don't go hunting for a bug in the component
you just wrote.

## Do NOT do these (already tried, don't help)

- Editing the `dev` script to add/remove `npx rimraf .next &&` — this was
  tried twice (see commits `d164806` and `b4cb878`), toggled back and
  forth, and made no difference. The corruption happens *after* the
  server is already running and compiling on-demand, not at startup.
- Restarting the dev server without deleting `.next` first — it usually
  reloads the same corrupted state.
- Randomly re-editing the component that was last touched — the
  component code was fine both times; verified via a clean rebuild
  rendering it correctly with zero console errors.

## The fix that actually works, every time

```bash
# 1. Stop the running dev server (Ctrl+C in its terminal, or kill the node process on port 3000)

# 2. Nuke the build cache
cd MedicoDocs-FE
rm -rf .next node_modules/.cache

# 3. Start clean
npm run dev
```

Then hard-refresh the browser tab (Ctrl+Shift+R). If the first clean
rebuild still 500s (rare, happened once), repeat step 2-3 once more —
it has resolved every time on a second attempt.

## Before pushing to GitHub — pre-push checklist

1. After any change under `src/app/`, `src/context/`, or `src/lib/`,
   do a clean rebuild (steps above) and load the page in a browser —
   don't just trust that the editor/AI tool says the edit succeeded.
2. Confirm zero errors in the browser console and zero failed network
   requests (`F12` → Console / Network tab) before telling the user
   it's done or pushing.
3. If you see the 404/500 chunk-mismatch symptoms above, do the clean
   rebuild first — don't start editing code to "fix" it.
4. Only push once the page actually renders styled and functional in a
   real browser check, not just "the dev server started."
