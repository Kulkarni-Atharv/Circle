@echo off
echo ==========================================
echo  Pushing Mini-Marketplace to GitHub
echo ==========================================

echo 1. Initializing Git...
git init

echo 2. Adding files...
git add .

echo 3. Committing changes...
git commit -m "Initial commit: Mini-Marketplace complete with Cart and Wishlist"

echo 4. Renaming branch to main...
git branch -M main

echo 5. Adding remote origin...
git remote remove origin
git remote add origin https://github.com/Kulkarni-Atharv/Mini-Marketplace.git

echo 6. Pushing to GitHub...
git push -u origin main

echo ==========================================
echo  Done!
echo ==========================================
pause
