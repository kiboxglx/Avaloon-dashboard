import React from 'react';
import { AutomationRule } from '../../types';

interface RuleBuilderProps {
  conditions: AutomationRule['conditions'];
  onChange: (conditions: AutomationRule['conditions']) => void;
}

const RuleBuilder: React.FC<RuleBuilderProps> = ({ conditions, onChange }) => {
  const toggleCondition = (key: keyof NonNullable<AutomationRule['conditions']>, value: any) => {
    const current = conditions || {};
    // Mock toggle logic for demo
    onChange({ ...current, [key]: [value] });
  };

  return (
    <div className="bg-[#111418] p-4 rounded border border-[#2C333A] text-sm">
      <h4 className="text-[#FFFFFF] mb-3 font-medium">Condições de Disparo</h4>
      <div className="grid grid-cols-1 gap-4">
        <div>
           <label className="block text-[#C9D1D9] mb-1">Severidade do Alerta</label>
           <div className="flex gap-2">
             {['low', 'medium', 'high'].map(sev => (
               <button
                 key={sev}
                 type="button"
                 onClick={() => toggleCondition('severity', sev)}
                 className={`px-3 py-1 rounded border capitalize ${
                   conditions?.severity?.includes(sev as any) 
                     ? 'bg-[#19C37D] text-white border-[#19C37D]' 
                     : 'bg-transparent text-[#C9D1D9] border-[#2C333A]'
                 }`}
               >
                 {sev}
               </button>
             ))}
           </div>
        </div>
        <div>
           <label className="block text-[#C9D1D9] mb-1">Status do Cliente</label>
           <div className="flex gap-2">
             {['active', 'risk', 'churn'].map(st => (
               <button
                 key={st}
                 type="button"
                 onClick={() => toggleCondition('clientStatus', st)}
                 className={`px-3 py-1 rounded border capitalize ${
                   conditions?.clientStatus?.includes(st as any) 
                     ? 'bg-[#19C37D] text-white border-[#19C37D]' 
                     : 'bg-transparent text-[#C9D1D9] border-[#2C333A]'
                 }`}
               >
                 {st}
               </button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default RuleBuilder;
