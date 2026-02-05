
import { githubDbClient } from './githubDbClient';

/**
 * Base44 Client implementation using GitHub as a backend.
 * This client provides a similar interface to the original base44 client
 * but persists data to GitHub JSON files.
 */
export const base44 = {
  ...githubDbClient,
  
  auth: {
    me: async () => {
      const userStr = localStorage.getItem('pricepilot_user');
      if (!userStr) return { id: 'anonymous', full_name: 'Anonymous', name: 'Anonymous' };
      return JSON.parse(userStr);
    },
    
    updateMe: async (data) => {
      const userStr = localStorage.getItem('pricepilot_user');
      let user = userStr ? JSON.parse(userStr) : { id: 'anonymous' };
      
      // Update local storage for immediate persistence
      const updatedUser = { ...user, ...data };
      localStorage.setItem('pricepilot_user', JSON.stringify(updatedUser));
      
      // Also update in GitHub if possible
      try {
        await githubDbClient.entities.User.update(updatedUser.id, updatedUser);
      } catch (e) {
        console.log('GitHub user update skipped/failed');
      }
      
      return updatedUser;
    },

    logout: (redirectUrl) => {
      localStorage.removeItem('pricepilot_user');
      if (redirectUrl) window.location.hash = '#/Login';
    },

    redirectToLogin: () => {
      window.location.hash = '#/Login';
    }
  },

  appLogs: {
    logUserInApp: async (pageName) => {
      console.log(`Page view: ${pageName}`);
    }
  },

  integrations: {
    Core: {
      UploadFile: async ({ file, compress = true }) => {
        // In a real app, this would upload to S3 or similar.
        // For GitHub Pages, we convert to base64 and store it.
        
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            // For this demo, we just return the base64 URL
            resolve({ file_url: reader.result });
          };
          reader.onerror = error => reject(error);
        });
      }
    }
  }
};
