import React, { useState, useRef, useMemo } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { 
    Button, Input, Section, ErrorMessage, DataSection, APIPreviewArea 
} from './SharedStyles';
import LabelToPrint from './LabelToPrint';

// Função utilitária para buscar valores aninhados no JSON
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : null, obj);
};

const PrintArea = ({ apiSettings, labelSettings }) => {
    const [productCode, setProductCode] = useState('5808'); 
    const [status, setStatus] = useState({ loading: false, error: null });
    const [labelData, setLabelData] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const [quantity, setQuantity] = useState(1); 

    const componentRef = useRef();

    // Função que faz a requisição à API
    const fetchProductData = async () => {
        if (!productCode) {
            setStatus({ loading: false, error: 'Por favor, insira um código de produto.' });
            return;
        }
        
        setStatus({ loading: true, error: null });
        setLabelData(null);

        const { 
            url, endpoint, method, fieldMapping, requestParam,
            authHeader, userHeader, appHeader
        } = apiSettings;

        const finalUrl = `${url}${endpoint}?${requestParam}=${productCode}`;
        const httpMethod = method.toUpperCase();
        
        const config = { 
            method: httpMethod, 
            url: finalUrl,
            // CORREÇÃO CRUCIAL: Força o envio dos headers customizados (resolve 403 em alguns navegadores)
            transformRequest: [(data, headers) => {
                headers['Content-Type'] = 'application/json'; 
                return data;
            }],
            // Headers de autenticação
            headers: {
                'Authorization-Token': authHeader,
                'User': userHeader,
                'App': appHeader,
            }
        };

        try {
            const response = await axios(config);
            const apiResponseData = response.data;
            setApiResponse(apiResponseData); 

            // Mapeia os campos da API para os campos da etiqueta
            const mappedData = {};
            mappedData.productCode = productCode; 
            
            Object.keys(fieldMapping).forEach(labelField => {
                const apiPath = fieldMapping[labelField];
                mappedData[labelField] = getNestedValue(apiResponseData, apiPath);
            });
            
            setLabelData(mappedData); 
            setStatus({ loading: false, error: null });

        } catch (error) {
            console.error("Erro ao buscar dados da API:", error);
            const status = error.response ? error.response.status : 'N/A';
            
            setStatus({ 
                loading: false, 
                error: `Erro ao buscar: ${error.message}. Status: ${status}. 
                        Se for 403, o token de autenticação pode ter expirado ou o CORS está bloqueado.` 
            });
            setLabelData(null);
            setApiResponse(null);
        }
    };

    // Gera o array de etiquetas repetidas (usado na pré-visualização e impressão)
    const generateLabels = useMemo(() => {
        if (!labelData) return [];

        const labels = [];
        for (let i = 0; i < quantity; i++) {
            labels.push(labelData);
        }
        return labels;
    }, [labelData, quantity]);

    // Configuração do hook de impressão
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: '@page { size: A4; margin: 0; }'
    });
    
    return (
        <Section>
            <h2>3. Área de Impressão</h2>
            <p>Insira o código do produto e a quantidade de etiquetas desejada para gerar a impressão.</p>

            {/* CONTROLES DE BUSCA E QUANTIDADE */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', marginBottom: '20px' }}>
                <div>
                    <label>Código do Produto:</label>
                    <Input 
                        type="text"
                        value={productCode}
                        onChange={(e) => setProductCode(e.target.value)}
                        placeholder="Ex: 5808"
                    />
                </div>
                {/* CAMPO DE QUANTIDADE */}
                <div>
                    <label>Quantidade de Etiquetas:</label>
                    <Input 
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
                        min="1"
                        placeholder="1"
                        style={{ width: '100px' }}
                    />
                </div>
                {/* BOTÃO DE BUSCA/GERAÇÃO */}
                <Button 
                    onClick={fetchProductData} 
                    disabled={status.loading}
                    style={{ minWidth: '150px' }}
                >
                    {status.loading ? 'Buscando...' : 'Buscar e Gerar Etiqueta(s)'}
                </Button>
            </div>
            
            {status.error && <ErrorMessage>{status.error}</ErrorMessage>}

            {/* PRÉ-VISUALIZAÇÃO DE DADOS */}
            <DataSection>
                <h3>Pré-visualização de Dados Recebidos (API)</h3>
                <APIPreviewArea>
                    <pre>{apiResponse ? JSON.stringify(apiResponse, null, 2) : 'Busque um código de produto para ver o JSON de resposta.'}</pre>
                </APIPreviewArea>
            </DataSection>

            {/* ÁREA DE PRÉ-VISUALIZAÇÃO DE IMPRESSÃO */}
            <h3>Pré-visualização de Impressão ({generateLabels.length} etiquetas geradas)</h3>

            {labelData && (
                <div style={{ marginBottom: '20px' }}>
                    <Button onClick={handlePrint} style={{ backgroundColor: '#dc3545' }}>
                        Imprimir Diretamente
                    </Button>
                </div>
            )}

            <div style={{ padding: '10px', border: '1px solid #ccc', backgroundColor: '#fff' }}>
                <div ref={componentRef}>
                    <LabelToPrint 
                        labels={generateLabels} 
                        labelSettings={labelSettings} 
                    />
                </div>
            </div>
        </Section>
    );
};

export default PrintArea;