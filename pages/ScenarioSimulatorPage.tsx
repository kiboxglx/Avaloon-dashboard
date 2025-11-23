import React, { useState } from 'react';
import ScenarioForm from '../components/scenarios/ScenarioForm';
import ScenarioResults from '../components/scenarios/ScenarioResults';
import { runSimulation } from '../lib/scenarios';
import { useCurrentOrg } from '../lib/tenancy';
import { Scenario } from '../types';

const ScenarioSimulatorPage: React.FC = () => {
  const { orgId } = useCurrentOrg();
  const [results, setResults] = useState<Scenario['results'] | null>(null);

  const handleSimulate = async (assumptions: Scenario['assumptions']) => {
    const today = new Date().toISOString().slice(0, 7);
    const res = await runSimulation(orgId, today, assumptions);
    setResults(res);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
       <h1 className="text-2xl font-bold text-gray-800 mb-2">Simulador de Cenários</h1>
       <p className="text-gray-500 mb-6">Planeje o crescimento da agência ajustando contratações, ads e churn.</p>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
             <ScenarioForm onSimulate={handleSimulate} />
          </div>
          <div className="lg:col-span-2">
             {results ? (
                 <ScenarioResults results={results} />
             ) : (
                 <div className="h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                     Preencha as premissas e clique em Simular
                 </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default ScenarioSimulatorPage;
