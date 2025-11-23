import React from "react";
import { Client } from "../../types";

export default function MobileClientList({ clients }: { clients: Client[] }) {
  if (!clients || clients.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-[#1A1F24] border border-[#2C333A] rounded p-4 text-[#C9D1D9]">
          Nenhum cliente para exibir.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 grid gap-2">
      {clients.map((c) => (
        <div
          key={c.id}
          className="bg-[#1A1F24] border border-[#2C333A] rounded p-4"
        >
          <div className="text-white font-bold">{c.name}</div>
          <div className="text-xs mt-1 text-[#C9D1D9]">
            Status: <span className="font-semibold">{c.status}</span>
          </div>
          <div className="text-xs text-[#C9D1D9]">
            Prioridade: <span className="font-semibold">{c.priority}</span>
          </div>
        </div>
      ))}
    </div>
  );
}