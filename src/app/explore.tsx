import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { FinanceContext } from '../../src/context/FinanceContext';
import { Ionicons } from '@expo/vector-icons';

export default function ExploraScreen() {
  const { transacoes } = useContext(FinanceContext);
  const [busca, setBusca] = useState('');

  // Lógica da pesquisa: Filtra a lista baseada no que foi digitado
  const transacoesFiltradas = transacoes.filter(t => 
    t.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={styles.container}>
      
      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#95a5a6" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Pesquisar transação..."
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <Text style={styles.titulo}>Extrato Detalhado</Text>
      
      <FlatList
        data={transacoesFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.data}>{item.data}</Text>
              <Text style={styles.itemNome}>{item.descricao}</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={[styles.valor, item.tipo === 'receita' ? styles.receita : styles.despesa]}>
                {item.tipo === 'receita' ? '+' : '-'} R$ {item.valor.toFixed(2)}
              </Text>
              <Text style={styles.statusPago}>{item.pago ? 'Efetuado' : 'Pendente'}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.textoVazio}>Nenhuma transação encontrada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa', padding: 20 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 10, marginBottom: 20, elevation: 1 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12 },
  titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#2c3e50' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderLeftWidth: 5, borderLeftColor: '#1abc9c' },
  itemNome: { fontSize: 16, fontWeight: '600' },
  data: { fontSize: 12, color: '#95a5a6' },
  valor: { fontSize: 16, fontWeight: 'bold' },
  statusPago: { fontSize: 10, color: '#7f8c8d', marginTop: 4 },
  receita: { color: '#2ecc71' },
  despesa: { color: '#e74c3c' },
  textoVazio: { textAlign: 'center', color: '#95a5a6', marginTop: 20 }
});