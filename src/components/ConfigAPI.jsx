import React, { useState } from 'react';
import axios from 'axios';
import { 
    Section, FormControl, Input, Select, Button, 
    DataSection, APIPreviewArea, Alert, StyledTable 
} from './SharedStyles';

// Função utilitária para buscar valores aninhados no JSON
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : null, obj);
};

const ConfigAPI = ({ settings, setSettings, saveSettings }) => {
    const { api } = settings;
    const [testResult, setTestResult] = useState({ status: 'info', message: 'Aguardando teste de conexão.' });
    const [apiResponse, setApiResponse] = useState(null);
    const [testProductCode, setTestProductCode] = useState('5808'); 
    const [showWarning, setShowWarning] = useState(true);

    // Função genérica para lidar com mudanças nos campos da API
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            api: {
                ...prev.api,
                [name]: value
            }
        }));
    };

    // Função que testa a conexão com a API
    const handleTestConnection = async () => {
        setTestResult({ status: 'info', message: 'Testando conexão...' });
        setApiResponse(null);

        const { 
            url, endpoint, method, requestParam, 
            authHeader, userHeader, appHeader 
        } = api;

        const finalUrl = `${url}${endpoint}?${requestParam}=${testProductCode}`;
        const httpMethod = method.toUpperCase();
        
        const config = { 
            method: httpMethod, 
            url: finalUrl,
            // CORREÇÃO CRUCIAL: Força o envio dos headers customizados
            transformRequest: [(data, headers) => {
                headers['Content-Type'] = 'application/json'; 
                return data;
            }],
            // Headers de autenticação (revertidos para o nome EXATO do cURL)
            headers: {
                'Authorization-Token': authHeader, 
                'User': userHeader,                   
                'App': appHeader,                     
            }
        };

        try {
            const response = await axios(config);
            setApiResponse(response.data);
            setTestResult({ 
                status: 'success', 
                message: `Conexão bem-sucedida! Status: ${response.status}. Dados de exemplo carregados.` 
            });
            setShowWarning(false);

        } catch (error) {
            console.error("Erro ao testar a API:", error);
            const status = error.response ? error.response.status : 'N/A';
            
            const message = error.response 
                ? `Erro: Request failed with status code ${status}. Se for 403, o token pode ter expirado ou o CORS está bloqueado.`
                : `Erro de rede: ${error.message}. Verifique a URL e a conexão.`;
                
            setTestResult({ 
                status: 'error', 
                message: message 
            });
        }
    };
    
    // Função para adicionar um novo campo de mapeamento
    const handleAddField = () => {
        setSettings(prev => ({
            ...prev,
            api: {
                ...prev.api,
                fieldMapping: {
                    ...prev.api.fieldMapping,
                    [`novoCampo${Object.keys(prev.api.fieldMapping).length + 1}`]: ''
                }
            }
        }));
    };

    // Função para remover um campo de mapeamento
    const handleRemoveField = (fieldName) => {
        const newMapping = { ...api.fieldMapping };
        delete newMapping[fieldName];
        setSettings(prev => ({
            ...prev,
            api: {
                ...prev.api,
                fieldMapping: newMapping
            }
        }));
    };

    return (
        <Section>
            <h2>2. Configurar API de Dados</h2>
            <p>Configure a URL, os Headers de Autenticação e o mapeamento dos campos da etiqueta para os dados da API.</p>
            
            {/* Aviso sobre os Headers estarem no App.jsx */}
            {showWarning && (
                <Alert $type="info">
                    <strong>Importante:</strong> O Token de Autorização (`Authorization-Token`, `User`, `App`) está fixo no arquivo **`src/App.jsx`**. Você deve atualizar esses valores lá para garantir a conexão.
                </Alert>
            )}

            <FormControl>
                <label>URL Base da API (Ex: https://cw.vendaerp.com.br)</label>
                <Input type="text" name="url" value={api.url} onChange={handleChange} />
            </FormControl>
            <FormControl>
                <label>Endpoint (Ex: /api/request/Produtos/Get)</label>
                <Input type="text" name="endpoint" value={api.endpoint} onChange={handleChange} />
            </FormControl>
            <FormControl>
                <label>Parâmetro de Requisição (Ex: codigo)</label>
                <Input type="text" name="requestParam" value={api.requestParam} onChange={handleChange} />
            </FormControl>
            
            <Button onClick={saveSettings} style={{ backgroundColor: '#28a745' }}>
                Salvar Configurações Localmente
            </Button>
            
            {/* Área de Teste de Conexão */}
            <DataSection>
                <h3>Teste de Conexão</h3>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <FormControl style={{ flexGrow: 1, marginBottom: 0 }}>
                        <label>Código de Produto para Teste (Ex: 5808)</label>
                        <Input 
                            type="text" 
                            value={testProductCode} 
                            onChange={(e) => setTestProductCode(e.target.value)} 
                            style={{ marginBottom: 0 }}
                        />
                    </FormControl>
                    <Button onClick={handleTestConnection} style={{ alignSelf: 'flex-end' }}>
                        Testar Conexão e Dados
                    </Button>
                </div>
                
                {testResult.message && (
                    <Alert $type={testResult.status} style={{ marginTop: '15px' }}>
                        {testResult.message}
                    </Alert>
                )}
                
                {apiResponse && (
                    <>
                        <h4 style={{ marginTop: '20px' }}>Dados de Exemplo Recebidos (JSON)</h4>
                        <APIPreviewArea>
                            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                        </APIPreviewArea>
                    </>
                )}
            </DataSection>

            {/* Mapeamento de Campos */}
            <DataSection>
                <h3>Mapeamento de Campos</h3>
                <p>Mapeie o nome do campo da etiqueta (esquerda) para o caminho do campo no JSON da API (direita).</p>
                <StyledTable>
                    <thead>
                        <tr>
                            <th>Campo da Etiqueta</th>
                            <th>Caminho no JSON (Ex: Records.0.descricao)</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(api.fieldMapping).map(([labelField, apiPath]) => (
                            <tr key={labelField}>
                                <td>{labelField}</td>
                                <td>
                                    <Input 
                                        type="text" 
                                        value={apiPath} 
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            api: {
                                                ...prev.api,
                                                fieldMapping: {
                                                    ...prev.api.fieldMapping,
                                                    [labelField]: e.target.value
                                                }
                                            }
                                        }))}
                                    />
                                </td>
                                <td>
                                    {/* Não permite remover campos essenciais */}
                                    {labelField !== 'productName' && labelField !== 'price' ? (
                                        <Button 
                                            onClick={() => handleRemoveField(labelField)} 
                                            style={{ backgroundColor: '#dc3545', padding: '5px 10px' }}
                                        >
                                            Remover
                                        </Button>
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </StyledTable>
                <Button onClick={handleAddField} style={{ marginTop: '10px', backgroundColor: '#6c757d' }}>
                    Adicionar Novo Campo
                </Button>
            </DataSection>
        </Section>
    );
};

export default ConfigAPI;