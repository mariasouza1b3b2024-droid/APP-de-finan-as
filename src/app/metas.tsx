import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, FlatList, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FinanceContext } from '../../src/context/FinanceContext';

export default function MetasScreen() {
  const { metas, adicionarMeta, depositarMeta, resgatarTudoMeta } = useContext(FinanceContext);
  const router = useRouter(); 
  
  const [modalCriar, setModalCriar] = useState(false);
  const [modalAcao, setModalAcao] = useState(false);
  
  const [nome, setNome] = useState('');
  const [motivo, setMotivo] = useState('');
  const [valorAlvo, setValorAlvo] = useState('');

  const [metaSelecionada, setMetaSelecionada] = useState<string | null>(null);
  const [valorDeposito, setValorDeposito] = useState('');

  // CÓDIGO: Salva a nova caixinha aceitando valores com vírgula (replace)
  const handleCriarMeta = () => {
    if (!nome || !valorAlvo) return;
    adicionarMeta({ 
      nome, 
      motivo, 
      valorAlvo: parseFloat(valorAlvo.replace(',', '.')) 
    });
    setModalCriar(false);
    setNome(''); setMotivo(''); setValorAlvo('');
  };

  // CÓDIGO: Deposita o dinheiro na caixinha nova aceitando valores com vírgula (replace)
  const handleDepositar = () => {
    if (metaSelecionada && valorDeposito) {
      depositarMeta(metaSelecionada, parseFloat(valorDeposito.replace(',', '.')));
      setModalAcao(false);
      setValorDeposito('');
    }
  };

  const handleResgatarTudo = () => {
    if (!metaSelecionada) return;

    const executarResgate = () => {
      resgatarTudoMeta(metaSelecionada);
      setModalAcao(false);
      
      if (Platform.OS === 'web') {
        window.alert('Sucesso! Dinheiro retirado com sucesso e voltou para sua carteira.');
        router.push('/'); 
      } else {
        Alert.alert('Sucesso!', 'Dinheiro retirado com sucesso e voltou para sua carteira.');
        router.push('/'); 
      }
    };

    if (Platform.OS === 'web') {
      const confirmou = window.confirm('Você vai resgatar todo o dinheiro e apagar essa caixinha. Tem certeza?');
      if (confirmou) executarResgate();
    } else {
      Alert.alert('Quebrar o cofrinho?', 'Você vai resgatar todo o dinheiro e apagar essa caixinha. Tem certeza?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim, resgatar', onPress: executarResgate }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Minhas Caixinhas (Metas)</Text>

      <FlatList 
        data={metas}
        keyExtractor={m => m.id}
        renderItem={({ item }) => {
          const porcentagem = item.valorAlvo > 0 ? (item.valorAtual / item.valorAlvo) * 100 : 0;
          return (
            <TouchableOpacity 
              style={styles.metaCard} 
              onPress={() => { setMetaSelecionada(item.id); setModalAcao(true); }}
            >
              <Text style={styles.metaNome}>{item.nome}</Text>
              <Text style={styles.metaMotivo}>{item.motivo}</Text>
              <Text style={styles.metaProgresso}>R$ {item.valorAtual.toFixed(2)} / R$ {item.valorAlvo.toFixed(2)}</Text>
              <View style={styles.barraFundo}>
                <View style={[styles.barraFrente, { width: `${Math.min(porcentagem, 100)}%` }]} />
              </View>
            </TouchableOpacity>
          )
        }}
        ListEmptyComponent={<Text style={styles.textoVazio}>Nenhuma meta criada ainda.</Text>}
      />

      <TouchableOpacity style={styles.botaoPrincipal} onPress={() => setModalCriar(true)}>
        <Text style={styles.botaoTextoBranco}>+ Criar Nova Caixinha</Text>
      </TouchableOpacity>

      <Modal visible={modalCriar} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Criar Caixinha</Text>
            <TextInput style={styles.input} placeholder="Nome (Ex: Viagem)" value={nome} onChangeText={setNome} />
            <TextInput style={styles.input} placeholder="Para que é? (Ex: Férias 2024)" value={motivo} onChangeText={setMotivo} />
            <TextInput style={styles.input} placeholder="Qual o valor alvo? (R$)" keyboardType="numeric" value={valorAlvo} onChangeText={setValorAlvo} />
            
            <TouchableOpacity style={styles.botaoAcao} onPress={handleCriarMeta}>
              <Text style={styles.botaoTextoBranco}>Criar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalCriar(false)}>
              <Text style={styles.botaoTextoSecundario}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalAcao} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Gerenciar Caixinha</Text>
            
            <Text style={styles.textoInstrucao}>Guardar mais dinheiro:</Text>
            <TextInput style={styles.input} placeholder="Valor do depósito (R$)" keyboardType="numeric" value={valorDeposito} onChangeText={setValorDeposito} />
            <TouchableOpacity style={styles.botaoAcao} onPress={handleDepositar}>
              <Text style={styles.botaoTextoBranco}>Depositar Valor</Text>
            </TouchableOpacity>

            <View style={styles.linhaDivisoria} />

            <Text style={styles.textoInstrucao}>Ou resgatar o valor (Apaga a meta):</Text>
            <TouchableOpacity style={styles.botaoPerigo} onPress={handleResgatarTudo}>
              <Text style={styles.botaoTextoBranco}>Resgatar Tudo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalAcao(false)}>
              <Text style={styles.botaoTextoSecundario}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa', padding: 20 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50' },
  textoVazio: { textAlign: 'center', color: '#95a5a6', marginTop: 20 },
  metaCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 3, marginBottom: 15 },
  metaNome: { fontSize: 18, fontWeight: 'bold', color: '#34495e' },
  metaMotivo: { fontSize: 13, color: '#7f8c8d', marginBottom: 10 },
  metaProgresso: { fontSize: 14, color: '#2c3e50', fontWeight: 'bold', marginBottom: 8 },
  barraFundo: { height: 10, backgroundColor: '#ecf0f1', borderRadius: 5, overflow: 'hidden' },
  barraFrente: { height: '100%', backgroundColor: '#9b59b6' }, 
  botaoPrincipal: { backgroundColor: '#1abc9c', padding: 15, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  botaoTextoBranco: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '85%', backgroundColor: '#fff', padding: 20, borderRadius: 12 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 12, marginBottom: 10, backgroundColor: '#fafafa' },
  botaoAcao: { backgroundColor: '#3498db', padding: 12, borderRadius: 6, alignItems: 'center', marginBottom: 10 },
  botaoPerigo: { backgroundColor: '#e74c3c', padding: 12, borderRadius: 6, alignItems: 'center', marginBottom: 10 },
  botaoCancelar: { padding: 12, alignItems: 'center', marginTop: 5 },
  botaoTextoSecundario: { color: '#7f8c8d', fontWeight: 'bold' },
  textoInstrucao: { fontSize: 14, color: '#34495e', marginBottom: 8, marginTop: 10 },
  linhaDivisoria: { height: 1, backgroundColor: '#eee', marginVertical: 15 }
});