# Data Sharing - Troubleshooting Guide

## What Was Fixed ✓

Your app had **React Query and localStorage cache persistence** causing data from User A to appear for User B. Here are the fixes applied:

### 1. **Query Cache Clearing** (react-query)
- When User A logs out → All cached data is cleared
- When User B logs in → Fresh queries are forced
- Prevents old user's data from appearing for new user

### 2. **Database Cache Clearing** (localStorage)
- When User A logs out → Database cache is removed  
- When User B logs in → Cache is cleared to ensure fresh fetch
- Prevents stale products/stores from previous user appearing

### 3. **Better Logging**
- Console logs show where data comes from (GitHub vs localStorage)
- Console logs show when data is saved
- Helps diagnose why sharing isn't working

---

## How to Test Data Sharing

### Step 1: Check Your Environment Setup

**Open Browser DevTools Console** (F12 → Console tab)

**Run this diagnostic:**
```javascript
window.priceDebug.checkSetup()
```

**Expected Output:**
```
📊 PricePilot Setup Check
======================
✓ GitHub Owner: YOUR_GITHUB_USERNAME
✓ GitHub Repo: YOUR_REPO_NAME
✓ GitHub Token: ✓ SET

📦 LocalStorage Database Cache:
  Product: 0 items
  PriceEntry: 0 items
  Store: 0 items
  ShoppingList: 0 items
  User: 0 items

👤 Current User:
  ID: google_id_here
  Name: Your Name

🔗 Data Source:
  → Using GitHub (Server)
```

### ⚠️ If You See This:
```
✗ GitHub Owner: NOT SET
✗ GitHub Repo: NOT SET
✗ GitHub Token: ✗ NOT SET

🔗 Data Source:
  → Using LocalStorage only (No GitHub configured)
  ⚠️  Data is NOT shared between users!
```

**SOLUTION**: You need to set environment variables. See "GitHub Configuration" section below.

---

## Step 2: Test with Two User Accounts

### User A:
1. Log in with your first Google account
2. Go to Scanner
3. Scan a barcode (or create a test product manually)
4. **Verify in console**: `window.priceDebug.showData('Product')`
   - Should show the new product you just created

### User B:
1. **Log out completely** (User A)
2. Log in with your second Google account
3. Go to Products page
4. **Check if User A's product appears**

**If product appears**: ✅ Data sharing is working!

**If product doesn't appear**: 
- Check console logs: `[DB] Product: X items from GitHub/localStorage`
- Is it `localStorage (no GitHub config)`? → GitHub not configured
- Run `window.priceDebug.clearCache()` and refresh → Try again

---

## GitHub Configuration Required

For data to be **truly shared** between users, you MUST configure GitHub.

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com)
2. Create a new public repository (e.g., `pricepilot-db`)
3. Create a `data/` folder in the repo (with empty JSON files inside)
4. Create a Personal Access Token for authentication

### Step 2: Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Copy the token (you'll only see it once!)

### Step 3: Set Environment Variables

Create a `.env.local` file in your project root (alongside `vite.config.js`):

```env
VITE_GITHUB_OWNER=your_github_username
VITE_GITHUB_REPO=pricepilot-db
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

### Step 4: Restart the Dev Server

```bash
npm run dev
```

### Step 5: Test Again

Now run `window.priceDebug.checkSetup()` and you should see:
- GitHub configured ✓
- Data source showing "GitHub" instead of "localStorage"

---

## Console Logging Guide

### What These Messages Mean:

```javascript
[DB] Product: 5 items from GitHub
→ Data was fetched from GitHub (good for sharing!)

[DB] Product: 0 items from localStorage (no GitHub config)
→ GitHub isn't set up, data only stored locally

[DB] Product: Saved 5 items to GitHub
→ Data was successfully saved to GitHub

[DB] Product: Saved 5 items to localStorage (GitHub failed)
→ GitHub save failed, fell back to localStorage only
→ Check GitHub token and permissions
```

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Products not showing for User B | GitHub not configured | Set environment variables (.env.local) |
| GitHub save fails | Invalid token | Check token is correct and hasn't expired |
| GitHub token error | Token expired | Generate new token in GitHub settings |
| localStorage shows old data | Cache not cleared | Run `window.priceDebug.clearCache()` then refresh |
| Only localStorage in logs | VITE_ vars not loaded | Restart dev server after adding .env.local |

---

## Manual Data Clearing (if needed)

If you need to completely reset the database cache:

```javascript
// Option 1: Use diagnostic tool
window.priceDebug.clearCache()

// Option 2: Manual clear
localStorage.removeItem('pricepilot_db_data/Product.json')
localStorage.removeItem('pricepilot_db_data/Store.json')
localStorage.removeItem('pricepilot_db_data/PriceEntry.json')
```

Then refresh the page (F5).

---

## Verify Data Sync Works

Once GitHub is configured:

### Test 1: Same Browser, Different Users
1. User A logs in → Creates product
2. Check console: `[DB] Product: Saved X items to GitHub` ✓
3. User A logs out
4. User B logs in → Goes to Products page
5. Check console: `[DB] Product: X items from GitHub` ✓
6. Product from User A should be visible ✓

### Test 2: Different Browsers
1. Browser 1: User A logs in → Creates product
2. Browser 2: User B logs in → Refreshes Products page
3. Product from User A should be visible in Browser 2 ✓

---

## Still Not Working?

### Checklist:
- [ ] Environment variables set? (`window.priceDebug.checkSetup()`)
- [ ] GitHub token valid? (In GitHub settings)
- [ ] Dev server restarted after .env.local? (npm run dev)
- [ ] Browser cache cleared? (Ctrl+Shift+Delete)
- [ ] Both users logged in at different times? (not simultaneously)
- [ ] Checked browser console for [DB] logs? (F12 → Console)

### Debug Steps:
1. Run `window.priceDebug.checkSetup()` and screenshot output
2. Create a product as User A
3. Check console for `[DB] Product: Saved` message
4. Log out completely
5. Log in as User B
6. Check console for `[DB] Product: X items from` message
7. Note the "from" value - is it GitHub or localStorage?

---

## For Production (GitHub Pages + GitHub Backend)

When deployed to GitHub Pages with GitHub backend:

```env
VITE_GITHUB_OWNER=your_username
VITE_GITHUB_REPO=your_db_repo
VITE_GITHUB_TOKEN=your_token
VITE_GITHUB_BRANCH=main
```

The app will:
- Fetch shared data from GitHub on each page load
- Save new/updated data to GitHub automatically
- Fall back to localStorage if GitHub fails
- Sync automatically across all browser sessions

---

## Questions?

Check these files:
- Data flow: [src/api/githubDbClient.js](../src/api/githubDbClient.js)
- Auth & cache clearing: [src/lib/AuthContext.jsx](../src/lib/AuthContext.jsx)
- Query cache: [src/lib/query-client.js](../src/lib/query-client.js)
- Data architecture: [DATA_SHARING_ARCHITECTURE.md](./DATA_SHARING_ARCHITECTURE.md)
