import React, { useState } from 'react';
import { Client } from '../../types';
import { db } from '../../lib/firebase';
import { connectInstagram } from '../../lib/instagram';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

interface ClientFormProps {
  existingClient?: Client;
  onClose: () => void;
  onSuccess: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ existingClient, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<Partial<Client>>(existingClient || {
    status: 'lead',
    priority: 'medium',
    instagram: { connected: false }
  });
  
  // Local state for IG credentials (never saved directly to Firestore from here)
  const [igBusinessId, setIgBusinessId] = useState(existingClient?.instagram?.igBusinessId || '');
  const [igAccessToken, setIgAccessToken] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [connectingIg, setConnectingIg] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const now = Date.now();
      // Ensure fields are not undefined (Firestore rejects undefined)
      const clientData = {
        name: formData.name || '',
        fantasyName: formData.fantasyName || null,
        email: formData.email || null,
        phone: formData.phone || null,
        city: formData.city || null,
        segment: formData.segment || null,
        status: formData.status || 'lead',
        priority: formData.priority || 'medium',
        owner: formData.owner || null,
        notes: formData.notes || null,
        updatedAt: now,
      };

      let clientId = existingClient?.id;

      if (clientId) {
        await updateDoc(doc(db, 'clients', clientId), clientData);
      } else {
        const docRef = await addDoc(collection(db, 'clients'), {
          ...clientData,
          createdAt: now,
          instagram: { connected: false }
        });
        clientId = docRef.id;
      }

      // If IG credentials provided, try to connect via Backend
      if (igBusinessId && igAccessToken && clientId) {
        setConnectingIg(true);
        try {
          await connectInstagram({
            clientId,
            igBusinessId,
            accessToken: igAccessToken
          });
        } catch (err) {
          alert("Cliente salvo, mas erro ao conectar Instagram. Verifique as credenciais.");
          console.error(err);
        } finally {
          setConnectingIg(false);
        }
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving client:", error);
      alert("Erro ao salvar cliente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {existingClient ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSaveClient} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome (Razão Social)</label>
              <input required name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome Fantasia</label>
              <input name="fantasyName" value={formData.fantasyName || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <input name="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Segmento</label>
              <input name="segment" value={formData.segment || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Responsável (Dono)</label>
              <input name="owner" value={formData.owner || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                <option value="lead">Lead</option>
                <option value="active">Ativo</option>
                <option value="risk">Em Risco</option>
                <option value="churn">Churn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prioridade</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4 bg-gray-50 p-4 rounded-md">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Conexão Instagram (Backend Seguro)</h3>
            <p className="text-xs text-gray-500 mb-2">
              Os tokens são enviados diretamente ao servidor e criptografados. Não são armazenados no navegador.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Instagram Business ID</label>
                <input 
                  type="text"
                  value={igBusinessId}
                  onChange={(e) => setIgBusinessId(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 font-mono text-sm" 
                  placeholder="ex: 17841400000000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Access Token (Long Lived)</label>
                <input 
                  type="password"
                  value={igAccessToken}
                  onChange={(e) => setIgAccessToken(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 font-mono text-sm" 
                  placeholder={existingClient?.instagram?.connected ? "(Mantido seguro no servidor)" : "EAAB..."}
                />
              </div>
              <div className="text-xs text-gray-500">
                {existingClient?.instagram?.connected ? 
                  <span className="text-green-600 font-bold">✓ Conectado atualmente</span> : 
                  <span className="text-gray-400">Não conectado</span>
                }
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Observações</label>
            <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading || connectingIg} 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 flex items-center"
            >
              {loading ? (connectingIg ? 'Conectando Instagram...' : 'Salvando...') : 'Salvar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;