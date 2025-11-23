import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { AutomationEvent, AutomationRule } from '../../types';

const db = admin.firestore();

export const runAutomationsForEvent = async (orgId: string, event: AutomationEvent, context: any) => {
  try {
    const rulesSnap = await db.collection('automation_rules')
      .where('orgId', '==', orgId)
      .where('event', '==', event)
      .where('enabled', '==', true)
      .get();

    const rules = rulesSnap.docs.map(d => ({ id: d.id, ...d.data() } as AutomationRule));
    
    for (const rule of rules) {
      let matches = true;
      
      // Simple condition matching
      if (rule.conditions) {
        if (rule.conditions.severity && context.severity && !rule.conditions.severity.includes(context.severity)) matches = false;
        // ... add other condition checks logic here
      }

      if (matches) {
        console.log(`Executing Rule ${rule.id} for event ${event}`);
        
        // Execute actions
        for (const action of rule.actions) {
          if (action.type === 'create_task') {
             await db.collection('tasks').add({
               orgId,
               clientId: context.clientId || null,
               title: action.params.title || 'Tarefa Automática',
               priority: action.params.priority || 'medium',
               status: 'todo',
               createdAt: Date.now(),
               createdByUid: 'system_automation'
             });
          }
          // ... handle other actions
        }

        // Log run
        await db.collection('automation_runs').add({
          orgId,
          ruleId: rule.id,
          event,
          contextSummary: JSON.stringify(context),
          executedActions: rule.actions,
          success: true,
          createdAt: Date.now()
        });
        
        // Update stats
        await db.collection('automation_rules').doc(rule.id).update({
            lastRunAt: Date.now(),
            runsCount: admin.firestore.FieldValue.increment(1)
        });
      }
    }
  } catch (error) {
    console.error("Error running automations", error);
  }
};
