# Tukko theme

Hugo layouts, CSS, JS, archetypes, and Decap CMS schema for small Finnish business sites.

This repository is the **engine**. A site that uses it keeps its own `content/`, `data/`, `assets/media/`, and `hugo.toml`.

## Use in a site

Place this folder at `themes/tukko`. Copy `hugo.toml.example` to the site root as `hugo.toml` and set `baseURL` and `title`.

As a git submodule:

```bash
git submodule add git@github.com:juhahii/tukko-theme.git themes/tukko
git submodule update --init --recursive
```

The example includes `[imaging]` and the `assets/media` → `static/media` mount. Without those, uploads are not processed and Decap preview of `/media/` breaks.

The site still needs:

- `content/content/` plus virtual lists (`content/tuotteet/_index.md`, `referenssit`, `kampanjat`, `sivut`, `palvelut`)
- `content/people/` and `content/manufacturers/` with `_build.render: never` (widgets only)
- `data/site.yaml`, `data/frontpage.yaml`, `data/consent.yaml`
- `assets/media/` for uploads (`media_folder` in Decap). Originals are mounted at `/media/` for CMS preview; templates process them to WebP/JPEG.
- Decap/Netlify Identity for `/admin/`

CMS config is served from this theme (`static/admin/`). Override it in the site with `static/admin/config.yml` if a project needs extra fields.

## Language

Tukko is **Finnish-only**. Buttons, 404, consent UI, form labels, and the Decap schema stay Finnish in the theme. Do not add i18n or a strings YAML for those.

Site-specific labels come from content and CMS data:

- Nav and breadcrumbs: titles of `content/tuotteet/_index.md` (and referenssit, kampanjat, sivut, palvelut)
- People / contact headings on content pages: Etusivun asetukset → Henkilöt / Yhteystietolomake titles
- Privacy link: the content item with `layout: privacy` (its title and `url`)

## RSS

`/index.xml` is the site-wide feed of latest public Sisältö (Tuote, Referenssi, Sivu, Kampanja, Palvelu). Section feeds (`/tuotteet/index.xml` etc.) list that type. People, manufacturers, and the privacy page are omitted.

## Requires

Hugo 0.123+ extended.
