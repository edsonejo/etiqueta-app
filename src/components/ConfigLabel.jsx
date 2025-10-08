import React from 'react';
import { 
    Section, FormControl, Input, Select, Button, 
    LabelGridContainer, LabelCell, LabelInner, 
    TwoColumnLayout 
} from './SharedStyles';

const FONT_OPTIONS = [
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Courier New, monospace', label: 'Courier New' },
    { value: 'Tahoma, sans-serif', label: 'Tahoma' },
];

const TEXT_ALIGN_OPTIONS = [
    { value: 'left', label: 'Esquerda' },
    { value: 'center', label: 'Centro' },
    { value: 'right', label: 'Direita' },
];

const ConfigLabel = ({ settings, setSettings, saveSettings }) => {
    const { label } = settings;

    // Função genérica para lidar com mudanças em campos numéricos ou de texto
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        
        // Converte para número se for um input numérico, caso contrário mantém a string
        const newValue = type === 'number' ? (parseFloat(value) >= 0 ? parseFloat(value) : 0) : value;

        setSettings(prev => ({
            ...prev,
            label: {
                ...prev.label,
                [name]: newValue
            }
        }));
    };

    const handleSave = () => {
        // Validação mínima
        if (label.labelWidth <= 0 || label.labelHeight <= 0) {
            alert('Largura e altura da etiqueta devem ser maiores que zero.');
            return;
        }
        saveSettings();
    };

    // Renderiza a grade de pré-visualização
    const renderPreviewGrid = () => {
        const { rows, cols, labelWidth, labelHeight } = label;
        
        // Limita a visualização a um máximo de 40 células para não sobrecarregar
        const maxCells = Math.min(rows * cols, 40);

        return (
            <LabelGridContainer $cols={cols}>
                {Array.from({ length: maxCells }).map((_, index) => {
                    const cellContent = index === 0 ? "Nome do Produto" : `Etiqueta ${index + 1}`;

                    return (
                        <LabelCell
                            key={index}
                            // Todas as props customizadas para Styled Components devem ter o prefixo '$'
                            $labelWidth={labelWidth}
                            $labelHeight={labelHeight}
                            $spacingH={label.spacingH}
                            $spacingV={label.spacingV}
                            $marginTop={label.marginTop}
                            $marginBottom={label.marginBottom}
                            $marginLeft={label.marginLeft}
                            $marginRight={label.marginRight}
                        >
                            <LabelInner>
                                {cellContent}
                            </LabelInner>
                        </LabelCell>
                    );
                })}
            </LabelGridContainer>
        );
    };

    return (
        <Section>
            <h2>1. Configurar Layout da Etiqueta e da Folha</h2>
            <p>Defina as dimensões da sua etiqueta e a formatação do texto para a impressão.</p>
            
            <TwoColumnLayout>
                {/* COLUNA 1: Dimensões e Formatação */}
                <div>
                    <h3>Dimensões da Etiqueta (mm)</h3>
                    <FormControl>
                        <label>Largura da Etiqueta (mm):</label>
                        <Input 
                            type="number" 
                            name="labelWidth" 
                            value={label.labelWidth} 
                            onChange={handleChange} 
                            min="1"
                        />
                    </FormControl>
                    <FormControl>
                        <label>Altura da Etiqueta (mm):</label>
                        <Input 
                            type="number" 
                            name="labelHeight" 
                            value={label.labelHeight} 
                            onChange={handleChange} 
                            min="1"
                        />
                    </FormControl>
                    
                    <h3>Espaçamento/Margens da Folha (mm)</h3>
                    <FormControl>
                        <label>Margem Superior (mm):</label>
                        <Input type="number" name="marginTop" value={label.marginTop} onChange={handleChange} min="0" />
                    </FormControl>
                    <FormControl>
                        <label>Espaçamento Horizontal (mm):</label>
                        <Input type="number" name="spacingH" value={label.spacingH} onChange={handleChange} min="0" />
                    </FormControl>
                    <FormControl>
                        <label>Espaçamento Vertical (mm):</label>
                        <Input type="number" name="spacingV" value={label.spacingV} onChange={handleChange} min="0" />
                    </FormControl>
                </div>

                {/* COLUNA 2: Grade e Texto */}
                <div>
                    <h3>Grade na Folha</h3>
                    <FormControl>
                        <label>Etiquetas por Linha (Colunas):</label>
                        <Input 
                            type="number" 
                            name="cols" 
                            value={label.cols} 
                            onChange={handleChange} 
                            min="1"
                        />
                    </FormControl>
                    <FormControl>
                        <label>Número total de Linhas:</label>
                        <Input 
                            type="number" 
                            name="rows" 
                            value={label.rows} 
                            onChange={handleChange} 
                            min="1"
                        />
                    </FormControl>

                    <h3>Formatação do Texto</h3>
                    <FormControl>
                        <label>Tamanho da Fonte (px):</label>
                        <Input type="number" name="fontSize" value={label.fontSize} onChange={handleChange} min="6" />
                    </FormControl>
                    <FormControl>
                        <label>Alinhamento:</label>
                        <Select name="textAlign" value={label.textAlign} onChange={handleChange}>
                            {TEXT_ALIGN_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <label>Estilo da Fonte:</label>
                        <Select name="fontStyle" value={label.fontStyle} onChange={handleChange}>
                            {FONT_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </TwoColumnLayout>
            
            <Button onClick={handleSave} style={{ marginTop: '20px' }}>
                Salvar Configurações Localmente
            </Button>
            
            {/* ÁREA DE PRÉ-VISUALIZAÇÃO */}
            <h3 style={{ marginTop: '30px' }}>Pré-visualização da Grade</h3>
            {renderPreviewGrid()}

        </Section>
    );
};

export default ConfigLabel;