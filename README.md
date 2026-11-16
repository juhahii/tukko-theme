# Tukko theme

Hugo layouts, CSS, JS, archetypes, and Decap CMS schema for small Finnish business sites.

This repository (`juhahii/tukko-theme`) is the **engine**. Client sites (lampo-uus, tukko-demo, …) keep their own `content/`, `data/`, `assets/media/`, and `hugo.toml`, and pull this repo as `themes/tukko`.

## Where to edit

Theme work belongs **in this repo**, not in a site’s `content/` or `data/`.

Inside a site that already has the submodule, `themes/tukko` **is** this repository checked out. Edit there, commit, and push to `tukko-theme` `main`. Then bump the site’s submodule pointer so that project (and any other project) can pick up the same commit.

```bash
# 1. Theme change
cd themes/tukko
# edit layouts/, static/, archetypes/, …
git add -A && git commit -m "…" && git push origin main

# 2. Point this site at the new theme commit
cd ../..
git add themes/tukko
git commit -m "Bump Tukko theme."
git push

# 3. Other sites
cd /path/to/other-site
git submodule update --remote themes/tukko
git add themes/tukko && git commit -m "Bump Tukko theme." && git push
```

Do **not** copy `themes/tukko` into a site as a regular folder. Site-only content stays in the site repo (`data/frontpage.yaml`, `content/`, logos, Netlify settings).

Netlify needs the HTTPS submodule URL (`https://github.com/juhahii/tukko-theme.git`). SSH (`git@github.com:…`) fails on the build image.

## Use in a site

Copy `hugo.toml.example` to the site root as `hugo.toml` and set `baseURL` and `title`.

```bash
git submodule add https://github.com/juhahii/tukko-theme.git themes/tukko
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

Frontpage sections live in `data/frontpage.yaml` as a list (`sections`). Each block has the same fields: copy, image, **Osion asettelu** (default / hero), **Näkymä** (how listed items look), and **Listaa sisältöä** (optional content type, people, manufacturers, or the contact form).

## Language

Tukko is **Finnish-only**. Buttons, 404, consent UI, form labels, and the Decap schema stay Finnish in the theme. Do not add i18n or a strings YAML for those.

Site-specific labels come from content and CMS data:

- Nav and breadcrumbs: titles of `content/tuotteet/_index.md` (and referenssit, kampanjat, sivut, palvelut)
- Frontpage headings: Etusivun asetukset → each section’s Otsikko
- Privacy link: the content item with `layout: privacy` (its title and `url`)

## RSS

`/index.xml` is the site-wide feed of latest public Sisältö (Tuote, Referenssi, Sivu, Kampanja, Palvelu). Section feeds (`/tuotteet/index.xml` etc.) list that type. People, manufacturers, and the privacy page are omitted.

## Requires

Hugo 0.123+ extended.
