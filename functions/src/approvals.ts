import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { runAutomationsForEvent } from './automations';

const db = admin.firestore();

export const submitForApprovalCallable = functions.https.onCall(async (data, context) => {
    const { contentItemId, orgId } = data;
    const uid = context.auth?.uid;

    if (!uid) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');

    // Update content
    await db.collection('content_calendar').doc(contentItemId).update({
        status: 'in_review',
        updatedAt: Date.now()
    });

    const contentDoc = await db.collection('content_calendar').doc(contentItemId).get();
    const content = contentDoc.data();

    // Create Approval
    await db.collection('approvals').add({
        orgId,
        clientId: content?.clientId,
        contentItemId,
        submittedByUid: uid,
        status: 'pending',
        createdAt: Date.now()
    });

    return { success: true };
});

export const clientDecisionCallable = functions.https.onCall(async (data, context) => {
    const { approvalId, decision, comment } = data;
    const uid = context.auth?.uid;

    if (!uid) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');

    const approvalRef = db.collection('approvals').doc(approvalId);
    const approvalDoc = await approvalRef.get();
    
    if (!approvalDoc.exists) throw new functions.https.HttpsError('not-found', 'Approval not found');
    
    const approval = approvalDoc.data();
    
    await approvalRef.update({
        status: decision,
        clientUid: uid,
        clientComment: comment || null,
        decidedAt: Date.now()
    });

    // Update Content Item
    await db.collection('content_calendar').doc(approval?.contentItemId).update({
        status: decision === 'approved' ? 'approved' : 'rejected',
        updatedAt: Date.now()
    });

    if (decision === 'rejected') {
        await runAutomationsForEvent(approval?.orgId, 'content_rejected', { 
            contentItemId: approval?.contentItemId,
            clientId: approval?.clientId
        });
    }

    return { success: true };
});
