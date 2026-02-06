import { db, serverTimestamp } from './firebaseClient';
import {
  collection,
  query,
  where,
  orderBy,
  limit as limitFn,
  getDocs,
  getDoc,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

function validateData(data, entityName) {
  if (!Array.isArray(data)) return [];
  return data;
}

const PRIVATE_ENTITIES = ['ShoppingList'];
const SHARED_ENTITIES = ['Product', 'PriceEntry', 'Store', 'User'];

const createEntityClient = (entityName) => ({
  list: async (sort = null, limit = null, userId = null) => {
    try {
      const col = collection(db, entityName);
      let q = col;
      const constraints = [];
      if (PRIVATE_ENTITIES.includes(entityName) && userId) {
        constraints.push(where('user_id', '==', String(userId)));
      }
      if (sort) {
        const isDesc = sort.startsWith('-');
        const field = isDesc ? sort.substring(1) : sort;
        try { constraints.push(orderBy(field, isDesc ? 'desc' : 'asc')); } catch(e) { /* ignore */ }
      }
      if (limit) {
        constraints.push(limitFn(limit));
      }
      if (constraints.length > 0) q = query(col, ...constraints);

      const snap = await getDocs(q);
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return validateData(items, entityName);
    } catch (e) {
      console.error('Firestore list error', entityName, e);
      return [];
    }
  },

  filter: async (filters) => {
    try {
      const col = collection(db, entityName);
      const constraints = Object.entries(filters).map(([k,v]) => where(k, '==', v));
      const q = query(col, ...constraints);
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.error('Firestore filter error', e);
      return [];
    }
  },

  get: async (id) => {
    try {
      const d = await getDoc(doc(db, entityName, id));
      return d.exists() ? { id: d.id, ...d.data() } : null;
    } catch (e) {
      console.error('Firestore get error', e);
      return null;
    }
  },

  create: async (data, userId = null) => {
    try {
      const payload = {
        ...data,
        created_date: new Date().toISOString(),
        created_by: userId || data.created_by || null,
        created_by_name: data.created_by_name || null,
        updated_date: new Date().toISOString(),
        updated_by: userId || data.updated_by || null,
        updated_by_name: data.updated_by_name || null,
        likes: data.likes || [],
        dislikes: data.dislikes || [],
        edit_history: data.edit_history || []
      };
      const ref = await addDoc(collection(db, entityName), payload);
      return { id: ref.id, ...payload };
    } catch (e) {
      console.error('Firestore create error', e);
      throw e;
    }
  },

  update: async (id, data, userId = null) => {
    try {
      const ref = doc(db, entityName, id);
      const now = new Date().toISOString();
      const updates = {
        ...data,
        updated_date: now,
        updated_by: userId || data.updated_by || null,
        updated_by_name: data.updated_by_name || null,
      };
      await updateDoc(ref, updates);
      const updated = await getDoc(ref);
      return { id: updated.id, ...updated.data() };
    } catch (e) {
      console.error('Firestore update error', e);
      throw e;
    }
  },

  delete: async (id) => {
    try {
      await deleteDoc(doc(db, entityName, id));
      return true;
    } catch (e) {
      console.error('Firestore delete error', e);
      return false;
    }
  },

  toggleLike: async (id, userId) => {
    try {
      const ref = doc(db, entityName, id);
      const d = await getDoc(ref);
      if (!d.exists()) return null;
      const item = d.data();
      const likes = item.likes || [];
      const dislikes = item.dislikes || [];
      if (likes.includes(userId)) {
        await updateDoc(ref, { likes: arrayRemove(userId) });
      } else {
        await updateDoc(ref, { likes: arrayUnion(userId), dislikes: arrayRemove(userId) });
      }
      const updated = await getDoc(ref);
      return { id: updated.id, ...updated.data() };
    } catch (e) {
      console.error('Firestore toggleLike error', e);
      return null;
    }
  },

  toggleDislike: async (id, userId) => {
    try {
      const ref = doc(db, entityName, id);
      const d = await getDoc(ref);
      if (!d.exists()) return null;
      const item = d.data();
      const dislikes = item.dislikes || [];
      const likes = item.likes || [];
      if (dislikes.includes(userId)) {
        await updateDoc(ref, { dislikes: arrayRemove(userId) });
      } else {
        await updateDoc(ref, { dislikes: arrayUnion(userId), likes: arrayRemove(userId) });
      }
      const updated = await getDoc(ref);
      return { id: updated.id, ...updated.data() };
    } catch (e) {
      console.error('Firestore toggleDislike error', e);
      return null;
    }
  }
});

export const firestoreDbClient = {
  entities: {
    Product: createEntityClient('Product'),
    PriceEntry: createEntityClient('PriceEntry'),
    Store: createEntityClient('Store'),
    ShoppingList: createEntityClient('ShoppingList'),
    User: createEntityClient('User'),
  }
};
