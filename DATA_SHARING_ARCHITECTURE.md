# Data Sharing Architecture

## Overview
This document explains how data is shared and organized between users in PricePilot.

---

## Entity Types

### 🌍 SHARED ENTITIES (Global, All Users)
These entities are visible and editable by all users. Data is contributed collaboratively.

#### **Product**
- **Visibility**: All users see all products
- **Description**: Community product database
- **User Tracking**: `created_by`, `created_by_name` (shows who added it)
- **Collaborative Features**: 
  - `likes[]` - Array of user IDs who liked it
  - `dislikes[]` - Array of user IDs who disliked it
  - `edit_history[]` - All edits by any user

#### **Store**
- **Visibility**: All users see all stores
- **Description**: Community store database
- **User Tracking**: `created_by`, `created_by_name` (shows who added it)
- **Collaborative Features**:
  - `likes[]` - Array of user IDs who liked it
  - `dislikes[]` - Array of user IDs who disliked it
  - `edit_history[]` - All edits by any user

#### **PriceEntry**
- **Visibility**: All users see all price entries (enables price comparison)
- **Description**: Price observations from any store, by any user
- **User Tracking**: `created_by`, `created_by_name` (shows who recorded the price)
- **Purpose**: Builds shared database of pricing across locations and time

---

### 👤 PRIVATE ENTITIES (Per-User)
These entities are visible **only to the user who created them**.

#### **ShoppingList**
- **Visibility**: Each user only sees their own shopping lists
- **Privacy**: Private to individual user (filtered by `user_id`)
- **Description**: Personal shopping plans and budgets
- **Non-Shareable**: Other users cannot see or access shopping lists

---

## Implementation Details

### Backend Data Access
Located in `[src/api/githubDbClient.js](../src/api/githubDbClient.js)`

```javascript
// SHARED ENTITIES - Return all items regardless of user
await base44.entities.Product.list()
await base44.entities.Store.list()
await base44.entities.PriceEntry.list()

// PRIVATE ENTITIES - Filter by userId
await base44.entities.ShoppingList.list(sort, limit, userId)
```

### Frontend Usage Examples

**Loading Shared Products (Visible to All):**
```javascript
const { data: products = [] } = useQuery({
  queryKey: ['products'],
  queryFn: () => base44.entities.Product.list('-created_date')
  // Returns all products from all users - NO filtering needed
});
```

**Loading Private Shopping Lists (User Only):**
```javascript
const { data: lists = [] } = useQuery({
  queryKey: ['shopping-lists', user?.id],
  queryFn: () => base44.entities.ShoppingList.list('-created_date', null, user?.id)
  // Automatically filtered by userId parameter
});
```

---

## Common Questions

### Q: Why aren't my products visible to other users?
**Check**: 
- Ensure products are being loaded with `base44.entities.Product.list()` **without** any `user_id` filtering
- Products should be created without a `user_id` field (they use `created_by` instead)
- Verify GitHub/localStorage database is being queried (check browser console)

### Q: Can users see other users' shopping lists?
**No**. ShoppingLists are always filtered by `user_id`, even if you try to access them directly.

### Q: How do likes/dislikes work?
- Any user can like or dislike shared items (Product, Store, PriceEntry)
- Each item has `likes[]` and `dislikes[]` arrays containing user IDs
- These are shared and visible across all users
- Conflicts resolved: A user cannot like AND dislike the same item simultaneously

### Q: Who can edit products/stores?
- Any user can edit shared items (Product, Store, PriceEntry)
- All edits are tracked in `edit_history[]` with timestamp and user info
- All versions remain visible in the edit history

---

## Database Schema Notes

### Shared Entity Structure
```javascript
{
  id: "unique_id",
  name: "...",
  created_by: "user_id",           // Who created it
  created_by_name: "User Name",    // Friendly name
  created_date: "2024-01-01T...",
  updated_by: "user_id",           // Last editor
  updated_by_name: "User Name",
  updated_date: "2024-01-01T...",
  likes: ["user_id_1", "user_id_2"],        // Shared: Who likes it
  dislikes: ["user_id_3"],                  // Shared: Who dislikes it
  edit_history: [                   // Shared: All edits tracked
    {
      timestamp: "...",
      user_id: "...",
      user_name: "...",
      changes: [...]
    }
  ]
}
```

### Private Entity (ShoppingList) Structure
```javascript
{
  id: "unique_id",
  name: "...",
  user_id: "user_id",              // PRIVACY: Only visible to this user
  items: [...],
  created_date: "2024-01-01T...",
  // ... other fields
}
```

---

## Migration Path

If you need to change an entity from shared to private (or vice versa):

1. **Update githubDbClient.js**:
   - Add/remove from `PRIVATE_ENTITIES` array
   - Re-run the app

2. **Existing Data**: 
   - Shared→Private: You'll need to manually filter or migrate old data
   - Private→Shared: All existing data becomes globally visible

3. **Update Frontend**: 
   - Check all pages that reference the entity
   - Add/remove userId parameter from list() calls

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Products not showing | Wrong entity name | Check entity name matches exactly |
| Seeing other users' shopping lists | Client-side filtering issue | Use userId parameter in list() |
| Likes not syncing | Not using toggleLike() | Use UI component or explicit API call |
| Edit history not saving | Data not passed to update() | Ensure update() is called, not direct mutation |
