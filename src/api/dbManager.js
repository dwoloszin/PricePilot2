
import { base44 } from './base44Client';

/**
 * Database Management API
 * 
 * This utility provides direct access to the GitHub-backed database
 * for administrative tasks like extracting data, bulk editing, or 
 * deleting records.
 * 
 * Usage in Console:
 * import { dbManager } from './src/api/dbManager';
 * await dbManager.extract('Product');
 */
export const dbManager = {
  /**
   * Extract all records for an entity
   * @param {string} entityName - Product, PriceEntry, Store, ShoppingList, User
   */
  extract: async (entityName) => {
    if (!base44.entities[entityName]) {
      throw new Error(`Entity ${entityName} not found`);
    }
    const data = await base44.entities[entityName].list();
    console.table(data);
    return data;
  },

  /**
   * Get a specific record by ID
   */
  get: async (entityName, id) => {
    return await base44.entities[entityName].get(id);
  },

  /**
   * Update a record
   */
  edit: async (entityName, id, data) => {
    const result = await base44.entities[entityName].update(id, data);
    console.log(`Updated ${entityName} ${id}`);
    return result;
  },

  /**
   * Delete a record
   */
  exclude: async (entityName, id) => {
    const result = await base44.entities[entityName].delete(id);
    console.log(`Deleted ${entityName} ${id}`);
    return result;
  },

  /**
   * Create a new record
   */
  insert: async (entityName, data) => {
    const result = await base44.entities[entityName].create(data);
    console.log(`Created ${entityName} with ID ${result.id}`);
    return result;
  },

  /**
   * Export the entire database as a JSON object
   */
  exportAll: async () => {
    const entities = Object.keys(base44.entities);
    const fullDb = {};
    for (const entity of entities) {
      fullDb[entity] = await base44.entities[entity].list();
    }
    return fullDb;
  }
};

// Attach to window for easy access in browser console during development
if (typeof window !== 'undefined') {
  window.dbManager = dbManager;
  
  /**
   * DIAGNOSTIC TOOL: Check data sharing setup
   * Usage in console: window.priceDebug.checkSetup()
   */
  window.priceDebug = {
    checkSetup: async () => {
      console.log('📊 PricePilot Setup Check');
      console.log('======================');
      
      // Check GitHub config
      const hasGitHub = import.meta.env.VITE_GITHUB_OWNER;
      console.log(`✓ GitHub Owner: ${import.meta.env.VITE_GITHUB_OWNER || 'NOT SET'}`);
      console.log(`✓ GitHub Repo: ${import.meta.env.VITE_GITHUB_REPO || 'NOT SET'}`);
      console.log(`✓ GitHub Token: ${import.meta.env.VITE_GITHUB_TOKEN ? '✓ SET' : '✗ NOT SET'}`);
      console.log('');
      
      // Check localStorage data
      console.log('📦 LocalStorage Database Cache:');
      const entities = ['Product', 'PriceEntry', 'Store', 'ShoppingList', 'User'];
      entities.forEach(entity => {
        const data = localStorage.getItem(`pricepilot_db_data/${entity}.json`);
        const count = data ? JSON.parse(data).length : 0;
        console.log(`  ${entity}: ${count} items`);
      });
      console.log('');
      
      // Check current user
      const userStr = localStorage.getItem('pricepilot_user');
      const user = userStr ? JSON.parse(userStr) : null;
      console.log('👤 Current User:');
      console.log(`  ID: ${user?.id || 'NOT LOGGED IN'}`);
      console.log(`  Name: ${user?.full_name || 'N/A'}`);
      console.log('');
      
      // Check if GitHub is available
      console.log('🔗 Data Source:');
      if (hasGitHub) {
        console.log('  → Using GitHub (Server)');
      } else {
        console.log('  → Using LocalStorage only (No GitHub configured)');
        console.log('  ⚠️  Data is NOT shared between users!');
      }
    },
    
    clearCache: () => {
      console.log('🗑️  Clearing database cache...');
      const entities = ['Product', 'PriceEntry', 'Store', 'ShoppingList', 'User'];
      entities.forEach(entity => {
        localStorage.removeItem(`pricepilot_db_data/${entity}.json`);
      });
      console.log('✓ Cache cleared. Please refresh the page.');
    },
    
    showData: async (entity = 'Product') => {
      console.log(`📋 All ${entity} Data:`);
      const data = await dbManager.extract(entity);
      return data;
    }
  };
}

