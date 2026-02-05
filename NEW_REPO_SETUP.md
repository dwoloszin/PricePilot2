# PricePilot - New Repository Setup Guide

This guide will help you set up a new GitHub repository for PricePilot with all the fixes included.

## 1. Create a New GitHub Repository
1. Go to [GitHub](https://github.com) and create a new **Public** or **Private** repository.
2. Name it `PricePilot` (or any name you prefer).
3. Do **not** initialize it with a README or license.

## 2. Upload the Files
1. Extract the provided `PricePilot_Full_Fixed.zip`.
2. Open your terminal/command prompt in the extracted folder.
3. Run the following commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit with barcode scanner fixes"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## 3. Configure Environment Variables
For the app to work with GitHub as a database, you need to set up the following secrets in your repository settings (**Settings > Secrets and variables > Actions**):

| Variable | Description |
|----------|-------------|
| `VITE_GITHUB_OWNER` | Your GitHub username |
| `VITE_GITHUB_REPO` | The name of your new repository |
| `VITE_GITHUB_TOKEN` | A Personal Access Token (Classic) with `repo` scope |
| `VITE_GITHUB_BRANCH` | `main` |

## 4. Enable GitHub Pages
1. Go to **Settings > Pages**.
2. Under **Build and deployment**, set **Source** to `GitHub Actions`.
3. The app includes a `.github/workflows/deploy.yml` (if present) that will automatically handle the deployment.

## 5. Barcode Scanner Fixes Included
- **Database Priority**: Checks your local DB first (3s timeout).
* **API Fallback**: Checks OpenFoodFacts API (4s timeout).
* **Integrity Checks**: Automatically repairs corrupted database files.
* **Layout Fix**: Resolved the "white screen" conflict between the scanner and the main app layout.

---
**Note**: Make sure your Personal Access Token has permissions to write to the repository so the app can save your data!
