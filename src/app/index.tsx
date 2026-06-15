import { GraficoFinancas } from '@/components/ui/GraficoFinancas';
import { useContext, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FinanceContext } from '../../src/context/FinanceContext';

export default function HomeScreen() {
  const { transacoes, adicionarTransacao, alternarStatusPago } = useContext(FinanceContext);

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('despesa');

  // CÓDIGO: Envia os dados digitados para o banco de dados
  const handleAdicionar = () => {
    if (!descricao.trim() || !valor.trim()) return;
    adicionarTransacao({
      descricao,
      valor: parseFloat(valor.replace(',', '.')), // Impede erro de vírgula
      tipo,
      pago: false
    });
    setDescricao('');
    setValor('');
  };

  // CÓDIGO: Calcula o total bruto de tudo que entrou e tudo que saiu
  const totalReceitas = transacoes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0);
  const totalDespesas = transacoes.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0);

  // CÓDIGO MÁGICO: Calcula o seu SALDO ATUAL (O que você tem menos o que você gastou)
  const saldoDisponivel = totalReceitas - totalDespesas;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.conteudo}>
        
        {/* FUNCIONALIDADE: Passa o "saldoDisponivel" para o gráfico. 
            Agora, quando você colocar uma despesa, o saldo diminui! */}
        <GraficoFinancas saldoDisponivel={saldoDisponivel} totalDespesas={totalDespesas} />

        {/* FUNCIONALIDADE: Formulário para cadastrar nova entrada/saída */}
        <View style={styles.formulario}>
          <Text style={styles.secaoTitulo}>Nova Transação</Text>
          <TextInput style={styles.input} placeholder="Descrição (Ex: Luz, Freelance)" value={descricao} onChangeText={setDescricao} />
          <TextInput style={styles.input} placeholder="Valor (R$)" keyboardType="numeric" value={valor} onChangeText={setValor} />
          <View style={styles.tipoContainer}>
            <TouchableOpacity style={[styles.botaoTipo, tipo === 'receita' && styles.botaoTipoReceitaAtivo]} onPress={() => setTipo('receita')}>
              <Text style={[styles.textoBotaoTipo, tipo === 'receita' && styles.textoAtivo]}>Receita</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botaoTipo, tipo === 'despesa' && styles.botaoTipoDespesaAtivo]} onPress={() => setTipo('despesa')}>
              <Text style={[styles.textoBotaoTipo, tipo === 'despesa' && styles.textoAtivo]}>Despesa</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.botaoAdicionar} onPress={handleAdicionar}>
            <Text style={styles.textoBotaoAdicionar}>Adicionar Transação</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.secaoTituloLista}>Histórico Financeiro Recente</Text>
        
        {/* FUNCIONALIDADE: Lista rápida da Home */}
        <FlatList 
          data={transacoes.slice(0, 5)} 
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemTransacao}>
              <View>
                <Text style={styles.itemDescricao}>{item.descricao}</Text>
                <Text style={[styles.itemValor, item.tipo === 'receita' ? styles.corReceita : styles.corDespesa]}>
                  {item.tipo === 'receita' ? '+' : '-'} R$ {item.valor.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity style={[styles.botaoStatus, item.pago ? styles.statusPago : styles.statusPendente]} onPress={() => alternarStatusPago(item.id)}>
                <Text style={styles.textoBotaoStatus}>{item.pago ? 'Pago' : 'Pendente'}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  conteudo: { flex: 1, padding: 16 },
  formulario: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginVertical: 10, elevation: 1 },
  secaoTitulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  secaoTituloLista: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, marginBottom: 10 },
  tipoContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  botaoTipo: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 10, alignItems: 'center', borderRadius: 6, marginHorizontal: 4 },
  botaoTipoReceitaAtivo: { backgroundColor: '#2ecc71', borderColor: '#2ecc71' },
  botaoTipoDespesaAtivo: { backgroundColor: '#e74c3c', borderColor: '#e74c3c' },
  textoBotaoTipo: { color: '#555', fontWeight: '600' },
  textoAtivo: { color: '#fff' },
  botaoAdicionar: { backgroundColor: '#34495e', padding: 12, borderRadius: 6, alignItems: 'center' },
  textoBotaoAdicionar: { color: '#fff', fontWeight: 'bold' },
  itemTransacao: { backgroundColor: '#fff', padding: 14, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  itemDescricao: { fontSize: 15, fontWeight: '500' },
  itemValor: { fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  corReceita: { color: '#2ecc71' },
  corDespesa: { color: '#e74c3c' },
  botaoStatus: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  statusPago: { backgroundColor: '#2ecc71' },
  statusPendente: { backgroundColor: '#f1c40f' },
  textoBotaoStatus: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});