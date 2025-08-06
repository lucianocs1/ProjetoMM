# Guia de Produção Local - Admin Panel

## ✅ Status: PRONTO PARA PRODUÇÃO LOCAL

Esta aplicação está configurada para rodar em ambiente de produção local, sem necessidade de domínio.

## 📋 Pré-requisitos

1. **Backend API rodando** em `http://localhost:5006`
2. **Node.js** instalado (versão 16+ recomendada)
3. **npm** atualizado

## 🚀 Como colocar em produção local

### 1. Build para produção
```bash
cd admin-templates
npm run build:local
```

### 2. Servir aplicação (opção 1 - recomendada)
```bash
npm run start:production
```
- Automaticamente faz build e serve na porta 3000
- Acesse: http://localhost:3000

### 3. Servir aplicação (opção 2 - manual)
```bash
npm run serve:local
```
- Serve o build existente na pasta dist/
- Acesse: http://localhost:3000

## 🔧 Configurações de Produção

### Arquivos de ambiente:
- `.env.local` - Configurações para produção local
- `.env.production` - Configurações para produção remota

### Otimizações incluídas:
- ✅ Minificação de código
- ✅ Tree-shaking para reduzir tamanho
- ✅ Chunks separados para vendor e UI
- ✅ Console.log removido em produção
- ✅ Source maps desabilitados
- ✅ Compressão Terser

## 🔐 Segurança

- ✅ Autenticação via JWT
- ✅ Verificação de token no servidor
- ✅ Headers de segurança configurados
- ✅ Sanitização de inputs
- ✅ Validação de uploads

## 📱 Recursos prontos

- ✅ Interface responsiva
- ✅ Loading states em todas as ações
- ✅ Mensagens de erro claras
- ✅ Gestão completa de produtos
- ✅ Upload de imagens
- ✅ Logout com confirmação
- ✅ Validação de formulários

## 🏃‍♂️ Comandos disponíveis

```bash
# Desenvolvimento
npm run dev

# Produção local
npm run start:production  # Build + serve
npm run build:local       # Apenas build
npm run serve:local       # Apenas serve

# Manutenção
npm run lint              # Verificar código
npm run lint:fix          # Corrigir problemas
```

## 📂 Estrutura após build

```
dist/
├── index.html           # Página principal
├── assets/              # JS, CSS e imagens otimizadas
└── uploads/             # Pasta para uploads (se necessário)
```

## 🔗 URLs de acesso

- **Desenvolvimento**: http://localhost:5173
- **Produção local**: http://localhost:3000
- **API Backend**: http://localhost:5006

## ⚠️ Importante

1. **Backend deve estar rodando** antes de iniciar o frontend
2. **Pasta dist/** será criada no build (não commitar)
3. **Configurações sensíveis** estão em arquivos .env
4. **Banco de dados** deve estar configurado no backend

---

**Status**: ✅ Aplicação 100% pronta para produção local!
