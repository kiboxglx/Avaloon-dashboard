import React from 'react';
import { AutomationRule } from '../../types';

interface AutomationsTableProps {
  rules: AutomationRule[];
  onEdit: (rule: AutomationRule) => void;
  onDelete: (id: string) => void;
}

const AutomationsTable: React.FC<AutomationsTableProps> = ({ rules, onEdit, onDelete }) => {
  return (
    <div className="bg-[#1A1F24] rounded-lg border border-[#2C333A] overflow-hidden">
      <table className="min-w-full divide-y divide-[#2C333A]">
        <thead className="bg-[#111418]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#C9D1D9] uppercase tracking-wider">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#C9D1D9] uppercase tracking-wider">Evento</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#C9D1D9] uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#C9D1D9] uppercase tracking-wider">Execuções</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#C9D1D9] uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2C333A]">
          {rules.map(rule => (
            <tr key={rule.id} className="hover:bg-[#2C333A] transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{rule.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-[#C9D1D9] text-sm">{rule.event}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  rule.enabled ? 'bg-[#19C37D]/20 text-[#19C37D]' : 'bg-gray-700 text-gray-400'
                }`}>
                  {rule.enabled ? 'Ativa' : 'Inativa'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[#C9D1D9] text-sm">{rule.runsCount || 0}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button onClick={() => onEdit(rule)} className="text-[#19C37D] hover:text-[#0F8A57] mr-3">Editar</button>
                <button onClick={() => onDelete(rule.id)} className="text-red-500 hover:text-red-400">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AutomationsTable;
