import React, { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import ConfigLabel from './components/ConfigLabel';
import ConfigAPI from './components/ConfigAPI';
import PrintArea from './components/PrintArea';
import { Container, TwoColumnLayout, Button } from './components/SharedStyles';

// Configurações iniciais padrão
const DEFAULT_SETTINGS = {
  // 1. Configurações de Layout
  label: {
    rows: 10,
    cols: 3,
    labelWidth: 60,   // em px (visualização)
    labelHeight: 25,  // em px (visualização)
    marginTop: 10,    // em mm (impressão)
    marginBottom: 10, // em mm (impressão)
    marginLeft: 10,   // em mm (impressão)
    marginRight: 10,  // em mm (impressão)
    spacingH: 0,      // em mm (impressão)
    spacingV: 0,      // em mm (impressão)
    fontSize: 10,     // em px
    textAlign: 'center',
    fontStyle: 'Arial, sans-serif',
  },
  // src/App.jsx - Dentro de const DEFAULT_SETTINGS -> api:

api: {
  url: 'https://cw.vendaerp.com.br', // URL base
  endpoint: '/api/request/Produtos/Get', 
  method: 'GET',
  requestParam: 'codigo', // Parâmetro de busca
  
  // HEADERS DE AUTENTICAÇÃO (CRUCIAIS PARA O TESTE!)
  authHeader: '9eeb1cb5e8f14d5673d5bcd4f5577c4b47a5d0a0e29454fdf8fc9308e5ff8c554c57a428261dd654314ee33fe84c37d3b6b1be380652b674b444df1263b14af634aca377cad75d8848848ff6870b077db1f0e5eb9e962a8962ae19bb76caed185f7c32fa8f3f59cc1c3dd25130c60f06810fcc14f785e5958d6cafb8f04f5451',
  userHeader: 'krokodillo@domaniweb.com.br',
  appHeader: 'Buscapreco',
  
  // Mapeamento (para o teste de geração de etiqueta)
  fieldMapping: {
    productName: 'Records.0.descricao', 
    price: 'Records.0.preco_venda',        
  },
},
// ...
};

const App = () => {
  // Estado principal que persiste no localStorage
  const [settings, setSettings] = useLocalStorage('label-config', DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState('configLabel'); // Controle de abas

  // Função que é chamada pelos botões "Salvar"
  const saveSettings = () => {
    // A persistência já é feita pelo useLocalStorage, esta função apenas confirma
    alert('Configurações salvas no armazenamento local do navegador!');
  };

  return (
    <Container>
      <h1>🏷️ Impressão de Etiquetas Personalizadas</h1>

      {/* Navegação por Abas */}
      <div style={{ marginBottom: '20px' }}>
        <Button onClick={() => setActiveTab('configLabel')} style={{backgroundColor: activeTab === 'configLabel' ? '#007bff' : '#6c757d'}}>
          1. Configurar Layout
        </Button>
        <Button onClick={() => setActiveTab('configAPI')} style={{marginLeft: '10px', backgroundColor: activeTab === 'configAPI' ? '#007bff' : '#6c757d'}}>
          2. Configurar API
        </Button>
        <Button onClick={() => setActiveTab('printArea')} style={{marginLeft: '10px', backgroundColor: activeTab === 'printArea' ? '#28a745' : '#6c757d'}}>
          3. Imprimir
        </Button>
      </div>
      
      <TwoColumnLayout>
        {/* Renderiza o componente de configuração ativo em uma coluna (ou duas na aba de impressão) */}
        <div style={{gridColumn: 'span 2'}}>
          {activeTab === 'configLabel' && (
            <ConfigLabel 
              settings={settings} 
              setSettings={setSettings} 
              saveSettings={saveSettings} 
            />
          )}

          {activeTab === 'configAPI' && (
            <ConfigAPI 
              settings={settings} 
              setSettings={setSettings} 
              saveSettings={saveSettings} 
            />
          )}
        
          {activeTab === 'printArea' && (
            <PrintArea 
                apiSettings={settings.api} 
                labelSettings={settings.label} 
            />
          )}
        </div>
      </TwoColumnLayout>
      
    </Container>
  );
};

export default App;