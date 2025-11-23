import React, { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import { useCurrentOrg } from '../lib/tenancy';

const SettingsPage: React.FC = () => {
  const { orgId } = useCurrentOrg();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    if (!confirm('Isso irá gerar dados de demonstração. Continuar?')) return;
    setLoading(true);
    try {
      const fn = httpsCallable(functions, 'seedDemoDataCallable');
      await fn();
      setMessage('✅ Dados demo gerados com sucesso! Atualize a página.');
      // Force reload to pick up new org context if needed
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error(error);
      setMessage('❌ Erro ao gerar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('Isso irá apagar todos os dados DEMO. Continuar?')) return;
    setLoading(true);
    try {
      const fn = httpsCallable(functions, 'clearDemoDataCallable');
      await fn();
      setMessage('✅ Dados demo removidos.');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error(error);
      setMessage('❌ Erro ao limpar dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-[#C9D1D9]">
      <h1 className="text-2xl font-bold text-white mb-6">Configurações</h1>

      <div className="bg-[#1A1F24] rounded-lg border border-[#2C333A] p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Organização</h2>
        <p className="text-sm">ID da Organização Atual: <span className="font-mono text-[#19C37D]">{orgId}</span></p>
      </div>

      <div className="bg-[#1A1F24] rounded-lg border border-[#2C333A] p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Dados de Demonstração</h2>
        <p className="text-sm mb-4">
          Gere dados fictícios (Clientes, Métricas, Alertas, Conteúdos) para visualizar o potencial da plataforma.
          <br/>
          <span className="text-xs text-yellow-500">Nota: Os dados serão criados na organização 'demo_org_avaloon'.</span>
        </p>

        <div className="flex gap-4">
          <button 
            onClick={handleSeed} 
            disabled={loading}
            className="px-4 py-2 bg-[#19C37D] text-white font-bold rounded hover:bg-[#0F8A57] disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Gerar Dados Demo'}
          </button>
          
          <button 
            onClick={handleClear}
            disabled={loading}
            className="px-4 py-2 bg-[#1A1F24] border border-red-900 text-red-500 font-bold rounded hover:bg-red-900/20 disabled:opacity-50"
          >
            Limpar Dados Demo
          </button>
        </div>
        
        {message && (
          <div className="mt-4 p-3 bg-[#111418] border border-[#2C333A] rounded text-sm">
            {message}
          </div>
        )}
      </div>

      <div className="bg-[#1A1F24] rounded-lg border border-[#2C333A] p-6">
        <h2 className="text-lg font-bold text-white mb-4">Integrações & Webhooks</h2>
        <a href="#/settings/webhooks" className="text-[#19C37D] hover:underline">Gerenciar Webhooks &rarr;</a>
      </div>
    </div>
  );
};

export default SettingsPage;
