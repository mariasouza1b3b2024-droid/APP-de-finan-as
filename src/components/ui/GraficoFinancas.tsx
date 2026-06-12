import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Definindo o que o componente precisa receber para funcionar
interface GraficoProps {
  totalReceitas: number;
  totalDespesas: number;
}

export function GraficoFinancas({ totalReceitas, totalDespesas }: GraficoProps) {
  const total = totalReceitas + totalDespesas;
  
  // FUNCIONALIDADE: Cálculo matemático da porcentagem para definir a altura de cada barra do gráfico
  // Se o total for 0, definimos 0% para evitar erro de divisão por zero.
  const pctReceitas = total > 0 ? (totalReceitas / total) * 100 : 0;
  const pctDespesas = total > 0 ? (totalDespesas / total) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* COMPONENTE: Text para o título da seção */}
      <Text style={styles.titulo}>Resumo Visual</Text>
      
      {/* COMPONENTE: View que serve de container para alinhar as barras lado a lado */}
      <View style={styles.graficoContainer}>
        
        {/* BARRA DE RECEITAS */}
        <View style={styles.colunaContainer}>
          {/* COMPONENTE: View estilizada cuja altura (height) muda dinamicamente conforme a porcentagem */}
          <View style={[styles.barraReceita, { height: `${pctReceitas}%` }]} />
          <Text style={styles.legendaBarra}>Receitas</Text>
          <Text style={styles.valorBarra}>R$ {totalReceitas}</Text>
        </View>

        {/* BARRA DE DESPESAS */}
        <View style={styles.colunaContainer}>
          {/* COMPONENTE: Outra View para a barra de despesas, controlada pela porcentagem calculada */}
          <View style={[styles.barraDespesa, { height: `${pctDespesas}%` }]} />
          <Text style={styles.legendaBarra}>Despesas</Text>
          <Text style={styles.valorBarra}>R$ {totalDespesas}</Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 2, // Sombra suave no Android
    shadowColor: '#000', // Sombra suave no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  graficoContainer: {
    flexDirection: 'row', // Alinha as colunas uma ao lado da outra
    justifyContent: 'space-around',
    alignItems: 'flex-end', // Garante que as barras cresçam de baixo para cima
    height: 150, // Altura máxima do gráfico
    paddingTop: 10,
  },
  colunaContainer: {
    alignItems: 'center',
    width: '40%',
    height: '100%',
    justifyContent: 'flex-end', // Alinha tudo na base da coluna
  },
  barraReceita: {
    width: 40,
    backgroundColor: '#2ecc71', // Cor verde para receitas
    borderRadius: 4,
  },
  barraDespesa: {
    width: 40,
    backgroundColor: '#e74c3c', // Cor vermelha para despesas
    borderRadius: 4,
  },
  legendaBarra: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    color: '#555',
  },
  valorBarra: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});