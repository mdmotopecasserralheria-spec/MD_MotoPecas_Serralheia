# MD Moto Peças + Serralheria — Site Institucional

> Site completo com IA multi-agente, vitrine de anúncios, dashboard para o cliente e SEO de alta performance.

---

## 🚀 Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **IA:** Groq (llama-3.3-70b-versatile) — 4 agentes especializados
- **Banco:** Supabase (PostgreSQL)
- **Deploy:** Vercel (região São Paulo - gru1)
- **CI/CD:** GitHub → Vercel automático

---

## 📁 Estrutura do projeto

```
md-moto-pecas/
├── src/
│   ├── app/
│   │   ├── page.tsx              → Home
│   │   ├── catalogo/page.tsx     → Catálogo de peças
│   │   ├── serralheria/page.tsx  → Página da serralheria
│   │   ├── vitrine/page.tsx      → Vitrine pública de anúncios
│   │   ├── contato/page.tsx      → Contato e localização
│   │   ├── dashboard/page.tsx    → Painel do cliente
│   │   ├── api/
│   │   │   ├── ping/route.ts    → Keep-alive (evita pause do Supabase)
│   │   │   ├── chat/route.ts     → Orquestrador + agentes IA
│   │   │   ├── anuncios/route.ts → CRUD de anúncios
│   │   │   └── auth/route.ts     → Auth do dashboard
│   │   ├── sitemap.ts            → SEO automático
│   │   └── robots.ts             → SEO robots
│   ├── components/
│   │   ├── layout/               → Navbar, Footer, Hero, etc.
│   │   ├── chat/ChatWidget.tsx   → Widget de IA flutuante
│   │   └── ui/WhatsAppFloat.tsx  → Botão WhatsApp
│   └── lib/
│       ├── agentes.ts            → Orquestrador + 4 agentes IA
│       ├── rate-limit.ts         → Rate limiter (in-memory)
│       └── supabase.ts           → Client Supabase
├── supabase-schema.sql           → Execute no Supabase primeiro!
├── vercel.json                   → Config deploy
├── .env.local.example            → Variáveis de ambiente
└── .github/
    └── workflows/
        └── supabase-keepalive.yml → Cron job keep-alive (GitHub Actions)
```

---

## ⚙️ Configuração inicial

### 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o conteúdo de `supabase-schema.sql`
3. Copie a URL e as chaves do projeto

### 2. Groq

1. Crie conta em [console.groq.com](https://console.groq.com)
2. Crie uma API Key

### 3. Variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha:

```bash
cp .env.local.example .env.local
```

```env
GROQ_API_KEY=gsk_...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DASHBOARD_SECRET=senha_do_cliente_aqui
NEXT_PUBLIC_WHATSAPP_PECAS=5562999999999
NEXT_PUBLIC_WHATSAPP_SERRALHERIA=5562999999998
NEXT_PUBLIC_EMPRESA_CIDADE=Santa Tereza de Goiás
PING_KEY=super-secreto-keepalive-2024  # Opcional — protege /api/ping
```

### 4. Instalar e rodar

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

---

## 🚢 Deploy no Vercel

### Via GitHub (recomendado)

1. Crie repositório no GitHub e faça push do projeto
2. Acesse [vercel.com](https://vercel.com) → **New Project** → importe o repo
3. Adicione todas as variáveis de ambiente no painel da Vercel
4. Deploy automático! ✅

### Via CLI

```bash
npm install -g vercel
vercel --prod
```

---

## 🤖 Agentes de IA

O sistema usa um **orquestrador** que analisa cada mensagem e decide qual agente responde:

| Agente | Função |
|--------|--------|
| **Peças** | Compatibilidade, categorias, direciona para WhatsApp |
| **Serralheria** | Serviços, orçamentos, envia para WhatsApp |
| **Geral** | Horários, endereço, informações básicas |
| **Vendas** | Converte o cliente em ação pelo WhatsApp |

---

## 📊 Dashboard do cliente

Acesse em `/dashboard` com a senha definida em `DASHBOARD_SECRET`.

Funcionalidades:
- ✅ Criar anúncios (peças ou serralheria)
- ✅ Visualizar e excluir anúncios
- ✅ Preview antes de publicar
- ✅ Publicação automática na vitrine pública

---

## 🔍 SEO implementado

- ✅ Schema.org `LocalBusiness` + `AutoPartsStore`
- ✅ Open Graph para redes sociais
- ✅ Sitemap automático (`/sitemap.xml`)
- ✅ Robots.txt (`/robots.txt`)
- ✅ Meta tags por página
- ✅ Região: `gru1` (São Paulo) para baixa latência

---

## 🌙 MP Uptime — Keep-Alive do Supabase

O plano gratuito do Supabase (**Hobby**) pausa o projeto após **7 dias de inatividade**. Quando pausado, sua aplicação não consegue conectar ao banco de dados.

Este projeto inclui um sistema automatizado de **keep-alive** que faz ping no Supabase a cada 5 minutos, mantendo o projeto sempre ativo.

### Como funciona

| Peça | Função |
|------|--------|
| **`GET /api/ping`** | Endpoint Next.js que faz uma query leve (`count HEAD`) no Supabase |
| **GitHub Actions cron** | Workflow que dispara o ping a cada 5 minutos (grátis) |
| **Middleware exemption** | `/api/ping` é ignorado pelo rate-limiting |

### Configuração (1 vez apenas)

#### 1. GitHub Secret

No repositório GitHub → **Settings → Secrets and variables → Actions → New repository secret**:

| Nome | Valor |
|------|-------|
| `PING_KEY` | Uma string aleatória, ex: `supabase-keepalive-2024` |

> 💡 Se não quiser usar autenticação, deixe o `PING_KEY` em branco (o endpoint aceitará todos os requests). Recomendado apenas para desenvolvimento.

#### 2. Vercel Environment Variable

No painel da Vercel → **Project Settings → Environment Variables**:

| Nome | Valor | Environment |
|------|-------|-------------|
| `PING_KEY` | Mesma string do passo 1 | Production & Preview |

#### 3. Deploy

Faça commit e push — o workflow do GitHub Actions será ativado automaticamente:

```bash
git add .
git commit -m "feat: MP Uptime keep-alive do Supabase"
git push
```

### Alternativa: UptimeRobot

Se preferir não usar GitHub Actions, configure um monitor HTTP no [UptimeRobot](https://uptimerobot.com):

- **URL:** `https://mdmotopecas.com.br/api/ping`
- **Method:** GET
- **Interval:** 5 minutos
- **Header:** `x-ping-key: <sua-valor-PING_KEY>` (se configurado)

---

## 📞 Próximos passos sugeridos

- [x] Configurar MP Uptime (keep-alive do Supabase)
- [ ] Conectar Google Maps real na página de contato
- [ ] Adicionar Google Analytics 4
- [ ] Registrar domínio `mdmotopecas.com.br`
- [ ] Conectar domínio na Vercel
- [ ] Criar conta no Google Business Profile
- [ ] Configurar Evolution API para WhatsApp

---

Desenvolvido por **Souza Produções** — Formoso, Goiás 🇧🇷
