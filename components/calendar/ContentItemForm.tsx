import React, { useState } from 'react';
import { ContentItem } from '../../types';

interface ContentItemFormProps {
  initialData?: Partial<ContentItem>;
  date: string;
  onSave: (data: Partial<ContentItem>) => void;
  onClose: () => void;
}

const ContentItemForm: React.FC<ContentItemFormProps> = ({ initialData, date, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<ContentItem>>(initialData || {
    scheduledDate: date,
    status: 'draft',
    channel: 'instagram',
    type: 'post'
  });

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1F24] rounded-lg border border-[#2C333A] w-full max-w-lg p-6">
         <h3 className="text-lg font-bold text-white mb-4">
            {initialData ? 'Editar Conteúdo' : 'Novo Conteúdo'}
         </h3>
         
         <div className="space-y-4">
            <div>
               <label className="block text-[#C9D1D9] text-xs uppercase font-bold mb-1">Título</label>
               <input 
                 type="text" 
                 value={formData.title || ''}
                 onChange={e => setFormData({...formData, title: e.target.value})}
                 className="w-full bg-[#111418] border border-[#2C333A] text-white rounded p-2 focus:border-[#19C37D] outline-none"
               />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[#C9D1D9] text-xs uppercase font-bold mb-1">Canal</label>
                   <select 
                      value={formData.channel}
                      onChange={e => setFormData({...formData, channel: e.target.value as any})}
                      className="w-full bg-[#111418] border border-[#2C333A] text-white rounded p-2"
                   >
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="tiktok">TikTok</option>
                   </select>
                </div>
                <div>
                   <label className="block text-[#C9D1D9] text-xs uppercase font-bold mb-1">Tipo</label>
                   <select 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value as any})}
                      className="w-full bg-[#111418] border border-[#2C333A] text-white rounded p-2"
                   >
                      <option value="post">Post</option>
                      <option value="reel">Reel</option>
                      <option value="story">Story</option>
                      <option value="ad">Ad</option>
                   </select>
                </div>
            </div>

            <div>
               <label className="block text-[#C9D1D9] text-xs uppercase font-bold mb-1">Legenda</label>
               <textarea 
                 rows={3}
                 value={formData.caption || ''}
                 onChange={e => setFormData({...formData, caption: e.target.value})}
                 className="w-full bg-[#111418] border border-[#2C333A] text-white rounded p-2 focus:border-[#19C37D] outline-none"
               />
            </div>

             <div>
               <label className="block text-[#C9D1D9] text-xs uppercase font-bold mb-1">Status</label>
               <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as any})}
                      className="w-full bg-[#111418] border border-[#2C333A] text-white rounded p-2"
                   >
                      <option value="draft">Rascunho</option>
                      <option value="scheduled">Agendado</option>
                      <option value="in_review">Em Aprovação</option>
                      <option value="published">Publicado</option>
                   </select>
            </div>
         </div>

         <div className="flex justify-end gap-3 mt-6">
            <button onClick={onClose} className="px-4 py-2 text-[#C9D1D9] hover:text-white">Cancelar</button>
            <button 
              onClick={() => onSave(formData)}
              className="px-4 py-2 bg-[#19C37D] hover:bg-[#0F8A57] text-white rounded font-medium"
            >
              Salvar
            </button>
         </div>
      </div>
    </div>
  );
};

export default ContentItemForm;
