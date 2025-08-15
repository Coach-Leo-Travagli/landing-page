# Templates de Email - Team Travagli

Este diretório contém templates reutilizáveis para todos os emails transacionais da aplicação.

## 📁 Estrutura dos Arquivos

```
emails/
├── email-styles.css           # CSS base com todos os estilos
├── base-template.html         # Template HTML base
├── components/                # Componentes reutilizáveis
│   ├── info-box.html         # Caixas de informação
│   ├── cta-buttons.html      # Botões de call-to-action
│   ├── benefits-section.html # Seção de benefícios
│   └── plan-comparison.html  # Comparação de planos
├── templates/                # Exemplos de uso
│   └── subscription-change-example.html
└── README.md                 # Este arquivo
```

## 🎨 Estilos Disponíveis

### Tipos de Header
- `header` (padrão - azul)
- `header success` (verde)
- `header upgrade` (verde)
- `header downgrade` (laranja)
- `header warning` (laranja)
- `header danger` (vermelho)

### Tipos de Info Box
- `info-box primary` (azul)
- `info-box success` (verde)
- `info-box warning` (laranja)
- `info-box danger` (vermelho)
- `info-box neutral` (cinza)

### Tipos de CTA Button
- `cta-button` (azul padrão)
- `cta-button secondary` (cinza)
- `cta-button success` (verde)
- `cta-button warning` (laranja)
- `cta-button danger` (vermelho)

## 🔧 Correção do Problema dos Botões

O problema do texto azul nos botões foi corrigido com:

```css
.cta-button {
    color: white !important;
    text-decoration: none !important;
}

.cta-button:hover,
.cta-button:visited,
.cta-button:active,
.cta-button:focus {
    color: white !important;
    text-decoration: none !important;
}
```

## 🚀 Como Usar

### 1. Usando o CSS Base

Inclua o CSS inline no `<style>` do email:

```html
<style>
    /* Cole aqui o conteúdo de email-styles.css */
</style>
```

### 2. Estrutura Base do Email

```html
<div class="email-container">
    <div class="header upgrade">
        <img src="{{companyLogoUrl}}" alt="{{companyName}} Logo" class="logo">
        <h1>
            <span class="header-icon">🔄</span>
            Título do Email
        </h1>
    </div>
    
    <div class="content">
        <h2>Olá, {{customerName}}!</h2>
        
        <!-- Conteúdo aqui -->
        
        <div class="cta-section">
            <a href="#" class="cta-button">Botão Principal</a>
            <a href="#" class="cta-button secondary">Botão Secundário</a>
        </div>
        
        <p style="margin-top: 30px;">
            <strong>Assinatura,<br>Equipe {{companyName}} 💪</strong>
        </p>
    </div>
    
    <div class="footer">
        <!-- Footer padrão -->
    </div>
</div>
```

### 3. Componentes

#### Info Box
```html
<div class="info-box success">
    <h3>🎉 Título da Caixa</h3>
    <div class="detail-item">
        <span class="detail-label">Label:</span>
        <span class="detail-value">Valor</span>
    </div>
</div>
```

#### Seção de Benefícios
```html
<div class="benefits success">
    <h3>✨ Seus Benefícios</h3>
    <ul>
        <li>Benefício 1</li>
        <li>Benefício 2</li>
        <li>Benefício 3</li>
    </ul>
</div>
```

#### Comparação de Planos
```html
<div class="change-details">
    <div class="plan-box new upgrade">
        <div class="plan-name">Novo Plano</div>
        <div class="plan-name">{{newPlan}}</div>
        <div class="plan-price">R$ {{newAmount}}</div>
    </div>
</div>
```

## 📱 Responsividade

Os templates são totalmente responsivos e se adaptam automaticamente para dispositivos móveis:

- Fonte e espaçamentos ajustados
- Botões tornam-se em bloco
- Grid de comparação vira vertical
- Headers e conteúdo com padding reduzido

## 🎯 Variáveis Disponíveis

### Globais
- `{{companyName}}` - Nome da empresa
- `{{companyLogoUrl}}` - URL do logo
- `{{customerName}}` - Nome do cliente
- `{{customerEmail}}` - Email do cliente

### Específicas por Tipo
- `{{changeType}}` - upgrade/downgrade/modification
- `{{newPlan}}` - Nome do novo plano
- `{{previousPlan}}` - Nome do plano anterior
- `{{newAmount}}` - Valor do novo plano
- `{{previousAmount}}` - Valor do plano anterior
- `{{effectiveDate}}` - Data de efetivação
- `{{canceledAt}}` - Data de cancelamento
- `{{planName}}` - Nome do plano

## 📝 Exemplos de Uso

Veja o arquivo `templates/subscription-change-example.html` para um exemplo completo de como implementar um email de mudança de assinatura usando esses templates.

## 🔍 Dicas Importantes

1. **CSS Inline**: Para máxima compatibilidade, sempre use CSS inline
2. **Cores Consistentes**: Use as classes predefinidas para manter consistência visual
3. **Responsividade**: Teste sempre em dispositivos móveis
4. **Acessibilidade**: Mantenha contraste adequado e textos alternativos
5. **Testes**: Teste em diferentes clientes de email (Gmail, Outlook, etc.)

## 🐛 Solução de Problemas

### Botões com texto azul
✅ **Solucionado** - Use as classes `.cta-button` com `!important` no CSS

### Imagens não carregam
- Verifique se as URLs estão absolutas
- Teste com imagens hospedadas externamente

### Layout quebrado no Outlook
- Use tabelas para layouts complexos se necessário
- Evite CSS avançado em clientes mais antigos
