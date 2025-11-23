import { db } from './firebase';
import { collection, addDoc, updateDoc, doc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { AutomationRule } from '../types';

export const saveAutomation = async (orgId: string, rule: Partial<AutomationRule>, uid: string) => {
  const data = {
    ...rule,
    orgId,
    updatedAt: Date.now(),
  };

  if (!rule.id) {
    // Create
    await addDoc(collection(db, 'automation_rules'), {
      ...data,
      createdByUid: uid,
      createdAt: Date.now(),
      runsCount: 0
    });
  } else {
    // Update
    await updateDoc(doc(db, 'automation_rules', rule.id), data);
  }
};

export const deleteAutomation = async (id: string) => {
  await deleteDoc(doc(db, 'automation_rules', id));
};

export const getMockAutomations = (orgId: string): AutomationRule[] => {
  return [
    {
      id: 'rule_1',
      orgId,
      name: 'Escalar Risco Alto para Gerente',
      enabled: true,
      event: 'alert_opened',
      conditions: { severity: ['high'], clientStatus: ['risk'] },
      actions: [{ type: 'create_task', params: { title: 'Verificar Cliente em Risco', priority: 'high' } }],
      createdByUid: 'system',
      createdAt: Date.now() - 10000000,
      updatedAt: Date.now(),
      runsCount: 12,
      lastRunAt: Date.now() - 3600000
    },
    {
      id: 'rule_2',
      orgId,
      name: 'Notificar Cliente sobre Relatório Mensal',
      enabled: true,
      event: 'report_monthly_ready',
      actions: [{ type: 'notify_client', params: { template: 'monthly_report_v1' } }],
      createdByUid: 'system',
      createdAt: Date.now() - 5000000,
      updatedAt: Date.now(),
      runsCount: 5
    }
  ];
};
