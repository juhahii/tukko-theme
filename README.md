# Tukko theme

Hugo layouts, CSS, JS, archetypes, and Decap CMS schema for small Finnish business sites.

This repository is the **engine**. A site that uses it keeps its own `content/`, `data/`, `static/media/`, and `hugo.toml`.

## Use in a site

```toml
# hugo.toml
theme = "tukko"
```

Place this folder at `themes/tukko` (clone, submodule, or copy).

The site still needs:

- `content/content/` plus virtual lists (`content/tuotteet/_index.md`, `referenssit`, `kampanjat`, `sivut`)
- `content/people/` and `content/manufacturers/` with `_build.render: never` (widgets only)
- `data/site.yaml`, `data/frontpage.yaml`, `data/consent.yaml`
- `static/media/` for uploads
- Decap/Netlify Identity for `/admin/`

CMS config is served from this theme (`static/admin/`). Override it in the site with `static/admin/config.yml` if a project needs extra fields.

## Requires

Hugo 0.123+ extended.
