# PricePilot Data Directory

This directory contains the JSON database files for PricePilot when using GitHub as a backend.

## Files

- `Product.json` - Product catalog with community-contributed items
- `PriceEntry.json` - Price entries for products at different stores
- `Store.json` - Store information and locations
- `ShoppingList.json` - User shopping lists
- `User.json` - User profiles and preferences

## Data Structure

Each entity includes:
- `id` - Unique identifier
- `created_date` - Creation timestamp
- `created_by` - User ID who created the entry
- `updated_date` - Last update timestamp
- `updated_by` - User ID who last updated the entry
- `likes` - Array of user IDs who liked this entry
- `dislikes` - Array of user IDs who disliked this entry
- `edit_history` - Array of edit history entries with timestamps and changes

## GitHub Integration

When configured with GitHub credentials in `.env`, the app will:
1. Read data from these JSON files via GitHub API
2. Update files through commits when data changes
3. Maintain version history through Git commits
4. Allow multiple users to contribute to the same database

## Fallback Mode

If GitHub is not configured, the app automatically falls back to localStorage for data persistence.
