import React from 'react';
import { ContentItem } from '../../types';

interface ApprovalCardProps {
  item: ContentItem;
  onAction: (id: string, action: 'approve' | 'reject') => void;
  isPortal?: boolean;
}

const ApprovalCard: React.FC<ApprovalCardProps> = ({ item, onAction, isPortal }) => {
  return (
    <div className="bg-[#1A1F24] p-4 rounded border border-[#2C333A] mb-3 flex justify-between items-center">
      <div>
        <div className="flex items-center gap-2 mb-1">
           <span className="text-xs font-bold text-[#19C37D] uppercase border border-[#19C37D] px-1 rounded">{item.channel}</span>
           <span className="text-xs text-[#C9D1D9] uppercase">{item.type}</span>
        </div>
        <h4 className="text-white font-bold text-lg">{item.title}</h4>
        <p className="text-[#C9D1D9] text-sm mt-1">{item.caption || 'Sem legenda...'}</p>
        <div className="text-xs text-gray-500 mt-2">Agendado para: {item.scheduledDate}</div>
      </div>

      <div className="flex flex-col gap-2">
         {isPortal ? (
           <>
             <button 
               onClick={() => onAction(item.id, 'approve')}
               className="px-4 py-1 bg-[#19C37D] hover:bg-[#0F8A57] text-white text-sm rounded"
             >
               Aprovar
             </button>
             <button 
               onClick={() => onAction(item.id, 'reject')}
               className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
             >
               Rejeitar
             </button>
           </>
         ) : (
           <span className="text-yellow-500 font-bold text-sm bg-yellow-500/10 px-3 py-1 rounded">Aguardando Cliente</span>
         )}
      </div>
    </div>
  );
};

export default ApprovalCard;
