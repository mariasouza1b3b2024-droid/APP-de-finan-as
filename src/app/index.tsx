import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView
} from 'react-native';


export default function App() {
  // --- ESTADOS (STATE) ---
  const [transacoes, setTransacoes] = useState([
    { id: '1', descricao: 'Salário', valor: 2500, tipo: 'receita', pago: true },
    { id: '2', descricao: 'Aluguel', valor: 1200, tipo: 'despesa', pago: false },
    { id: '3', descricao: 'Mercado', valor: 350, tipo: 'despesa', pago: true },
  ]);


  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('despesa'); // 'despesa' ou 'receita'


  // --- FUNÇÕES ---
  // Adicionar nova transação
  const adicionarTransacao = () => {
    if (!descricao || !valor) {
      alert('Por favor, preencha todos os campos!');
      return;
    }


    const novaTransacao = {
      id: Math.random().toString(),
      descricao,
      valor: parseFloat(valor),
      tipo,
      pago: false,
    };


    setTransacoes([...transacoes, novaTransacao]);
    setDescricao('');
    setValor('');
  };


  // Alternar o status de pago/não pago
  const alternarPago = (id) => {
    const listaAtualizada = transacoes.map(item => {
      if (item.id === id) {
        return { ...item, pago: !item.pago };
      }
      return item;
    });
    setTransacoes(listaAtualizada);
  };


  // --- CÁLCULOS PARA O GRÁFICO SIMPLES ---
  const totalReceitas = transacoes
    .filter(t => t.tipo === 'receita')
    .reduce((sum, t) => sum + t.valor, 0);


  const totalDespesas = transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((sum, t) => sum + t.valor, 0);


  const saldoTotal = totalReceitas - totalDespesas;


  // Lógica de barras proporcionais para o gráfico
  const maxValor = Math.max(totalReceitas, totalDespesas, 1);
  const barraReceita = (totalReceitas / maxValor) * 100;
  const barraDespesa = (totalDespesas / maxValor) * 100;


  return (
    <SafeAreaView style={styles.container}>
      {/* NAVBAR */}
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>MeuApp Finanças</Text>
      </View>


      <View style={styles.conteudo}>
        {/* GRÁFICO SIMPLES DE GASTOS */}
        <View style={styles.cardGrafico}>
          <Text style={styles.tituloSecao}>Resumo Visual</Text>
          <View style={styles.containerBarras}>
            <View style={styles.linhaGrafico}>
              <Text style={styles.labelGrafico}>Receitas:</Text>
              <View style={[styles.barra, { width: `${barraReceita}%`, backgroundColor: '#2ecc71' }]} />
              <Text style={styles.valorGrafico}>R$ {totalReceitas}</Text>
            </View>
            <View style={styles.linhaGrafico}>
              <Text style={styles.labelGrafico}>Despesas:</Text>
              <View style={[styles.barra, { width: `${barraDespesa}%`, backgroundColor: '#e74c3c' }]} />
              <Text style={styles.valorGrafico}>R$ {totalDespesas}</Text>
            </View>
          </View>
          <Text style={[styles.saldoText, { color: saldoTotal >= 0 ? '#2ecc71' : '#e74c3c' }]}>
            Saldo: R$ {saldoTotal.toFixed(2)}
          </Text>
        </View>


        {/* FORMULÁRIO: ADICIONAR NOVA TRANSAÇÃO */}
        <View style={styles.formulario}>
          <TextInput
            style={styles.input}
            placeholder="Descrição (ex: Luz, Freelance)"
            value={descricao}
            onChangeText={setDescricao}
          />
          <TextInput
            style={styles.input}
            placeholder="Valor (ex: 150.00)"
            keyboardType="numeric"
            value={valor}
            onChangeText={setValor}
          />
         
          {/* Seletor de Tipo (Receita/Despesa) */}
          <View style={styles.botoesTipo}>
            <TouchableOpacity
              style={[styles.botaoTipo, tipo === 'receita' && styles.ativoReceita]}
              onPress={() => setTipo('receita')}
            >
              <Text style={tipo === 'receita' ? styles.textoAtivo : styles.textoInativo}>Receita</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botaoTipo, tipo === 'despesa' && styles.ativoDespesa]}
              onPress={() => setTipo('despesa')}
            >
              <Text style={tipo === 'despesa' ? styles.textoAtivo : styles.textoInativo}>Despesa</Text>
            </TouchableOpacity>
          </View>


          <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarTransacao}>
            <Text style={styles.textoBotaoAdicionar}>Adicionar Transação</Text>
          </TouchableOpacity>
        </View>


        {/* LISTA DE DESPESAS E RECEITAS */}
        <Text style={styles.tituloSecao}>Suas Transações</Text>
        <FlatList
          data={transacoes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemTransacao}>
              <View>
                <Text style={styles.itemDescricao}>{item.descricao}</Text>
                <Text style={[styles.itemValor, { color: item.tipo === 'receita' ? '#2ecc71' : '#e74c3c' }]}>
                  {item.tipo === 'receita' ? '+' : '-'} R$ {item.valor.toFixed(2)}
                </Text>
              </View>
             
              {/* Botão Marcar como Pago */}
              <TouchableOpacity
                style={[styles.botaoPago, item.pago ? styles.pago : styles.naoPago]}
                onPress={() => alternarPago(item.id)}
              >
                <Text style={styles.textoBotaoPago}>
                  {item.pago ? '✓ Pago' : '⏳ Pendente'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>


      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 Controle Financeiro Inc.</Text>
      </View>
    </SafeAreaView>
  );
}


// --- ESTILOS (CSS DO REACT NATIVE) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  navbar: {
    height: 60,
    backgroundColor: '#34495e',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  navbarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  conteudo: {
    flex: 1,
    padding: 15,
  },
  cardGrafico: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  containerBarras: {
    marginVertical: 10,
  },
  linhaGrafico: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelGrafico: {
    width: 70,
    fontSize: 12,
    color: '#7f8c8d',
  },
  barra: {
    height: 12,
    borderRadius: 6,
    marginHorizontal: 10,
    flex: 1,
    maxWidth: '60%',
  },
  valorGrafico: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  saldoText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  formulario: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  botoesTipo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  botaoTipo: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#dcdde1',
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 2,
  },
  ativoReceita: { backgroundColor: '#2ecc71', borderColor: '#2ecc71' },
  ativoDespesa: { backgroundColor: '#e74c3c', borderColor: '#e74c3c' },
  textoAtivo: { color: '#fff', fontWeight: 'bold' },
  textoInativo: { color: '#7f8c8d' },
  botaoAdicionar: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  textoBotaoAdicionar: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  itemTransacao: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 1,
  },
  itemDescricao: { fontSize: 16, fontWeight: 'bold' },
  itemValor: { fontSize: 14, marginTop: 4 },
  botaoPago: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  pago: { backgroundColor: '#d4edda' },
  naoPago: { backgroundColor: '#f8d7da' },
  textoBotaoPago: { fontSize: 12, fontWeight: 'bold' },
  footer: {
    height: 40,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: { color: '#bdc3c7', fontSize: 12 },
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
