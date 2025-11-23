import React, { useState, useEffect } from 'react';
import ClientsDashboardPage from './pages/ClientsDashboardPage';
import ClientDetailsPage from './pages/ClientDetailsPage';
import TvWallboardPage from './pages/TvWallboardPage';
import RevenueAnalyticsPage from './pages/RevenueAnalyticsPage';
import ScenarioSimulatorPage from './pages/ScenarioSimulatorPage';
import CohortsRetentionPage from './pages/CohortsRetentionPage';
import AutomationsPage from './pages/AutomationsPage';
import ContentCalendarPage from './pages/ContentCalendarPage';
import ApprovalsPage from './pages/ApprovalsPage';
import MobileHomePage from './pages/MobileHomePage';
import SettingsPage from './pages/SettingsPage'; // Importar SettingsPage

function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  let content;
  if (route.startsWith('#/tv')) {
    content = <TvWallboardPage navigate={navigate} />;
  } else if (route.startsWith('#/m')) {
    content = <MobileHomePage />;
  } else if (route.startsWith('#/client/')) {
    const clientId = route.split('/')[2];
    content = <ClientDetailsPage clientId={clientId} navigate={navigate} />;
  } else if (route.startsWith('#/revenue')) {
    content = <RevenueAnalyticsPage />;
  } else if (route.startsWith('#/scenarios')) {
    content = <ScenarioSimulatorPage />;
  } else if (route.startsWith('#/cohorts')) {
    content = <CohortsRetentionPage />;
  } else if (route.startsWith('#/automations')) {
    content = <AutomationsPage />;
  } else if (route.startsWith('#/calendar')) {
    content = <ContentCalendarPage />;
  } else if (route.startsWith('#/approvals')) {
    content = <ApprovalsPage />;
  } else if (route.startsWith('#/settings')) {
    content = <SettingsPage />;
  } else {
    content = <ClientsDashboardPage navigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-[#111418] text-[#C9D1D9] font-sans">
      {/* Navigation Header - Dark Mode */}
      {!route.startsWith('#/tv') && !route.startsWith('#/m') && (
        <nav className="bg-[#1A1F24] shadow-sm border-b border-[#2C333A] px-8 py-4 flex items-center space-x-6 overflow-x-auto sticky top-0 z-50">
            <span 
              onClick={() => navigate('#/')}
              className="font-extrabold text-[#FFFFFF] text-xl tracking-tight mr-4 cursor-pointer hover:text-[#19C37D] transition-colors"
            >
              AVALOON
            </span>
            
            <button onClick={() => navigate('#/')} className="text-sm font-medium text-[#C9D1D9] hover:text-[#19C37D] transition-colors">Clientes</button>
            <button onClick={() => navigate('#/revenue')} className="text-sm font-medium text-[#C9D1D9] hover:text-[#19C37D] transition-colors">Receita</button>
            <button onClick={() => navigate('#/calendar')} className="text-sm font-medium text-[#C9D1D9] hover:text-[#19C37D] transition-colors">Calendário</button>
            <button onClick={() => navigate('#/approvals')} className="text-sm font-medium text-[#C9D1D9] hover:text-[#19C37D] transition-colors">Aprovações</button>
            <button onClick={() => navigate('#/automations')} className="text-sm font-medium text-[#C9D1D9] hover:text-[#19C37D] transition-colors">Automações</button>
            
            <div className="flex-1"></div>
            
            <button onClick={() => navigate('#/settings')} className="text-sm font-medium text-[#C9D1D9] hover:text-[#19C37D] transition-colors mr-4">
               Configurações
            </button>

            <button onClick={() => navigate('#/tv')} className="px-3 py-1 bg-[#2C333A] text-white text-xs rounded uppercase hover:bg-[#19C37D] transition-colors">
               TV Mode
            </button>
        </nav>
      )}
      {content}
    </div>
  );
}

export default App;