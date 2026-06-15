import { createContext, ReactNode, useState } from 'react';

// FUNCIONALIDADE: Molde das informações da Transação
export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  pago: boolean;
  data: string;
  hora: string;
}

// FUNCIONALIDADE: Molde das Metas
export interface Meta {
  id: string;
  nome: string;
  motivo: string;
  valorAlvo: number;
  valorAtual: number;
}

// FUNCIONALIDADE: Definindo o que o nosso Contexto vai exportar para as outras telas
interface FinanceContextData {
  transacoes: Transacao[];
  adicionarTransacao: (t: Omit<Transacao, 'id' | 'data' | 'hora'>) => void;
  alternarStatusPago: (id: string) => void;
  metas: Meta[];
  adicionarMeta: (m: Omit<Meta, 'id' | 'valorAtual'>) => void;
  depositarMeta: (id: string, valor: number) => void;
  resgatarTudoMeta: (id: string) => void;
}

export const FinanceContext = createContext<FinanceContextData>({} as FinanceContextData);

export function FinanceProvider({ children }: { children: ReactNode }) {
  // DADOS INICIAIS DA LISTA
  const [transacoes, setTransacoes] = useState<Transacao[]>([
    { id: '1', descricao: 'Salário', valor: 2500, tipo: 'receita', pago: true, data: '12/06', hora: '08:00' }
  ]);

  const [metas, setMetas] = useState<Meta[]>([
    { id: '1', nome: 'Reserva de Emergência', motivo: 'Para imprevistos', valorAlvo: 5000, valorAtual: 1500 }
  ]);

  // CÓDIGO: Função para adicionar transação. 
  // O uso do "prev" garante que o React sempre pegue a lista 100% atualizada antes de salvar.
  const adicionarTransacao = (nova: Omit<Transacao, 'id' | 'data' | 'hora'>) => {
    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString('pt-BR').slice(0, 5); 
    const horaFormatada = agora.toLocaleTimeString('pt-BR').slice(0, 5); 

    setTransacoes(prev => [{ 
      id: Date.now().toString() + Math.random().toString(), // ID muito mais seguro
      data: dataFormatada, 
      hora: horaFormatada, 
      ...nova 
    }, ...prev]);
  };

  const alternarStatusPago = (id: string) => {
    setTransacoes(prev => prev.map(t => t.id === id ? { ...t, pago: !t.pago } : t));
  };

  // CÓDIGO: Adiciona a nova meta sempre respeitando as que já foram criadas (prev)
  const adicionarMeta = (nova: Omit<Meta, 'id' | 'valorAtual'>) => {
    setMetas(prev => [...prev, { id: Date.now().toString() + Math.random().toString(), valorAtual: 0, ...nova }]);
  };

  // CÓDIGO: Deposita dinheiro na meta. O bug estava aqui! Agora o "prev" obriga 
  // o app a enxergar as metas recém-criadas antes de somar o valor.
  const depositarMeta = (id: string, valor: number) => {
    setMetas(prev => prev.map(m => m.id === id ? { ...m, valorAtual: m.valorAtual + valor } : m));
    adicionarTransacao({ descricao: `Depósito na meta`, valor: valor, tipo: 'despesa', pago: true });
  };

  const resgatarTudoMeta = (id: string) => {
    const meta = metas.find(m => m.id === id);
    if (meta && meta.valorAtual > 0) {
      adicionarTransacao({ descricao: `Resgate da meta: ${meta.nome}`, valor: meta.valorAtual, tipo: 'receita', pago: true });
    }
    setMetas(prev => prev.filter(m => m.id !== id)); 
  };

  return (
    <FinanceContext.Provider value={{ transacoes, adicionarTransacao, alternarStatusPago, metas, adicionarMeta, depositarMeta, resgatarTudoMeta }}>
      {children}
    </FinanceContext.Provider>
  );
}