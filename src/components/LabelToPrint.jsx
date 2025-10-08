import React from 'react';
import styled, { css } from 'styled-components';

// A Folha A4 em modo retrato é aproximadamente 210mm x 297mm
const A4Sheet = styled.div`
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  /* Margens de impressão dinâmicas */
  padding: ${props => `${props.$marginTop}mm ${props.$marginRight}mm ${props.$marginBottom}mm ${props.$marginLeft}mm`};
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start; 
  
  @media print {
    padding: ${props => `${props.$marginTop}mm ${props.$marginRight}mm ${props.$marginBottom}mm ${props.$marginLeft}mm`};
    margin: 0;
    box-shadow: none;
    overflow: hidden; 
    break-after: always; 
  }
`;

// O Estilo da Etiqueta Individual
const LabelStyle = styled.div`
  /* Estilo visual e dimensão */
  width: ${props => props.$labelWidth}px;
  height: ${props => props.$labelHeight}px;
  
  /* Margens de espaçamento entre etiquetas (em MM para impressão) */
  margin-right: ${props => props.$spacingH}mm;
  margin-bottom: ${props => props.$spacingV}mm;
  
  /* Centralização de conteúdo e Fonte */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${props => props.$textAlign === 'left' ? 'flex-start' : props.$textAlign === 'right' ? 'flex-end' : 'center'};
  text-align: ${props => props.$textAlign};
  
  /* Estilos de fonte */
  font-size: ${props => props.$fontSize}px;
  font-family: ${props => props.$fontStyle};
  
  /* Bordas e cor de fundo para VISUALIZAÇÃO */
  border: 1px dashed #aaa; 
  background-color: #f9f9f9;
  overflow: hidden; 
  padding: 2px;
  
  /* Sobrescreve para a impressão */
  @media print {
    width: ${props => props.$labelWidth}mm; /* Usa MM na impressão */
    height: ${props => props.$labelHeight}mm; /* Usa MM na impressão */
    border: none; 
    background-color: transparent;
    
    /* Regra para quebrar linhas para alinhar colunas */
    ${props => props.$cols > 1 && css`
      &:nth-child(${props => props.$cols}n) {
        margin-right: 0;
      }
    `}
  }
`;


const LabelToPrint = ({ labels, labelSettings }) => {
    if (!labels || labels.length === 0) {
        return <p style={{ textAlign: 'center', color: '#666' }}>Nenhuma etiqueta gerada. Busque um produto.</p>;
    }

    const { 
        cols, labelWidth, labelHeight, 
        marginTop, marginBottom, marginLeft, marginRight, 
        spacingH, spacingV, fontSize, textAlign, fontStyle 
    } = labelSettings;

    return (
        <A4Sheet
            $marginTop={marginTop}
            $marginBottom={marginBottom}
            $marginLeft={marginLeft}
            $marginRight={marginRight}
        >
            {/* Mapeamento de todas as etiquetas (repetidas pela quantidade) */}
            {labels.map((labelData, index) => (
                <LabelStyle 
                    key={index} 
                    $labelWidth={labelWidth}
                    $labelHeight={labelHeight}
                    $spacingH={spacingH}
                    $spacingV={spacingV}
                    $fontSize={fontSize}
                    $textAlign={textAlign}
                    $fontStyle={fontStyle}
                    $cols={cols} 
                >
                    {/* EXIBIÇÃO DOS DADOS DA ETIQUETA: */}
                    {labelData.productName && <div>**{labelData.productName}**</div>}
                    {labelData.price && <div>R$ {labelData.price}</div>}
                    {labelData.productCode && <small>Cod: {labelData.productCode}</small>}
                    
                    {/* ADICIONE AQUI OUTROS CAMPOS DA ETIQUETA SE NECESSÁRIO */}
                </LabelStyle>
            ))}
        </A4Sheet>
    );
};

export default LabelToPrint;