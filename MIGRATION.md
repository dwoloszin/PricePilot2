# Migration Guide

## Migrating from localStorage to GitHub Database

If you've been using PricePilot with localStorage and want to migrate to the GitHub database system, follow these steps:

### Step 1: Export Existing Data

Open your browser console (F12) and run:

```javascript
// Export all data
const exportData = {
  products: JSON.parse(localStorage.getItem('pricepilot_Product') || '[]'),
  priceEntries: JSON.parse(localStorage.getItem('pricepilot_PriceEntry') || '[]'),
  stores: JSON.parse(localStorage.getItem('pricepilot_Store') || '[]'),
  shoppingLists: JSON.parse(localStorage.getItem('pricepilot_ShoppingList') || '[]')
};

// Download as JSON
const dataStr = JSON.stringify(exportData, null, 2);
const dataBlob = new Blob([dataStr], {type: 'application/json'});
const url = URL.createObjectURL(dataBlob);
const link = document.createElement('a');
link.href = url;
link.download = 'pricepilot-backup.json';
link.click();
```

### Step 2: Add Required Fields

The new system requires additional fields. Run this script to update your data:

```javascript
// Add required fields to exported data
function migrateData(data, userId = 'migrated-user') {
  const now = new Date().toISOString();
  
  return data.map(item => ({
    ...item,
    created_by: item.created_by || userId,
    created_date: item.created_date || now,
    updated_by: item.updated_by || userId,
    updated_date: item.updated_date || now,
    likes: item.likes || [],
    dislikes: item.dislikes || [],
    edit_history: item.edit_history || []
  }));
}

// Apply migration
const migratedData = {
  products: migrateData(exportData.products),
  priceEntries: migrateData(exportData.priceEntries),
  stores: migrateData(exportData.stores),
  shoppingLists: migrateData(exportData.shoppingLists)
};

// Download migrated data
const migratedStr = JSON.stringify(migratedData, null, 2);
const migratedBlob = new Blob([migratedStr], {type: 'application/json'});
const migratedUrl = URL.createObjectURL(migratedBlob);
const migratedLink = document.createElement('a');
migratedLink.href = migratedUrl;
migratedLink.download = 'pricepilot-migrated.json';
migratedLink.click();
```

### Step 3: Upload to GitHub

1. **Create the data files in your repository:**

```bash
cd PricePilot
mkdir -p data
```

2. **Copy the migrated data:**

From your downloaded `pricepilot-migrated.json`, extract each array:

```bash
# Create individual JSON files
echo '[...]' > data/Product.json
echo '[...]' > data/PriceEntry.json
echo '[...]' > data/Store.json
echo '[...]' > data/ShoppingList.json
echo '[]' > data/User.json
```

3. **Commit and push:**

```bash
git add data/
git commit -m "Migrate data from localStorage to GitHub"
git push
```

### Step 4: Configure GitHub Integration

1. Create `.env` file with your GitHub credentials (see SETUP.md)
2. Restart the application
3. Verify data loads correctly

### Step 5: Clear localStorage (Optional)

Once you've confirmed everything works:

```javascript
// Clear old localStorage data
localStorage.removeItem('pricepilot_Product');
localStorage.removeItem('pricepilot_PriceEntry');
localStorage.removeItem('pricepilot_Store');
localStorage.removeItem('pricepilot_ShoppingList');
```

## Troubleshooting

### Data Not Showing After Migration

1. Check browser console for errors
2. Verify GitHub token has correct permissions
3. Ensure data files are in the correct format
4. Try accessing files directly via GitHub API

### Duplicate Data

If you see duplicate entries:

1. Clear localStorage completely
2. Refresh the page
3. Data should now only come from GitHub

### Performance Issues

If the app is slow after migration:

1. Reduce image sizes in data files
2. Implement caching (see SETUP.md)
3. Consider pagination for large datasets

## Rollback

If you need to rollback to localStorage:

1. Remove or rename `.env` file
2. Restore localStorage from backup:

```javascript
const backup = /* your backup data */;
localStorage.setItem('pricepilot_Product', JSON.stringify(backup.products));
localStorage.setItem('pricepilot_PriceEntry', JSON.stringify(backup.priceEntries));
localStorage.setItem('pricepilot_Store', JSON.stringify(backup.stores));
localStorage.setItem('pricepilot_ShoppingList', JSON.stringify(backup.shoppingLists));
```

3. Refresh the page

## Best Practices

1. **Always backup** before migrating
2. **Test with small datasets** first
3. **Verify data integrity** after migration
4. **Monitor GitHub API usage** to avoid rate limits
5. **Keep localStorage backup** for a few days

## Support

If you encounter issues during migration:

1. Check the error messages in console
2. Review the SETUP.md guide
3. Open an issue on GitHub
4. Include your error logs (remove sensitive data)
