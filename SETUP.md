# PricePilot Setup Guide

## Overview

PricePilot now includes a **GitHub-based database** solution that allows you to use your GitHub repository as a backend for storing community data. This enables multiple users to contribute to the same database while maintaining version history through Git.

## Features Added

### 1. GitHub Database Integration
- Store all data in JSON files in the `data/` directory
- Automatic fallback to localStorage if GitHub is not configured
- Full CRUD operations via GitHub API
- Version control through Git commits

### 2. User Attribution System
- Every product, store, and price entry shows who created it
- Track who last edited each item
- Display timestamps for all actions
- User tags visible on all listings

### 3. Like/Dislike System
- Users can like or dislike products, stores, and price entries
- Visual indicators showing community sentiment
- Like/dislike counts displayed on cards
- Toggle functionality (like removes dislike and vice versa)

### 4. Photo Upload with Compression
- Camera capture directly from the app
- Automatic image compression (max 800px width, 70% quality)
- Upload from gallery option
- Low-quality images to save bandwidth

### 5. Edit Functionality with History
- Click on any product or store to edit
- Full edit history tracking
- See what changed, when, and by whom
- Collapsible history view

## Setup Instructions

### Step 1: Configure GitHub (Optional but Recommended)

1. **Create a GitHub Personal Access Token**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name like "PricePilot Database"
   - Select scope: `repo` (Full control of private repositories)
   - Click "Generate token" and copy it

2. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file with your values**
   ```env
   VITE_GITHUB_OWNER=your-github-username
   VITE_GITHUB_REPO=PricePilot
   VITE_GITHUB_TOKEN=your_github_token_here
   VITE_GITHUB_BRANCH=main
   ```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Run Development Server

```bash
npm run dev
```

### Step 4: Build for Production

```bash
npm run build
```

### Step 5: Deploy to GitHub Pages

1. **Update your repository settings**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` or `main` (depending on your setup)
   - Folder: `/` or `/docs`

2. **Push the `data/` directory to your repository**
   ```bash
   git add data/
   git commit -m "Initialize database"
   git push
   ```

3. **Deploy**
   ```bash
   npm run build
   # Copy the dist/ folder contents to your GitHub Pages location
   ```

## How It Works

### Database Structure

All data is stored in JSON files in the `data/` directory:

- `Product.json` - Product catalog
- `PriceEntry.json` - Price entries
- `Store.json` - Store information
- `ShoppingList.json` - User shopping lists
- `User.json` - User profiles

### Data Schema

Each entity includes these fields:

```json
{
  "id": "unique-id",
  "created_date": "2026-02-05T12:00:00.000Z",
  "created_by": "user-id",
  "updated_date": "2026-02-05T13:00:00.000Z",
  "updated_by": "user-id",
  "likes": ["user-id-1", "user-id-2"],
  "dislikes": ["user-id-3"],
  "edit_history": [
    {
      "timestamp": "2026-02-05T13:00:00.000Z",
      "user_id": "user-id",
      "changes": {
        "field_name": {
          "old": "old value",
          "new": "new value"
        }
      }
    }
  ]
}
```

### GitHub Integration Flow

1. **Read**: Fetch JSON files from GitHub via API
2. **Write**: Update files through GitHub API commits
3. **Cache**: Store file SHAs for efficient updates
4. **Fallback**: Use localStorage if GitHub is not configured

### Image Storage

Images are stored as base64 data URLs in the JSON files. For production, consider using:
- GitHub LFS (Large File Storage)
- External image hosting (Cloudinary, ImgBB, etc.)
- S3-compatible storage

## Usage

### Adding Products

1. Scan barcode or search for product
2. If not found, click "Add New Product"
3. Fill in product details
4. Use "Take Photo" or "Upload Photo" for images
5. Photos are automatically compressed
6. Submit to add to community database

### Editing Products/Stores

1. Click on any product or store card
2. Edit dialog opens with current information
3. Make your changes
4. Click "Save Changes"
5. Edit is recorded in history with your user ID

### Liking/Disliking

1. Click thumbs up to like
2. Click thumbs down to dislike
3. Click again to remove your vote
4. Counts update in real-time

## Troubleshooting

### GitHub API Rate Limits

- Unauthenticated: 60 requests/hour
- Authenticated: 5,000 requests/hour
- Solution: Always use a GitHub token

### Images Not Loading

- Check if base64 data is too large
- Consider using external image hosting
- Verify image compression is working

### Data Not Persisting

- Check if GitHub token has correct permissions
- Verify repository and branch names in `.env`
- Check browser console for errors
- Ensure `data/` directory exists in repository

### Fallback to localStorage

If GitHub is not configured, the app automatically uses localStorage:
- Data is stored only in your browser
- Not shared across devices or users
- Cleared when browser cache is cleared

## Security Considerations

1. **Never commit `.env` file** - It contains your GitHub token
2. **Use environment variables** - For production deployments
3. **Token permissions** - Only grant necessary repo access
4. **Rate limiting** - Implement caching to reduce API calls
5. **Input validation** - Sanitize user inputs before storing

## Future Enhancements

Consider these improvements:

1. **Real-time sync** - WebSocket or polling for live updates
2. **Conflict resolution** - Handle concurrent edits
3. **Image optimization** - Use external CDN
4. **Search indexing** - Implement full-text search
5. **Analytics** - Track popular products and stores
6. **Moderation** - Flag inappropriate content
7. **User profiles** - Enhanced user system with avatars

## Support

For issues or questions:
1. Check the GitHub repository issues
2. Review the code documentation
3. Test with localStorage fallback first
4. Verify GitHub API connectivity

## License

This project is open source and available under the MIT License.
