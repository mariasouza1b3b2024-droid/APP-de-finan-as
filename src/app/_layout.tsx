import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { FinanceProvider } from '../../src/context/FinanceContext';

export default function TabLayout() {
  return (
    // Envolvemos as abas com o Provider para compartilhar os dados!
    <FinanceProvider>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: '#1abc9c' },
          headerTintColor: '#fff',
          tabBarStyle: { backgroundColor: '#fff', height: 60 },
          tabBarActiveTintColor: '#1abc9c',
          tabBarInactiveTintColor: '#95a5a6',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Aplicativo Finanças', // Título no Topo
            tabBarLabel: 'Home', // <-- Isso resolve o erro do texto esquisito na casinha!
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: 'Extrato',
            tabBarLabel: 'Extrato',
            tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
          }}
        />

        <Tabs.Screen
          name="metas"
          options={{
            title: 'Metas',
            tabBarLabel: 'Metas',
            tabBarIcon: ({ color }) => <Ionicons name="flag" size={24} color={color} />,
          }}
        />
      </Tabs>
    </FinanceProvider>
  );
}