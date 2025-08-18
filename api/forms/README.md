# API de Formulários - Team Travagli

Sistema completo para alunos responderem formulários criados pelo coach.

## 🚀 Endpoints Criados

### 1. Buscar Formulário Específico
```
GET /api/forms/[formId]?userId=[userId]
```

**Parâmetros:**
- `formId`: ID do formulário (FormTemplate)
- `userId`: ID do usuário (query parameter)

**Retorna:**
- Dados completos do formulário (perguntas, opções)
- Informações do usuário
- Status se já foi respondido

### 2. Enviar Resposta do Formulário
```
POST /api/forms/[formId]/submit
```

**Body:**
```json
{
  "userId": "user_id_here",
  "answers": [
    {
      "questionId": "question_id_here",
      "textAnswer": "resposta texto" // Para TEXT, NUMBER, DATE, IMAGE
    },
    {
      "questionId": "question_id_here", 
      "selectedOptions": ["option_id_1", "option_id_2"] // Para CHOICE
    }
  ]
}
```

### 3. Listar Formulários do Usuário
```
GET /api/forms/user/[userId]
```

**Retorna:**
- Lista de todos os formulários disponíveis
- Status de cada um (completed/pending)
- URLs diretas para responder

## 🎯 Página do Formulário

### URL Pattern
```
/form/[formId]/user/[userId]
```

### Exemplo de URL
```
https://sua-landing.vercel.app/form/clm123abc456/user/cln789def012
```

## ✅ Funcionalidades Implementadas

### 🔐 Segurança
- ✅ Verificação de usuário válido
- ✅ Verificação de assinatura ativa
- ✅ Validação de formulário ativo
- ✅ Prevenção de múltiplas respostas

### 📝 Tipos de Pergunta Suportados
- ✅ **TEXT**: Texto curto e longo (textarea)
- ✅ **NUMBER**: Campos numéricos
- ✅ **DATE**: Seletor de data
- ✅ **SINGLE_CHOICE**: Radio buttons
- ✅ **MULTIPLE_CHOICE**: Checkboxes
- ✅ **IMAGE**: URL de imagem

### 🎨 Interface do Usuário
- ✅ Design responsivo com Tailwind
- ✅ Validação em tempo real
- ✅ Estados de loading/erro/sucesso
- ✅ Suporte a vídeo explicativo
- ✅ Perguntas obrigatórias marcadas
- ✅ Navegação intuitiva

### 🔍 Validações
- ✅ Campos obrigatórios
- ✅ Tipos de dados corretos
- ✅ Opções válidas para escolha múltipla
- ✅ Single choice (apenas uma opção)
- ✅ Limites de caracteres

## 🧪 Como Testar

### 1. Criar Formulário no Banco
Primeiro, você precisa ter um FormTemplate criado no banco com perguntas. Exemplo usando Prisma Studio ou SQL direto.

### 2. Usar URLs de Teste
```
http://localhost:3000/form/SEU_FORM_ID/user/SEU_USER_ID
```

### 3. Testar APIs Diretamente
```bash
# Buscar formulário
curl "http://localhost:3000/api/forms/FORM_ID?userId=USER_ID"

# Listar formulários do usuário
curl "http://localhost:3000/api/forms/user/USER_ID"

# Enviar resposta
curl -X POST "http://localhost:3000/api/forms/FORM_ID/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "answers": [
      {
        "questionId": "QUESTION_ID",
        "textAnswer": "Minha resposta"
      }
    ]
  }'
```

## 🔗 Integração com Sistema Existente

### Como o Coach pode enviar links
1. Acessar dashboard admin (a ser criado)
2. Gerar link personalizado: `/form/{formId}/user/{userId}`
3. Enviar por WhatsApp/Email para o aluno

### Dados salvos no Banco
- `FormResponse`: Uma por formulário respondido
- `QuestionAnswer`: Uma por pergunta respondida
- `QuestionAnswerOption`: Para respostas de múltipla escolha

## 🚀 Próximos Passos Sugeridos

1. **Dashboard Admin** - Para o coach gerenciar formulários
2. **Dashboard Aluno** - Lista de formulários disponíveis
3. **Notificações** - Email/WhatsApp quando formulário for respondido
4. **Relatórios** - Análise das respostas
5. **Templates** - Formulários pré-definidos (anamnese, progresso, etc.)

## 🐛 Tratamento de Erros

- ❌ Usuário não encontrado
- ❌ Assinatura inativa
- ❌ Formulário não encontrado/inativo
- ❌ Formulário já respondido
- ❌ Validação de campos obrigatórios
- ❌ Opções inválidas selecionadas

Todos os erros retornam mensagens claras em português para o usuário final.
