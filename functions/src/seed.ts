import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const seedDemoDataCallable = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in to seed data.');
  }

  // 1. Create Demo Organization
  const orgId = 'demo_org_avaloon';
  const orgRef = db.collection('organizations').doc(orgId);
  const orgDoc = await orgRef.get();

  if (!orgDoc.exists) {
    await orgRef.set({
      id: orgId,
      name: 'Avaloon Demo Agency',
      slug: 'avaloon-demo',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      subscription: {
        tier: 'pro',
        status: 'active'
      }
    });
  }

  // 2. Add current user to Demo Org
  const memberRef = db.collection('org_members').doc(`${orgId}_${uid}`);
  if (!(await memberRef.get()).exists) {
    await memberRef.set({
      id: `${orgId}_${uid}`,
      orgId,
      uid,
      role: 'owner',
      email: context.auth?.token.email || 'demo@avaloon.com',
      createdAt: Date.now()
    });
  }

  // 3. Create Demo Clients
  const clients = [
    {
      id: 'demo_client_1',
      name: 'Academia Fit Life',
      fantasyName: 'Fit Life',
      segment: 'Saúde e Fitness',
      status: 'active',
      priority: 'high',
      instagram: { connected: true, igBusinessId: 'demo_ig_1' }
    },
    {
      id: 'demo_client_2',
      name: 'Boutique Elegance',
      fantasyName: 'Elegance',
      segment: 'Moda Feminina',
      status: 'risk',
      priority: 'medium',
      instagram: { connected: true, igBusinessId: 'demo_ig_2' }
    },
    {
      id: 'demo_client_3',
      name: 'Burger Kingo',
      fantasyName: 'Burger Kingo',
      segment: 'Alimentação',
      status: 'active',
      priority: 'medium',
      instagram: { connected: true, igBusinessId: 'demo_ig_3' }
    },
    {
      id: 'demo_client_4',
      name: 'Dr. Sorriso Odonto',
      fantasyName: 'Dr. Sorriso',
      segment: 'Saúde',
      status: 'lead',
      priority: 'low',
      instagram: { connected: false }
    }
  ];

  const batch = db.batch();

  for (const client of clients) {
    const ref = db.collection('clients').doc(client.id);
    if (!(await ref.get()).exists) {
      batch.set(ref, {
        ...client,
        orgId,
        owner: 'Demo Admin',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
  }

  // 4. Create Metrics (Last 14 days)
  const now = Date.now();
  const oneDay = 86400000;

  for (const client of clients) {
    if (!client.instagram.connected) continue;

    for (let i = 0; i < 14; i++) {
      const date = new Date(now - (i * oneDay));
      const dateStr = date.toISOString().split('T')[0];
      const metricId = `${client.id}_${dateStr}`;
      const metricRef = db.collection('ig_metrics_daily').doc(metricId);

      // Simple randomization
      const baseFollowers = client.status === 'risk' ? 5000 - (i * 10) : 12000 + (i * 20);
      const baseReach = client.status === 'risk' ? 200 : 1500;

      if (!(await metricRef.get()).exists) {
        batch.set(metricRef, {
          id: metricId,
          orgId,
          clientId: client.id,
          date: dateStr,
          followers: baseFollowers + Math.floor(Math.random() * 50),
          reach: baseReach + Math.floor(Math.random() * 500),
          impressions: baseReach * 1.5,
          engagement: Math.floor(baseReach * 0.05),
          postsCount: Math.random() > 0.7 ? 1 : 0,
          reelsCount: Math.random() > 0.9 ? 1 : 0,
          createdAt: date.getTime()
        });
      }
    }
  }

  // 5. Create Alerts
  const alerts = [
    {
      id: 'demo_alert_1',
      clientId: 'demo_client_2',
      type: 'reach_drop',
      severity: 'high',
      reason: 'Queda de alcance de 35% na última semana',
      open: true,
      detectedAt: now - oneDay
    },
    {
      id: 'demo_alert_2',
      clientId: 'demo_client_3',
      type: 'low_frequency',
      severity: 'medium',
      reason: 'Nenhuma postagem nos últimos 5 dias',
      open: true,
      detectedAt: now - (oneDay * 2)
    }
  ];

  for (const alert of alerts) {
    const ref = db.collection('alerts').doc(alert.id);
    if (!(await ref.get()).exists) {
      batch.set(ref, { ...alert, orgId });
    }
  }

  // 6. Create Tasks
  const tasks = [
    {
      id: 'demo_task_1',
      clientId: 'demo_client_1',
      title: 'Aprovar planejamento mensal',
      status: 'todo',
      priority: 'high',
      dueDate: new Date(now + oneDay).toISOString().split('T')[0]
    },
    {
      id: 'demo_task_2',
      clientId: 'demo_client_2',
      title: 'Investigar queda de engajamento',
      status: 'doing',
      priority: 'high',
      dueDate: new Date(now).toISOString().split('T')[0]
    },
    {
      id: 'demo_task_3',
      clientId: 'demo_client_3',
      title: 'Agendar sessão de fotos',
      status: 'done',
      priority: 'medium',
      dueDate: new Date(now - oneDay).toISOString().split('T')[0]
    }
  ];

  for (const task of tasks) {
    const ref = db.collection('tasks').doc(task.id);
    if (!(await ref.get()).exists) {
      batch.set(ref, {
        ...task,
        orgId,
        createdByUid: uid,
        createdAt: now,
        updatedAt: now
      });
    }
  }

  // 7. Content Calendar
  const contents = [
    {
      id: 'demo_content_1',
      clientId: 'demo_client_1',
      title: 'Reels: Treino de Perna',
      type: 'reel',
      channel: 'instagram',
      status: 'scheduled',
      scheduledDate: new Date(now + oneDay).toISOString().split('T')[0]
    },
    {
      id: 'demo_content_2',
      clientId: 'demo_client_1',
      title: 'Carrossel: Dicas de Nutrição',
      type: 'post',
      channel: 'instagram',
      status: 'in_review',
      scheduledDate: new Date(now + (oneDay * 2)).toISOString().split('T')[0]
    },
    {
      id: 'demo_content_3',
      clientId: 'demo_client_2',
      title: 'Promoção de Inverno',
      type: 'story',
      channel: 'instagram',
      status: 'draft',
      scheduledDate: new Date(now + (oneDay * 3)).toISOString().split('T')[0]
    }
  ];

  for (const content of contents) {
    const ref = db.collection('content_calendar').doc(content.id);
    if (!(await ref.get()).exists) {
      batch.set(ref, {
        ...content,
        orgId,
        createdByUid: uid,
        createdAt: now,
        updatedAt: now
      });
    }
  }

  // 8. Approvals
  const approvals = [
    {
      id: 'demo_approval_1',
      clientId: 'demo_client_1',
      contentItemId: 'demo_content_2',
      submittedByUid: uid,
      status: 'pending'
    }
  ];

  for (const app of approvals) {
    const ref = db.collection('approvals').doc(app.id);
    if (!(await ref.get()).exists) {
      batch.set(ref, {
        ...app,
        orgId,
        createdAt: now
      });
    }
  }

  await batch.commit();

  return { success: true, message: 'Demo data seeded successfully.' };
});

export const clearDemoDataCallable = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) throw new functions.https.HttpsError('unauthenticated', 'Login required');
  
  const orgId = 'demo_org_avaloon';
  const collections = ['clients', 'ig_metrics_daily', 'alerts', 'tasks', 'content_calendar', 'approvals'];
  
  let deletedCount = 0;
  const batch = db.batch();

  for (const col of collections) {
    const snapshot = await db.collection(col).where('orgId', '==', orgId).get();
    snapshot.docs.forEach(doc => {
      if (doc.id.startsWith('demo_')) {
        batch.delete(doc.ref);
        deletedCount++;
      }
    });
  }

  await batch.commit();
  return { success: true, deleted: deletedCount };
});
