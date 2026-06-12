import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { GraficoFinancas } from '@/components/ui/GraficoFinancas';
import { FinanceContext } from '../../src/context/FinanceContext';

export default function HomeScreen() {
  // Puxando os dados do nosso "Banco de Dados Central"
  const { transacoes, adicionarTransacao, alternarStatusPago } = useContext(FinanceContext);

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('despesa');

  const handleAdicionar = () => {
    if (!descricao.trim() || !valor.trim()) return;
    adicionarTransacao({
      descricao,
      valor: parseFloat(valor.replace(',', '.')),
      tipo,
      pago: false,
      data: new Date().toLocaleDateString('pt-BR').slice(0, 5) // Ex: 12/06
    });
    setDescricao('');
    setValor('');
  };

  const totalReceitas = transacoes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0);
  const totalDespesas = transacoes.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.conteudo}>
        <GraficoFinancas totalReceitas={totalReceitas} totalDespesas={totalDespesas} />

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
        <FlatList 
          data={transacoes.slice(0, 5)} // Mostra só as 5 últimas na home
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

// import * as Device from 'expo-device';
// import { Platform, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import { AnimatedIcon } from '@/components/animated-icon';
// import { HintRow } from '@/components/hint-row';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { WebBadge } from '@/components/web-badge';
// import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

// function getDevMenuHint() {
//   if (Platform.OS === 'web') {
//     return <ThemedText type="small">use browser devtools</ThemedText>;
//   }
//   if (Device.isDevice) {
//     return (
//       <ThemedText type="small">
//         shake device or press <ThemedText type="code">m</ThemedText> in terminal
//       </ThemedText>
//     );
//   }
//   const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
//   return (
//     <ThemedText type="small">
//       press <ThemedText type="code">{shortcut}</ThemedText>
//     </ThemedText>
//   );
// }

// export default function HomeScreen() {
//   return (
//     <ThemedView style={styles.container}>
//       <SafeAreaView style={styles.safeArea}>
//         <ThemedView style={styles.heroSection}>
//           <AnimatedIcon />
//           <ThemedText type="title" style={styles.title}>
//             Welcome to&nbsp;Expo
//           </ThemedText>
//         </ThemedView>

//         <ThemedText type="code" style={styles.code}>
//           get started
//         </ThemedText>

//         <ThemedView type="backgroundElement" style={styles.stepContainer}>
//           <HintRow
//             title="Try editing"
//             hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
//           />
//           <HintRow title="Dev tools" hint={getDevMenuHint()} />
//           <HintRow
//             title="Fresh start"
//             hint={<ThemedText type="code">npm run reset-project</ThemedText>}
//           />
//         </ThemedView>

//         {Platform.OS === 'web' && <WebBadge />}
//       </SafeAreaView>
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     flexDirection: 'row',
//   },
//   safeArea: {
//     flex: 1,
//     paddingHorizontal: Spacing.four,
//     alignItems: 'center',
//     gap: Spacing.three,
//     paddingBottom: BottomTabInset + Spacing.three,
//     maxWidth: MaxContentWidth,
//   },
//   heroSection: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//     paddingHorizontal: Spacing.four,
//     gap: Spacing.four,
//   },
//   title: {
//     textAlign: 'center',
//   },
//   code: {
//     textTransform: 'uppercase',
//   },
//   stepContainer: {
//     gap: Spacing.three,
//     alignSelf: 'stretch',
//     paddingHorizontal: Spacing.three,
//     paddingVertical: Spacing.four,
//     borderRadius: Spacing.four,
//   },
// });
