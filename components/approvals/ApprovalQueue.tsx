import React from 'react';
import { ContentItem } from '../../types';
import ApprovalCard from './ApprovalCard';

interface ApprovalQueueProps {
  items: ContentItem[];
  isPortal?: boolean;
}

const ApprovalQueue: React.FC<ApprovalQueueProps> = ({ items, isPortal }) => {
  const handleAction = (id: string, action: 'approve' | 'reject') => {
    alert(`Ação ${action} no item ${id} (Demo)`);
  };

  return (
    <div className="space-y-4">
       {items.length === 0 ? (
         <div className="text-[#C9D1D9] text-center py-10">Nenhum item pendente de aprovação.</div>
       ) : (
         items.map(item => (
           <ApprovalCard key={item.id} item={item} onAction={handleAction} isPortal={isPortal} />
         ))
       )}
    </div>
  );
};

export default ApprovalQueue;
