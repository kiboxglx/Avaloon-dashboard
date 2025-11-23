import { db } from './firebase';
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ContentItem } from '../types';

export const saveContentItem = async (orgId: string, item: Partial<ContentItem>, uid: string) => {
  const data = {
    ...item,
    orgId,
    updatedAt: Date.now(),
  };

  if (!item.id) {
    await addDoc(collection(db, 'content_calendar'), {
      ...data,
      createdByUid: uid,
      createdAt: Date.now(),
      status: 'draft'
    });
  } else {
    await updateDoc(doc(db, 'content_calendar', item.id), data);
  }
};

export const deleteContentItem = async (id: string) => {
  await deleteDoc(doc(db, 'content_calendar', id));
};

export const getMockContent = (orgId: string): ContentItem[] => {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  
  return [
    {
      id: 'c1',
      orgId,
      clientId: 'mock_client_1',
      title: 'Post Dia das Mães',
      type: 'post',
      channel: 'instagram',
      status: 'scheduled',
      scheduledDate: today,
      caption: 'Comemore com quem você ama! #diadasmaes',
      createdByUid: 'user1',
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      id: 'c2',
      orgId,
      clientId: 'mock_client_1',
      title: 'Reel Bastidores',
      type: 'reel',
      channel: 'instagram',
      status: 'in_review',
      scheduledDate: tomorrow,
      createdByUid: 'user1',
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      id: 'c3',
      orgId,
      clientId: 'mock_client_2',
      title: 'Anúncio Promoção Relâmpago',
      type: 'ad',
      channel: 'facebook',
      status: 'draft',
      scheduledDate: today,
      createdByUid: 'user2',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ];
};
