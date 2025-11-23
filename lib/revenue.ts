import { db } from './firebase';
import { addDoc, collection } from 'firebase/firestore';
import { Transaction } from '../types';

export const addTransaction = async (orgId: string, data: Partial<Transaction>, uid: string) => {
  try {
    const cleanData: Omit<Transaction, 'id'> = {
      orgId,
      clientId: data.clientId || undefined, // undefined to ignore in query if empty
      type: data.type || 'income',
      category: data.category || 'other',
      amount: Number(data.amount) || 0,
      date: data.date || new Date().toISOString().split('T')[0],
      notes: data.notes || '',
      createdByUid: uid,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    // Remove undefined keys
    if (!cleanData.clientId) delete cleanData.clientId;

    await addDoc(collection(db, 'transactions'), cleanData);
    return true;
  } catch (error) {
    console.error("Error adding transaction", error);
    throw error;
  }
};
