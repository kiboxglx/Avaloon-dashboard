import React, { useState, useEffect } from 'react';
import ApprovalQueue from '../components/approvals/ApprovalQueue';
import { getMockContent } from '../lib/calendar';
import { ContentItem } from '../types';
import { useCurrentOrg } from '../lib/tenancy';

const ApprovalsPage: React.FC = () => {
  const { orgId } = useCurrentOrg();
  const [pendingItems, setPendingItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    const all = getMockContent(orgId);
    setPendingItems(all.filter(i => i.status === 'in_review'));
  }, [orgId]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Fila de Aprovação</h1>
      
      <div className="bg-[#111418] border border-[#2C333A] rounded-lg p-6">
        <h2 className="text-[#19C37D] font-bold uppercase tracking-wider text-sm mb-4 border-b border-[#2C333A] pb-2">
           Pendente de Resposta
        </h2>
        <ApprovalQueue items={pendingItems} isPortal={false} />
      </div>
    </div>
  );
};

export default ApprovalsPage;
