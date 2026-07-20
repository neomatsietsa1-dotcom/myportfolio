# How to edit your website (no coding experience needed)

Your site's code lives in one file: **`src/App.jsx`**
Everything below assumes you're editing that file.

---

## 1. Set this up once, so changes go live automatically

1. Create a free account at **github.com**
2. Create a new repository and upload this whole folder to it
   (drag the folder contents onto GitHub's "upload files" screen —
   **skip** the `node_modules` and `dist` folders if present, GitHub
   doesn't need them)
3. Go to **netlify.com** → "Add new site" → "Import an existing project"
   → connect GitHub → pick your new repository
4. When it asks for build settings, enter:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click Deploy.

From now on: any time you edit a file on GitHub's website and click
**"Commit changes"**, Netlify automatically rebuilds and republishes your
live site within a minute or two. No zip files, no re-uploading, ever again.

To edit a file on GitHub: open the file on github.com, click the pencil
(✏️) icon in the top right, make your edit, scroll down, click
"Commit changes."

---

## 2. Changing text

Open `src/App.jsx`. Use your browser's Find (Ctrl+F / Cmd+F) to search
for the exact words you want to change — all the visible text on the
site (headings, paragraphs, project names) appears as plain readable
sentences in the file. Change the words between the quote marks, leave
everything else (the `<tags>` and `{curly braces}`) exactly as it is.

---

## 3. Changing colours

Near the very top of `src/App.jsx`, look for a block that starts with:

```
.cep-root{
  --surface:#FCFCFC;
  --ink:#0A0B08;
  --accent:#0047AB;
  ...
```

Each line is one colour used across the whole site, as a hex code
(`#0047AB` etc). Change the hex code and every element using that
colour updates everywhere. A good free colour picker: coolors.co —
pick a colour there, copy its hex code, paste it in here.

There's a second, similar block just below it starting
`.cep-root[data-theme="dark"]{` — that's the dark mode version of the
same colours (used when someone taps the moon/sun icon).

---

## 4. Adding or changing photos

This is now drag-and-drop simple:

1. Open the **`public/images`** folder in this project
2. Drop your photo in there, e.g. `profile.jpg`
3. In `src/App.jsx`, find the spot you want it, and reference it as
   `/images/profile.jpg`

**Example already wired up:** the About section's photo placeholder
will automatically display `public/images/profile.jpg` the moment you
add a file with that exact name — no code changes needed. Until you
add one, it just shows the dashed placeholder text like before.

**To add a photo somewhere new**, use this pattern:

```jsx
<ImageSlot
  src="/images/your-filename.jpg"
  alt="Describe the photo"
  className="aspect-video w-full cep-card overflow-hidden"
  placeholder="Photo placeholder"
/>
```

`ImageSlot` is a small helper already built into this file — it shows
your photo if the file exists, and falls back to a clean placeholder
if it doesn't, so nothing ever looks broken while you're still
deciding on images.

---

## 5. Editing without GitHub's website (optional, still no install)

If you'd rather edit in a proper code editor with a live preview
instead of GitHub's basic text box:

1. Go to **stackblitz.com**, sign in, and open/import this project
2. Edit files on the left, see the result live on the right
3. Changes here can be pushed straight back to your GitHub repo from
   StackBlitz's built-in Git panel — Netlify picks it up automatically

---

## 6. If you ever need the zip method again

`npm run build` produces a `dist` folder — zip that folder's
*contents* (not the folder itself) and drag the zip onto
**netlify.com/drop** for a one-off manual publish, same as before.
