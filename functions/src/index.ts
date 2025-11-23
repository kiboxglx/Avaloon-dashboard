import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize App once
admin.initializeApp();

// Export previous functions
export * from './revenue';
export * from './cohorts';
export * from './scenarios';
export * from './calendar';
export * from './approvals';
export * from './seed';
