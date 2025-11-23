import { collection, query, where, Query } from 'firebase/firestore';
import { db } from './firebase';

// Mock hook for MVP - in production this comes from Auth Context
export const useCurrentOrg = () => {
  return {
    orgId: "demo_org_avaloon", // Corrigido para bater com functions/src/seed.ts
    role: "admin"
  };
};

export const withOrgQuery = (collectionName: string): Query => {
  const { orgId } = useCurrentOrg();
  return query(collection(db, collectionName), where('orgId', '==', orgId));
};