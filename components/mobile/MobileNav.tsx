import React from "react";

type TabKey = "clientes" | "tarefas" | "alertas" | "insights";

const tabs: { key: TabKey; label: string }[] = [
  { key: "clientes", label: "Clientes" },
  { key: "tarefas", label: "Tarefas" },
  { key: "alertas", label: "Alertas" },
  { key: "insights", label: "Insights" },
];

export default function MobileNav({
  activeTab,
  onTabChange,
}: {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1F24] border-t border-[#2C333A] flex justify-around py-2 z-50">
      {tabs.map((t) => {
        const active = t.key === activeTab;
        return (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={`text-sm font-semibold px-3 py-2 rounded transition ${
              active ? "text-[#19C37D]" : "text-[#C9D1D9]"
            }`}
            style={{ background: "transparent", border: "none" }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}