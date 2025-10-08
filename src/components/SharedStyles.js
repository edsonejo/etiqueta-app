import styled from 'styled-components';

// 1. Layout Principal
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
  min-height: 100vh;
`;

export const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

// 2. Componentes de Formulário e Interação
export const Section = styled.section`
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 20px;
  background-color: #ffffff;
`;

export const FormControl = styled.div`
  margin-bottom: 15px;
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 14px;
  }
`;

export const Button = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

// 3. Visualização de Dados e Erros
export const DataSection = styled.div`
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #ffffff;
`;

export const APIPreviewArea = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 15px;
  max-height: 200px;
  overflow-y: auto;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const ErrorMessage = styled.div`
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 15px;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 14px;
  th, td {
    border: 1px solid #dee2e6;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #e9ecef;
  }
`;

// 4. Estilos Específicos da Grade de Etiquetas (usados em ConfigLabel)
export const LabelGridContainer = styled.div`
  display: grid;
  /* Esta configuração será sobrescrita pela propriedade CSS $cols do React */
  grid-template-columns: repeat(3, 1fr); 
  gap: 1px;
  border: 1px solid #ccc;
  width: fit-content;
  max-width: 100%;
`;

export const LabelCell = styled.div`
  /* Largura e altura serão sobrescritas pelas props $labelWidth/$labelHeight */
  width: 50px; 
  height: 20px; 
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #ddd;
  background-color: #f9f9f9;
  font-size: 10px;
  overflow: hidden;
  box-sizing: border-box;
  text-align: center;
`;
// src/components/SharedStyles.js

// ... (Outros componentes)

// Componente para agrupar a pré-visualização da grade na aba ConfigLabel
export const PreviewContainer = styled.div`
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background-color: #f9f9f9;
  overflow-x: auto; /* Permite rolar horizontalmente se a grade for muito grande */
  max-width: 100%;
`;

// ... (Restante dos componentes como LabelGridContainer, LabelCell, LabelInner)
// src/components/SharedStyles.js

// ... (Outros componentes como ErrorMessage, DataSection, etc.)

// Componente de Alerta para mensagens de sucesso/aviso
export const Alert = styled.div`
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
  
  /* Estilo padrão: Sucesso */
  background-color: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
  
  /* Permite mudar o tipo de alerta via props */
  ${props => props.$type === 'error' && `
    background-color: #f8d7da;
    color: #721c24;
    border-color: #f5c6cb;
  `}
  
  ${props => props.$type === 'info' && `
    background-color: #d1ecf1;
    color: #0c5460;
    border-color: #bee5eb;
  `}
`;

// ... (APIPreviewArea e outros componentes)
export const LabelInner = styled.div`
  font-size: 10px;
  color: #6c757d;
`;