import React from 'react';
import TvHeaderKpis from '../components/tv/TvHeaderKpis';
import TvClientSlide from '../components/tv/TvClientSlide';

// ... existing imports ...

interface TvWallboardPageProps {
  navigate: (path: string) => void;
}

const TvWallboardPage: React.FC<TvWallboardPageProps> = ({ navigate }) => {
  // ... existing logic mock ...
  const client = { id: '1', name: 'Cliente Demo', status: 'risk', priority: 'high', orgId: 'demo' } as any;

  return (
    <div className="min-h-screen bg-[#111418] flex flex-col overflow-hidden text-white">
      <TvHeaderKpis clients={[]} />
      
      <div className="flex-1 relative">
         <TvClientSlide client={client} metrics={{ followers: 1200, reach: 500, engagement: 50 } as any} alerts={[]} />
      </div>

      {/* Content Ticker */}
      <div className="bg-[#1A1F24] h-10 border-t border-[#2C333A] flex items-center overflow-hidden whitespace-nowrap">
         <div className="animate-marquee px-4 text-[#19C37D] font-bold text-sm uppercase tracking-widest">
            Conteúdos programados hoje: 12 | Em aprovação: 5 | Publicados: 8 | Alert: Cliente X rejeitou conteúdo
         </div>
      </div>
    </div>
  );
};

export default TvWallboardPage;
