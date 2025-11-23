import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { runAutomationsForEvent } from './automations';

const db = admin.firestore();

export const contentScheduledTodayJob = functions.pubsub.schedule('every day 06:30')
  .timeZone('America/Sao_Paulo')
  .onRun(async (context) => {
    const today = new Date().toISOString().slice(0, 10);
    const orgs = await db.collection('organizations').get();

    for (const orgDoc of orgs.docs) {
      const orgId = orgDoc.id;
      const contentSnap = await db.collection('content_calendar')
        .where('orgId', '==', orgId)
        .where('scheduledDate', '==', today)
        .where('status', '==', 'scheduled')
        .get();

      if (!contentSnap.empty) {
        // Trigger automation
        await runAutomationsForEvent(orgId, 'content_scheduled_today', { count: contentSnap.size });
      }
    }
});
