# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


Here is your complete, ready-to-use **`README.md`** file. You can copy and paste this entire block directly into your `README.md` file and save it:

```markdown
# Neo Matsietsa — Civil Engineering Portfolio

A modern, responsive personal portfolio website built to showcase my academic background, consulting experience in transport planning and infrastructure design, and progress as an ECSA Candidate Engineer.

## 🚀 Tech Stack

- **Frontend Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Interactive Maps:** OpenStreetMap Embed (Hatfield, Pretoria)
- **Deployment:** Ready for GitHub Pages / Netlify / Vercel

---

## 🛠️ Getting Started Locally

If you are setting up this project on a new computer for the first time:

### 1. Clone the repository
```bash
git clone [https://github.com/neomatsietsa1-dotcom/myportfolio.git](https://github.com/neomatsietsa1-dotcom/myportfolio.git)
cd myportfolio

```

### 2. Install dependencies

*(Required the first time you clone the repo or after adding new packages)*

```bash
npm install

```

### 3. Start the development server

```bash
npm run dev

```

Open your browser and navigate to `http://localhost:5173` to view the live site.

---

## 🔄 Daily Git Workflow (Work PC ↔ Personal PC)

Use this quick reference when moving between computers to ensure code is always in sync:

### Step 1: When starting a coding session (Always do first!)

Download the latest changes from GitHub before making any edits:

```bash
git pull
npm run dev

```

### Step 2: When saving and uploading changes to GitHub

Once you are done editing and want to push your updates online:

```bash
# 1. Stage all modified files
git add .

# 2. Save a snapshot with a descriptive message
git commit -m "Describe what you changed here"

# 3. Upload to GitHub
git push

```

### ⚠️ Troubleshooting Quick-Fixes

* **If `git push` is rejected (e.g., "Updates were rejected"):**
You likely made edits on another computer and forgot to pull first. Sync and push safely:
```bash
git pull origin main --rebase
git push

```


* **If `node_modules` is ever accidentally tracked again:**
```bash
git rm -r --cached node_modules
git commit -m "Remove node_modules from tracking"
git push

```



---

## 📬 Contact

* **Name:** Neo Matsietsa
* **Role:** Civil Engineering Graduate (Wits) | ECSA Candidate Engineer — Transport & Infrastructure
* **GitHub:** [@neomatsietsa1-dotcom](https://www.google.com/search?q=https://github.com/neomatsietsa1-dotcom)

```

Once you save this file, you can upload it to GitHub using your new workflow:

```bash
git add README.md
git commit -m "Added complete project README and Git workflow instructions"
git push

```