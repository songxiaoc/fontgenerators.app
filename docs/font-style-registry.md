# Font Style Registry

Homepage font styles live in `src/font-styles.js`. Treat each row in
`styleLines` as a source definition:

```text
Display Name|stable-kebab-id|PrimaryCategory,SearchTag,SearchTag
```

Rules for adding a style:

1. Use a stable, unique `id`. Do not rename existing ids after release because
   favorites, copy analytics, and deep tests use them as identifiers.
2. Put the main visible filter first. Valid homepage categories are defined by
   `sections`: `Bold`, `Cursive`, `Fancy`, `Italic`, `Stylish`, `Cool`,
   `Strikethrough`, `Underline`, `Cursed`, and `Big`.
3. Add platform words such as `Discord`, `WhatsApp`, `Instagram`, or `TikTok`
   only as search tags. Do not expose platform names as homepage category
   filters unless a dedicated product decision is made.
4. Add a specific branch in `transformStyle()` when the style needs unique
   output. If it falls through to a shared category fallback, it may become an
   alias of an existing style.
5. Run `npm run check`. The smoke test verifies unique ids, canonical output
   uniqueness, alias resolution, and A-Z/a-z/0-9 probe output for every raw
   source definition and every canonical style.

The public homepage exports only canonical styles from `styles`. Source
definitions that generate the same alphabet/digit fingerprint are retained in
`styleAliases` and resolve through `resolveStyle(id)`, but they do not render as
separate duplicate cards.
