# ramyara.com

Everything on the site comes from the small text files in the `_data` folder.
To change the site, edit one of those files on GitHub and click **Commit changes**.
The live site updates on its own within a minute or two.

## Which file changes what

| File | What it controls |
| --- | --- |
| `_data/profile.yml` | Headline, "Now" and "What's next" notes, contact details, portrait |
| `_data/background.yml` | The Background tab, as chapters with what ran alongside |
| `_data/dots.yml` | Every dot on the map and the story behind it |
| `_data/buckets.yml` | The four buckets on the map |
| `_data/organizations.yml` | Organizations shown when someone clicks a bucket |
| `_data/writing.yml` | Writing & projects |
| `_data/recs.yml` | Recommendations |
| `_data/photos.yml` | The "Through my lens" photo grid |
| `assets/photos/` | The photo files themselves |

## How to edit on GitHub

1. Open the file (for example `_data/recs.yml`).
2. Click the pencil icon.
3. Make your change, then click **Commit changes**.

## Common updates

**Add a recommendation.** In `_data/recs.yml`, copy one entry (all its lines, starting with `- title:`), paste it at the top of the list, and change the words.

**Add a dot to the map.** In `_data/dots.yml`, copy one entry and change it. You can leave out `x` and `y`; the site finds a free spot for you. Use `buckets: [community]` or several, like `buckets: [tech, impact]`.

**Add a photo.** Upload the file into `assets/photos/` (Add file → Upload files), then add its file name to `_data/photos.yml` or to a dot's `photos:` list. Photos under about 1,400 pixels wide keep the site fast.

**Links** in any text look like `[words people see](https://the-link.com)`.
**Green italic words** in the headline look like `*tech*`.

**Add a logo on the Background tab.** Upload the logo (PNG or SVG) into `assets/logos/`, then put its file name after `logo:` on a chapter or an "alongside" item in `_data/background.yml`. Logos show in grey so they all match.

**Tabs.** Each tab has its own link you can share: `ramyara.com/#writing`, `#photos`, `#recs`, `#background`, `#say-hi`.

## If the site didn't update

A small typo in one of these files stops the update, and the old version stays live, so nothing breaks.
Open the **Actions** tab in the repository: a red X means the last change had a problem.
The usual causes:

- Text that contains a colon (`:`) needs quotes around it: `text: "Note: like this"`.
- Lines inside an entry must line up with the same number of spaces as the entry you copied.
- Each entry in a list starts with `- `.

Fix the line and commit again.

## Keep these files

`CNAME` connects the site to ramyara.com, and `_config.yml` holds the site settings. Don't delete either one.
