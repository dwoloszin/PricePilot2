# Quick Reference Guide

## Using the New Components

### Like/Dislike Component

```jsx
import { LikeDislike } from '@/components/ui/like-dislike';

<LikeDislike
  likes={item.likes || []}
  dislikes={item.dislikes || []}
  currentUserId={currentUser?.id}
  onLike={async () => {
    await base44.entities.Product.toggleLike(item.id, currentUser.id);
  }}
  onDislike={async () => {
    await base44.entities.Product.toggleDislike(item.id, currentUser.id);
  }}
  size="default"  // small, default, large
  showCounts={true}
/>
```

### User Tag Component

```jsx
import { UserTag } from '@/components/ui/user-tag';

<UserTag
  userId={item.created_by}
  userName={item.created_by_name}
  timestamp={item.created_date}
  action="created"  // or "edited"
  size="default"
/>
```

### Camera Capture Component

```jsx
import { CameraCapture } from '@/components/ui/camera-capture';

<CameraCapture
  onCapture={async (file) => {
    const { file_url } = await base44.integrations.Core.UploadFile({ 
      file, 
      compress: true 
    });
    setImageUrl(file_url);
  }}
  onUpload={(e) => {
    const file = e.target.files?.[0];
    // handle file upload
  }}
  isUploading={uploading}
/>
```

### Edit History Component

```jsx
import { EditHistory } from '@/components/ui/edit-history';

<EditHistory history={item.edit_history || []} />
```

### Product Edit Dialog

```jsx
import { ProductEditDialog } from '@/components/products/ProductEditDialog';

const [editProduct, setEditProduct] = useState(null);
const [showEdit, setShowEdit] = useState(false);

<ProductEditDialog
  product={editProduct}
  open={showEdit}
  onOpenChange={setShowEdit}
  onSave={(updated) => {
    // refresh your data
  }}
  currentUserId={currentUser?.id}
/>
```

### Store Edit Dialog

```jsx
import { StoreEditDialog } from '@/components/stores/StoreEditDialog';

<StoreEditDialog
  store={selectedStore}
  open={showStoreEdit}
  onOpenChange={setShowStoreEdit}
  onSave={(updated) => {
    // refresh your data
  }}
  currentUserId={currentUser?.id}
/>
```

## Database Operations

### Creating Items

```javascript
// Create with user attribution
const newProduct = await base44.entities.Product.create({
  name: 'Product Name',
  brand: 'Brand',
  category: 'food',
  // ... other fields
}, currentUser.id);  // Pass user ID
```

### Updating Items

```javascript
// Update with history tracking
const updated = await base44.entities.Product.update(
  productId,
  {
    name: 'New Name',
    price: 9.99
  },
  currentUser.id  // Pass user ID for history
);

// Check edit_history
console.log(updated.edit_history);
```

### Like/Dislike

```javascript
// Toggle like
const liked = await base44.entities.Product.toggleLike(
  productId, 
  currentUser.id
);

// Toggle dislike
const disliked = await base44.entities.Product.toggleDislike(
  productId, 
  currentUser.id
);
```

### Image Upload with Compression

```javascript
// Upload and compress
const { file_url } = await base44.integrations.Core.UploadFile({ 
  file: imageFile,
  compress: true  // default: true
});

// Manual compression
const compressed = await base44.compressImage(
  file,
  800,   // maxWidth
  0.7    // quality (0-1)
);
```

## Data Structure Reference

### Product Schema

```javascript
{
  id: 'abc123',
  name: 'Product Name',
  brand: 'Brand Name',
  category: 'food',
  description: 'Description',
  image_url: 'data:image/jpeg;base64,...',
  barcode: '1234567890',
  
  // Attribution
  created_by: 'user-id',
  created_date: '2026-02-05T12:00:00.000Z',
  updated_by: 'user-id',
  updated_date: '2026-02-05T13:00:00.000Z',
  
  // Community
  likes: ['user-1', 'user-2'],
  dislikes: ['user-3'],
  
  // History
  edit_history: [
    {
      timestamp: '2026-02-05T13:00:00.000Z',
      user_id: 'user-id',
      changes: {
        name: { old: 'Old Name', new: 'New Name' }
      }
    }
  ]
}
```

### Store Schema

