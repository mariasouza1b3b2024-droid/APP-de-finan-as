import React, { createContext, useState, ReactNode } from 'react';

// Moldes das informações
export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  pago: boolean;
  data: string;
}

export interface Meta {
  id: string;
  nome: string;
  motivo: string;
  valorAlvo: number;
  valorAtual: number;
}

interface FinanceContextData {
  transacoes: Transacao[];
  adicionarTransacao: (t: Omit<Transacao, 'id'>) => void;
  alternarStatusPago: (id: string) => void;
  metas: Meta[];
  adicionarMeta: (m: Omit<Meta, 'id' | 'valorAtual'>) => void;
  depositarMeta: (id: string, valor: number) => void;
  resgatarTudoMeta: (id: string) => void;
}

export const FinanceContext = createContext<FinanceContextData>({} as FinanceContextData);

export function FinanceProvider({ children }: { children: ReactNode }) {
  // Lista central de transações
  const [transacoes, setTransacoes] = useState<Transacao[]>([
    { id: '1', descricao: 'Salário', valor: 2500, tipo: 'receita', pago: true, data: '12/06' }
  ]);

  // Lista central de Metas (Caixinhas)
  const [metas, setMetas] = useState<Meta[]>([
    { id: '1', nome: 'Reserva de Emergência', motivo: 'Para imprevistos', valorAlvo: 5000, valorAtual: 1500 }
  ]);

  const adicionarTransacao = (nova: Omit<Transacao, 'id'>) => {
    setTransacoes([{ id: Math.random().toString(), ...nova }, ...transacoes]);
  };

  const alternarStatusPago = (id: string) => {
    setTransacoes(transacoes.map(t => t.id === id ? { ...t, pago: !t.pago } : t));
  };

  const adicionarMeta = (nova: Omit<Meta, 'id' | 'valorAtual'>) => {
    setMetas([...metas, { id: Math.random().toString(), valorAtual: 0, ...nova }]);
  };

  const depositarMeta = (id: string, valor: number) => {
    setMetas(metas.map(m => m.id === id ? { ...m, valorAtual: m.valorAtual + valor } : m));
    // Registra o depósito como uma despesa na carteira principal
    adicionarTransacao({ descricao: `Depósito na meta`, valor: valor, tipo: 'despesa', pago: true, data: 'Hoje' });
  };

  const resgatarTudoMeta = (id: string) => {
    const meta = metas.find(m => m.id === id);
    if (meta && meta.valorAtual > 0) {
      // Devolve o dinheiro para a conta principal como receita
      adicionarTransacao({ descricao: `Resgate da meta: ${meta.nome}`, valor: meta.valorAtual, tipo: 'receita', pago: true, data: 'Hoje' });
    }
    // Remove a meta ("quebra o cofrinho")
    setMetas(metas.filter(m => m.id !== id));
  };

  return (
    <FinanceContext.Provider value={{ transacoes, adicionarTransacao, alternarStatusPago, metas, adicionarMeta, depositarMeta, resgatarTudoMeta }}>
      {children}
    </FinanceContext.Provider>
  );
}