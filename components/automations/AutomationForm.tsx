import React, { useState } from 'react';
import { AutomationRule } from '../../types';
import RuleBuilder from './RuleBuilder';

interface AutomationFormProps {
  initialData?: Partial<AutomationRule>;
  onSave: (data: Partial<AutomationRule>) => void;
  onCancel: () => void;
}

const AutomationForm: React.FC<AutomationFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<AutomationRule>>(initialData || {
    enabled: true,
    actions: []
  });

  return (
    <div className="bg-[#1A1F24] p-6 rounded-lg border border-[#2C333A] mb-6">
      <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">
        {initialData ? 'Editar Automação' : 'Nova Automação'}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-[#C9D1D9] text-sm font-bold mb-2">Nome da Regra</label>
          <input 
            type="text" 
            value={formData.name || ''}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full bg-[#111418] border border-[#2C333A] text-white rounded p-2 focus:border-[#19C37D] outline-none"
            placeholder="Ex: Alerta de Risco Alto"
          />
        </div>

        <div>
           <label className="block text-[#C9D1D9] text-sm font-bold mb-2">Evento Gatilho</label>
           <select 
             value={formData.event}
             onChange={e => setFormData({...formData, event: e.target.value as any})}
             className="w-full bg-[#111418] border border-[#2C333A] text-white rounded p-2"
           >
             <option value="">Selecione...</option>
             <option value="alert_opened">Alerta Aberto</option>
             <option value="task_overdue">Tarefa Atrasada</option>
             <option value="report_monthly_ready">Relatório Mensal Pronto</option>
             <option value="content_rejected">Conteúdo Rejeitado</option>
           </select>
        </div>

        <RuleBuilder 
          conditions={formData.conditions} 
          onChange={(cond) => setFormData({...formData, conditions: cond})}
        />

        <div>
           <label className="block text-[#C9D1D9] text-sm font-bold mb-2">Ações (Simulação)</label>
           <div className="bg-[#111418] p-3 rounded border border-[#2C333A] text-sm text-[#C9D1D9]">
              {formData.actions?.length === 0 ? 'Nenhuma ação definida' : `${formData.actions?.length} ações configuradas`}
           </div>
           <button 
             type="button"
             onClick={() => setFormData({
               ...formData, 
               actions: [...(formData.actions || []), { type: 'create_task', params: {} }]
             })}
             className="mt-2 text-[#19C37D] text-sm hover:underline"
           >
             + Adicionar Ação (Demo)
           </button>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onCancel} className="px-4 py-2 text-[#C9D1D9] hover:text-white">Cancelar</button>
        <button 
          onClick={() => onSave(formData)}
          className="px-4 py-2 bg-[#19C37D] hover:bg-[#0F8A57] text-white rounded font-medium"
        >
          Salvar Regra
        </button>
      </div>
    </div>
  );
};

export default AutomationForm;