```javascript
{
  id: 'store123',
  name: 'Store Name',
  address: '123 Main St',
  type: 'supermarket',
  description: 'Description',
  latitude: 40.7128,
  longitude: -74.0060,
  
  // Same attribution, community, and history fields as Product
}
```

## GitHub Configuration

### Environment Variables

```bash
# .env file
VITE_GITHUB_OWNER=your-username
VITE_GITHUB_REPO=PricePilot
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxx
VITE_GITHUB_BRANCH=main
```

### Check GitHub Status

```javascript
import { base44 } from '@/api/base44Client';

console.log('Using GitHub:', base44.USE_GITHUB);
```

## Common Patterns

### Making a Component Editable

```jsx
function MyProductCard({ product }) {
  const [showEdit, setShowEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    base44.auth.me().then(setCurrentUser);
  }, []);
  
  return (
    <>
      <div onClick={() => setShowEdit(true)}>
        {/* Product display */}
        <UserTag 
          userId={product.created_by}
          timestamp={product.created_date}
        />
        <LikeDislike
          likes={product.likes}
          dislikes={product.dislikes}
          currentUserId={currentUser?.id}
          onLike={async () => {
            await base44.entities.Product.toggleLike(
              product.id, 
              currentUser.id
            );
            // refresh data
          }}
          onDislike={async () => {
            await base44.entities.Product.toggleDislike(
              product.id, 
              currentUser.id
            );
            // refresh data
          }}
        />
      </div>
      
      <ProductEditDialog
        product={product}
        open={showEdit}
        onOpenChange={setShowEdit}
        onSave={() => {
          // refresh your data
        }}
        currentUserId={currentUser?.id}
      />
    </>
  );
}
```

### Adding Photo Upload to Forms

```jsx
function MyForm() {
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  
  return (
    <form>
      <CameraCapture
        onCapture={async (file) => {
          setUploading(true);
          try {
            const { file_url } = await base44.integrations.Core.UploadFile({ 
              file, 
              compress: true 
            });
            setImageUrl(file_url);
          } finally {
            setUploading(false);
          }
        }}
        onUpload={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          
          setUploading(true);
          try {
            const { file_url } = await base44.integrations.Core.UploadFile({ 
              file, 
              compress: true 
            });
            setImageUrl(file_url);
          } finally {
            setUploading(false);
          }
        }}
        isUploading={uploading}
      />
      
      {imageUrl && <img src={imageUrl} alt="Preview" />}
    </form>
  );
}
```

## Troubleshooting

### Images Not Compressing

```javascript
// Check compression is enabled
const { file_url } = await base44.integrations.Core.UploadFile({ 
  file,
  compress: true  // Make sure this is true
});

// Or compress manually first
const compressed = await base44.compressImage(file);
const { file_url } = await base44.integrations.Core.UploadFile({ 
  file: compressed,
  compress: false
});
```

### GitHub Not Working

```javascript
// Check configuration
console.log('GitHub enabled:', base44.USE_GITHUB);

// Check environment variables
console.log('Owner:', import.meta.env.VITE_GITHUB_OWNER);
console.log('Repo:', import.meta.env.VITE_GITHUB_REPO);
console.log('Token:', import.meta.env.VITE_GITHUB_TOKEN ? 'Set' : 'Not set');
```

### Edit History Not Showing

```javascript
// Make sure you pass userId when updating
await base44.entities.Product.update(
  id,
  data,
  currentUser.id  // Don't forget this!
);

// Check if history exists
console.log(product.edit_history);
```

## Best Practices

1. **Always pass user ID** when creating or updating items
2. **Compress images** before uploading to reduce size
3. **Check user authentication** before allowing edits
4. **Refresh data** after likes/dislikes/edits
5. **Handle errors** gracefully with try/catch
6. **Show loading states** during async operations
7. **Validate inputs** before submitting
8. **Test with localStorage** before enabling GitHub

## Performance Tips

1. Cache user data to avoid repeated auth calls
2. Use React Query for data fetching and caching
3. Debounce search and filter operations
4. Lazy load images and components
5. Implement pagination for large datasets
6. Monitor GitHub API rate limits
7. Use localStorage as fallback for quick testing

---

For more details, see [SETUP.md](./SETUP.md) and [CHANGELOG.md](./CHANGELOG.md)
