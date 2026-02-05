# Changelog

## Version 2.0.0 - Enhanced Community Features

### 🎉 Major Features Added

#### 1. GitHub-Based Database System
- **New File**: `src/api/githubDbClient.js`
  - Complete GitHub API integration for data storage
  - Automatic fallback to localStorage when GitHub is not configured
  - File caching for efficient updates
  - Support for all CRUD operations via GitHub commits

#### 2. User Attribution System
- **New Component**: `src/components/ui/user-tag.jsx`
  - Display user who created/edited items
  - Show timestamps with human-readable format
  - Configurable sizes (small, default, large)
  - Integrated into all product and store listings

#### 3. Like/Dislike System
- **New Component**: `src/components/ui/like-dislike.jsx`
  - Thumbs up/down voting for products, stores, and prices
  - Visual indicators for user's vote
  - Real-time count updates
  - Toggle functionality (like removes dislike)
  - Database methods: `toggleLike()`, `toggleDislike()`

#### 4. Photo Upload with Compression
- **New Component**: `src/components/ui/camera-capture.jsx`
  - Direct camera access for photo capture
  - Live camera preview with capture/retake options
  - Gallery upload option
  - Automatic image compression (max 800px, 70% quality)
  - Base64 encoding for GitHub storage
  - Integrated into product forms

#### 5. Edit History Tracking
- **New Component**: `src/components/ui/edit-history.jsx`
  - Complete audit trail of all changes
  - Shows what changed, when, and by whom
  - Collapsible history view
  - Old vs new value comparison
  - Automatic tracking on all updates

#### 6. Edit Dialogs
- **New Component**: `src/components/products/ProductEditDialog.jsx`
  - Full product editing interface
  - Integrated history view
  - Like/dislike buttons
  - Photo upload/capture
  - User attribution display

- **New Component**: `src/components/stores/StoreEditDialog.jsx`
  - Complete store editing interface
  - Same features as product dialog
  - Location coordinates editing

### 📝 Updated Components

#### ProductCard.jsx
- Added like/dislike buttons
- Added user attribution tags
- Added click handlers for edit dialog
- Enhanced visual feedback

#### CommunityProductForm.jsx
- Integrated CameraCapture component
- Replaced old upload button with new system
- Added automatic compression
- Enhanced user experience

### 🗄️ Database Structure

#### New Data Directory
- `data/Product.json` - Product catalog
- `data/PriceEntry.json` - Price entries
- `data/Store.json` - Store information
- `data/ShoppingList.json` - Shopping lists
- `data/User.json` - User profiles
- `data/README.md` - Database documentation

#### Enhanced Data Schema
All entities now include:
```json
{
  "created_by": "user-id",
  "created_date": "ISO-8601 timestamp",
  "updated_by": "user-id",
  "updated_date": "ISO-8601 timestamp",
  "likes": ["user-id-1", "user-id-2"],
  "dislikes": ["user-id-3"],
  "edit_history": [
    {
      "timestamp": "ISO-8601",
      "user_id": "user-id",
      "changes": {
        "field": { "old": "value", "new": "value" }
      }
    }
  ]
}
```

### 📚 Documentation

#### New Files
- `SETUP.md` - Comprehensive setup and configuration guide
- `MIGRATION.md` - Guide for migrating from localStorage
- `CHANGELOG.md` - This file
- `.env.example` - Environment variables template
- `data/README.md` - Database structure documentation

#### Updated Files
- `README.md` - Enhanced with new features and usage instructions

### 🔧 Configuration

#### Environment Variables
New `.env` configuration:
```env
VITE_GITHUB_OWNER=your-username
VITE_GITHUB_REPO=PricePilot
VITE_GITHUB_TOKEN=your_token
VITE_GITHUB_BRANCH=main
```

### 🚀 Deployment

#### GitHub Pages Ready
- All data stored in repository
- No external database required
- Version control through Git
- Easy deployment to GitHub Pages

### 🔄 Migration Support

#### Backward Compatibility
- Automatic fallback to localStorage
- No breaking changes for existing users
- Migration scripts provided
- Data export/import tools

### 🛠️ Technical Improvements

#### Code Quality
- Modular component architecture
- Reusable UI components
- Clean separation of concerns
- Comprehensive error handling

#### Performance
- Image compression reduces bandwidth
- File caching for GitHub API
- Efficient data fetching
- Optimized re-renders

#### User Experience
- Intuitive edit interfaces
- Clear visual feedback
- Responsive design
- Accessible components

### 📊 API Changes

#### New Methods
- `base44.entities.*.toggleLike(id, userId)`
- `base44.entities.*.toggleDislike(id, userId)`
- `base44.integrations.Core.UploadFile({ file, compress })`
- `base44.compressImage(file, maxWidth, quality)`

#### Enhanced Methods
- `create()` - Now tracks user and adds default fields
- `update()` - Now tracks changes in edit_history
- All methods support async/await with GitHub

### 🐛 Bug Fixes
- Fixed image upload handling
- Improved error messages
- Enhanced data validation
- Better loading states

### 🔐 Security Considerations
- GitHub token stored in environment variables
- Input sanitization on all forms
- Rate limiting awareness
- Secure file uploads

### 📱 Mobile Support
- Camera access on mobile devices
- Responsive edit dialogs
- Touch-friendly interfaces
- Optimized for small screens

### 🎨 UI Enhancements
- New like/dislike buttons
- User attribution badges
- Edit history timeline
- Camera capture modal
- Enhanced product cards

### 🔮 Future Roadmap
- Real-time synchronization
- Conflict resolution
- User profiles with avatars
- Advanced search and filtering
- Analytics dashboard
- Moderation tools
- Push notifications
- Offline support

---

## Version 1.0.0 - Initial Release

- Basic product catalog
- Price tracking
- Barcode scanning
- Shopping lists
- Store locator
- Price history charts
- localStorage persistence

---

**For detailed setup instructions, see [SETUP.md](./SETUP.md)**

**For migration from v1.0, see [MIGRATION.md](./MIGRATION.md)**
