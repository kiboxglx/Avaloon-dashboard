import React, { useMemo, useState } from "react";
import MobileNav from "../components/mobile/MobileNav";
import MobileQuickActions from "../components/mobile/MobileQuickActions";
import MobileClientList from "../components/mobile/MobileClientList";
import { Client } from "../types";

type TabKey = "clientes" | "tarefas" | "alertas" | "insights";

const MobileHomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("clientes");

  // Aqui pode trocar pelos seus dados reais depois
  const todaysContent = [
    {
      id: "1",
      title: "Post Motivacional",
      client: "Academia Fit",
      status: "scheduled",
      time: "10:00",
    },
    {
      id: "2",
      title: "Story Promo",
      client: "Loja Moda",
      status: "published",
      time: "08:00",
    },
  ];

  // Placeholder de clientes (pode substituir pelo Firestore)
  const clients = useMemo<Client[]>(() => [], []);

  return (
    <div className="min-h-screen bg-[#111418] text-[#C9D1D9] pb-20">
      {/* Header */}
      <div className="bg-[#1A1F24] p-4 border-b border-[#2C333A] flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-lg font-bold text-white">Avaloon Mobile</h1>
        <div className="w-2 h-2 rounded-full bg-[#19C37D]" />
      </div>

      {/* Conteúdo de hoje */}
      <div className="p-4">
        <h2 className="text-sm font-bold text-[#19C37D] uppercase mb-2">
          Conteúdo de hoje
        </h2>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {todaysContent.map((c) => (
            <div
              key={c.id}
              className="min-w-[180px] bg-[#1A1F24] p-3 rounded border border-[#2C333A]"
            >
              <div className="text-xs text-[#C9D1D9]">{c.time}</div>
              <div className="font-bold text-white truncate">{c.title}</div>
              <div className="text-xs text-gray-400 truncate">{c.client}</div>
              <span
                className={`text-[10px] px-2 py-1 rounded mt-2 inline-block ${
                  c.status === "published"
                    ? "bg-[#19C37D] text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                {c.status === "published" ? "Publicado" : "Agendado"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <MobileQuickActions />

      {/* Tabs */}
      <div className="mt-2">
        {activeTab === "clientes" && <MobileClientList clients={clients} />}

        {activeTab === "tarefas" && (
          <div className="p-4">
            <div className="bg-[#1A1F24] border border-[#2C333A] rounded p-4">
              <p className="text-white font-bold mb-1">Tarefas</p>
              <p className="text-sm text-[#C9D1D9]">
                Em breve: lista mobile de tarefas.
              </p>
            </div>
          </div>
        )}

        {activeTab === "alertas" && (
          <div className="p-4">
            <div className="bg-[#1A1F24] border border-[#2C333A] rounded p-4">
              <p className="text-white font-bold mb-1">Alertas</p>
              <p className="text-sm text-[#C9D1D9]">
                Em breve: lista mobile de alertas.
              </p>
            </div>
          </div>
        )}

        {activeTab === "insights" && (
          <div className="p-4">
            <div className="bg-[#1A1F24] border border-[#2C333A] rounded p-4">
              <p className="text-white font-bold mb-1">Insights</p>
              <p className="text-sm text-[#C9D1D9]">
                Em breve: insights recentes do cliente.
              </p>
            </div>
          </div>
        )}
      </div>

      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default MobileHomePage;