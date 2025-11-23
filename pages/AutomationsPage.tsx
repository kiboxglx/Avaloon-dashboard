import React, { useState, useEffect } from 'react';
import AutomationsTable from '../components/automations/AutomationsTable';
import AutomationForm from '../components/automations/AutomationForm';
import { getMockAutomations, saveAutomation, deleteAutomation } from '../lib/automations';
import { AutomationRule } from '../types';
import { useCurrentOrg } from '../lib/tenancy';

const AutomationsPage: React.FC = () => {
  const { orgId } = useCurrentOrg();
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | undefined>(undefined);

  useEffect(() => {
    // Load mock data for demo
    setRules(getMockAutomations(orgId));
  }, [orgId]);

  const handleSave = async (data: Partial<AutomationRule>) => {
    // In real app: await saveAutomation(orgId, data, 'user_uid');
    // For demo, update local state
    if (editingRule) {
      setRules(prev => prev.map(r => r.id === editingRule.id ? { ...r, ...data } as AutomationRule : r));
    } else {
      setRules(prev => [...prev, { ...data, id: `new_${Date.now()}`, runsCount: 0 } as AutomationRule]);
    }
    setShowForm(false);
    setEditingRule(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm('Excluir regra?')) {
        setRules(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-2xl font-bold text-white">Automações (Rules Engine)</h1>
           <p className="text-[#C9D1D9] text-sm">Automatize tarefas, notificações e alertas baseados em eventos.</p>
        </div>
        <button 
          onClick={() => { setEditingRule(undefined); setShowForm(true); }}
          className="px-4 py-2 bg-[#19C37D] text-white rounded hover:bg-[#0F8A57] font-medium"
        >
          + Nova Automação
        </button>
      </div>

      {showForm && (
        <AutomationForm 
          initialData={editingRule} 
          onSave={handleSave} 
          onCancel={() => { setShowForm(false); setEditingRule(undefined); }}
        />
      )}

      <AutomationsTable 
        rules={rules} 
        onEdit={(r) => { setEditingRule(r); setShowForm(true); }}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AutomationsPage;
