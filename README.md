# CRM + Financeiro

Sistema unificado de CRM Kanban e Controle Financeiro.  
Stack: **React 18 + TypeScript + Vite + Tailwind + shadcn/ui + Supabase**

---

## ⚡ Instalação rápida

```bash
# 1. Entre na pasta do projeto
cd crm-financeiro

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
cp .env.example .env
# Abra o .env e preencha VITE_SUPABASE_FIN_URL e VITE_SUPABASE_FIN_ANON_KEY
# (as variáveis do CRM já vêm preenchidas)

# 4. Rode o projeto
npm run dev
```

Acesse: **http://localhost:8080**

---

## 📁 Estrutura

```
src/
├── components/
│   ├── ui/              ← shadcn/ui (não editar manualmente)
│   ├── kanban/          ← componentes do CRM Kanban
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── KanbanCard.tsx
│   │   └── ClienteModal.tsx
│   └── ...              ← componentes do Financeiro (Lovable)
├── pages/
│   ├── Kanban.tsx       ← /kanban
│   ├── Dashboard.tsx    ← / (financeiro)
│   └── ...
├── hooks/
│   ├── useKanban.ts     ← estado do CRM
│   └── useClients.ts    ← estado do Financeiro
├── services/
│   ├── kanbanService.ts    ← CRUD clientes CRM
│   └── historicoService.ts ← CRUD histórico CRM
├── lib/
│   ├── supabaseCRM.ts      ← client Supabase CRM
│   ├── supabaseFinanceiro.ts ← client Supabase Financeiro
│   ├── formatters.ts       ← datas e utilitários
│   └── utils.ts            ← cn() do shadcn
└── types/
    └── kanban.ts           ← tipos TypeScript do CRM
```

---

## 🗺️ Rotas

| Rota | Página |
|---|---|
| `/` | Dashboard Financeiro |
| `/kanban` | CRM Kanban |
| `/cadastro` | Cadastro de Clientes (Financeiro) |
| `/perfil` | Perfil do usuário |
| `/configuracoes` | Configurações |
| `/auth` | Login / Registro |

---

## 🔒 Autenticação

A autenticação via Supabase Auth está preparada no `AuthContext` e no `ProtectedRoute`.  
Será integrada em etapa futura junto ao módulo Financeiro.

---

## 🌿 Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_CRM_URL` | URL do projeto Supabase do CRM |
| `VITE_SUPABASE_CRM_ANON_KEY` | Anon key do CRM |
| `VITE_SUPABASE_FIN_URL` | URL do projeto Supabase Financeiro |
| `VITE_SUPABASE_FIN_ANON_KEY` | Anon key do Financeiro |

