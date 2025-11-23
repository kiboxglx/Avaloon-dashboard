import React from "react";

export default function MobileQuickActions() {
  return (
    <div className="px-4">
      <div className="grid grid-cols-2 gap-2">
        <button className="bg-[#19C37D] hover:bg-[#0F8A57] text-white font-bold py-3 rounded">
          + Tarefa rápida
        </button>

        <button className="bg-[#1A1F24] border border-[#2C333A] text-[#C9D1D9] font-semibold py-3 rounded">
          Registrar nota
        </button>
      </div>
    </div>
  );
}