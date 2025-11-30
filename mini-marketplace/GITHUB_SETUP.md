# How to Push Your Code to GitHub

It looks like **Git is not installed** or not available in your terminal. Follow these steps to get your code on GitHub.

## Step 1: Install Git
1.  Download Git from [git-scm.com](https://git-scm.com/downloads).
2.  Run the installer. **Important**: During installation, make sure to select "Git from the command line and also from 3rd-party software" (this adds Git to your PATH).
3.  After installation, **restart your computer** or at least restart VS Code.

## Step 2: Create a Repository on GitHub
1.  Go to [github.com/new](https://github.com/new).
2.  Enter a repository name (e.g., `mini-marketplace`).
3.  Choose **Public** or **Private**.
4.  **Do not** initialize with README, .gitignore, or License (we already have these).
5.  Click **Create repository**.

## Step 3: Push Your Code
Once Git is installed, open a new terminal in VS Code (`Ctrl+Shift+\``) and run these commands one by one:

```bash
# 1. Initialize Git
git init

# 2. Add all files
git add .

# 3. Commit your changes
git commit -m "Initial commit: Mini-Marketplace with Cart and Wishlist"

# 4. Link to your GitHub repo (Replace YOUR_USERNAME with your actual username)
git remote add origin https://github.com/Kulkarni-Atharv/mini-marketplace.git

# 5. Push to GitHub
git push -u origin master
```

> **Note**: If `git push` fails because the branch is called `main` instead of `master`, try `git push -u origin main`.

## Alternative: Upload Files Manually
If you don't want to install Git right now:
1.  Go to your new repository on GitHub.
2.  Click **"uploading an existing file"**.
3.  Drag and drop your project files (excluding `node_modules` and `.git` folder).
4.  Commit changes.
