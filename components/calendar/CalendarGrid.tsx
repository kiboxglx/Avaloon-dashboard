import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ContentItem } from '../../types';

interface CalendarGridProps {
  currentDate: Date;
  items: ContentItem[];
  onDayClick: (date: Date) => void;
  onItemClick: (item: ContentItem) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, items, onDayClick, onItemClick }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getStatusColor = (status: ContentItem['status']) => {
    switch (status) {
      case 'published': return 'bg-[#19C37D]';
      case 'scheduled': return 'bg-blue-500';
      case 'in_review': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-7 gap-px bg-[#2C333A] border border-[#2C333A] rounded-lg overflow-hidden">
      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
        <div key={day} className="bg-[#1A1F24] p-2 text-center text-xs font-bold text-[#C9D1D9] uppercase">
          {day}
        </div>
      ))}
      
      {days.map(day => {
        const dayItems = items.filter(i => isSameDay(new Date(i.scheduledDate), day));
        const isCurrentMonth = isSameMonth(day, monthStart);

        return (
          <div 
            key={day.toISOString()} 
            className={`min-h-[120px] bg-[#111418] p-2 hover:bg-[#1A1F24] transition-colors cursor-pointer ${!isCurrentMonth ? 'opacity-30' : ''}`}
            onClick={() => onDayClick(day)}
          >
            <div className={`text-sm font-medium mb-1 ${isSameDay(day, new Date()) ? 'text-[#19C37D]' : 'text-[#C9D1D9]'}`}>
              {format(day, 'd')}
            </div>
            
            <div className="space-y-1">
              {dayItems.map(item => (
                <div 
                  key={item.id}
                  onClick={(e) => { e.stopPropagation(); onItemClick(item); }}
                  className="px-2 py-1 rounded bg-[#2C333A] text-xs text-white truncate border-l-2 border-transparent hover:border-white transition-all flex items-center gap-1"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(item.status)}`} />
                  {item.title}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CalendarGrid;
