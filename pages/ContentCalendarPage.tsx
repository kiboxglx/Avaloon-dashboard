import React, { useState, useEffect } from 'react';
import CalendarGrid from '../components/calendar/CalendarGrid';
import ContentItemForm from '../components/calendar/ContentItemForm';
import { getMockContent } from '../lib/calendar';
import { ContentItem } from '../types';
import { useCurrentOrg } from '../lib/tenancy';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ContentCalendarPage: React.FC = () => {
  const { orgId } = useCurrentOrg();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState<ContentItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [editingItem, setEditingItem] = useState<ContentItem | undefined>(undefined);

  useEffect(() => {
    setItems(getMockContent(orgId));
  }, [orgId]);

  const handleSave = (data: Partial<ContentItem>) => {
    if (editingItem) {
      setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...data } as ContentItem : i));
    } else {
      setItems(prev => [...prev, { ...data, id: `new_${Date.now()}`, clientId: 'demo', createdByUid: 'me' } as ContentItem]);
    }
    setShowForm(false);
    setEditingItem(undefined);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Calendário de Conteúdo</h1>
        <div className="flex items-center gap-4">
           <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="text-[#C9D1D9] hover:text-white">&lt;</button>
           <span className="text-white font-medium capitalize w-32 text-center">
             {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
           </span>
           <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="text-[#C9D1D9] hover:text-white">&gt;</button>
        </div>
        <button 
           onClick={() => { setSelectedDate(new Date().toISOString().slice(0, 10)); setEditingItem(undefined); setShowForm(true); }}
           className="px-4 py-2 bg-[#19C37D] text-white rounded hover:bg-[#0F8A57] font-medium"
        >
           + Agendar
        </button>
      </div>

      <CalendarGrid 
        currentDate={currentDate} 
        items={items} 
        onDayClick={(date) => {
          setSelectedDate(date.toISOString().slice(0, 10));
          setEditingItem(undefined);
          setShowForm(true);
        }}
        onItemClick={(item) => {
          setSelectedDate(item.scheduledDate);
          setEditingItem(item);
          setShowForm(true);
        }}
      />

      {showForm && (
        <ContentItemForm 
           date={selectedDate}
           initialData={editingItem}
           onClose={() => setShowForm(false)}
           onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ContentCalendarPage;
