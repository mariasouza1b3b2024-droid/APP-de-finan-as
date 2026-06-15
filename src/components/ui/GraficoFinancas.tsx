import { StyleSheet, Text, View } from 'react-native';

// FUNCIONALIDADE: Agora o gráfico pede o "saldoDisponivel" em vez de todas as receitas
interface GraficoProps {
  saldoDisponivel: number;
  totalDespesas: number;
}

export function GraficoFinancas({ saldoDisponivel, totalDespesas }: GraficoProps) {
  // CÓDIGO: O "total que entrou" é a soma do que você ainda tem + o que você já gastou.
  // Isso representa 100% da sua barra para a matemática funcionar perfeitamente.
  const totalEntrou = saldoDisponivel + totalDespesas;
  
  // CÓDIGO: Calcula a porcentagem. Se o saldo ficar negativo (gastou mais do que tem), a barra zera (Math.max evita quebrar).
  const pctSaldo = totalEntrou > 0 ? Math.max(0, Math.min((saldoDisponivel / totalEntrou) * 100, 100)) : 0;
  const pctDespesas = totalEntrou > 0 ? Math.min((totalDespesas / totalEntrou) * 100, 100) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Resumo da Carteira</Text>
      
      <View style={styles.graficoContainer}>
        
        {/* CÓDIGO: Barra de Saldo (A antiga barra de Receita) */}
        <View style={styles.colunaContainer}>
          <View style={styles.caixaLimite}>
            <View style={[styles.barraReceita, { height: `${pctSaldo}%` }]} />
          </View>
          <Text style={styles.legendaBarra}>Saldo</Text>
          {/* Mostra o valor do Saldo. Se for negativo, mostra com o sinal de menos bonitinho */}
          <Text style={[styles.valorBarra, saldoDisponivel < 0 && { color: '#e74c3c' }]}>
            R$ {saldoDisponivel.toFixed(2)}
          </Text>
        </View>

        {/* CÓDIGO: Barra de Despesas (O quanto do seu dinheiro foi consumido) */}
        <View style={styles.colunaContainer}>
          <View style={styles.caixaLimite}>
            <View style={[styles.barraDespesa, { height: `${pctDespesas}%` }]} />
          </View>
          <Text style={styles.legendaBarra}>Gastos</Text>
          <Text style={styles.valorBarra}>R$ {totalDespesas.toFixed(2)}</Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginVertical: 10, elevation: 2 },
  titulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  graficoContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingTop: 10 },
  colunaContainer: { alignItems: 'center', width: '40%' },
  caixaLimite: { height: 100, width: 40, justifyContent: 'flex-end' }, 
  barraReceita: { width: '100%', backgroundColor: '#2ecc71', borderRadius: 4 },
  barraDespesa: { width: '100%', backgroundColor: '#e74c3c', borderRadius: 4 },
  legendaBarra: { fontSize: 14, fontWeight: '600', marginTop: 8, color: '#555' },
  valorBarra: { fontSize: 12, color: '#888', marginTop: 2 },
});