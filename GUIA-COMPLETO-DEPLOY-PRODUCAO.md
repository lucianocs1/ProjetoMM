# 🚀 GUIA COMPLETO DE DEPLOY PARA PRODUÇÃO
## E-commerce MM - Sistema Completo

### 📋 **ÍNDICE**
1. [Visão Geral do Sistema](#visão-geral)
2. [Ordem de Deploy](#ordem-de-deploy)
3. [Deploy do Backend (API)](#deploy-backend)
4. [Deploy do Admin Panel](#deploy-admin)
5. [Deploy do Frontend Público](#deploy-frontend)
6. [Testes Antes da Compra](#testes-gratuitos)
7. [Configuração de Domínios](#configuração-domínios)
8. [Checklist Final](#checklist-final)

---

## 🏗️ **VISÃO GERAL DO SISTEMA**

Seu e-commerce tem **3 aplicações separadas**:

```
┌─────────────────────────────────────────────┐
│                 ESTRUTURA                   │
├─────────────────────────────────────────────┤
│ 1. BACKEND API (backend-api/)               │
│    └─ .NET 8 + SQLite + JWT                │
│    └─ Porta: 5006                          │
│    └─ Precisa: Servidor Windows/Linux      │
│                                             │
│ 2. ADMIN PANEL (admin-templates/)           │
│    └─ React + Vite (SPA)                   │
│    └─ Arquivos estáticos HTML/JS/CSS       │
│    └─ Precisa: Qualquer hospedagem web     │
│                                             │
│ 3. FRONTEND PÚBLICO (ecommerce-mm/)         │
│    └─ React + Vite + PWA                   │
│    └─ Arquivos estáticos HTML/JS/CSS       │
│    └─ Precisa: Qualquer hospedagem web     │
└─────────────────────────────────────────────┘
```

---

## ⚡ **ORDEM DE DEPLOY (MUITO IMPORTANTE!)**

### **🥇 1º LUGAR: BACKEND API**
**Por quê primeiro?** Admin e Frontend dependem da API

### **🥈 2º LUGAR: ADMIN PANEL** 
**Por quê segundo?** Para cadastrar produtos antes do site ir ao ar

### **🥉 3º LUGAR: FRONTEND PÚBLICO**
**Por quê por último?** Só depois que tiver produtos cadastrados

---

## 🔧 **1. DEPLOY DO BACKEND (API)**

### **📍 Opções de Hospedagem:**

#### **OPÇÃO A: GRATUITO PARA TESTES**
- **Railway.app** (500h grátis/mês)
- **Render.com** (750h grátis/mês) 
- **Heroku** (limitado mas funciona)

#### **OPÇÃO B: PAGO MAS BARATO**
- **DigitalOcean** ($4-6/mês)
- **AWS Lightsail** ($3.50/mês)
- **Azure App Service** ($13/mês)

### **🛠️ Deploy no Railway (RECOMENDADO PARA TESTES)**

1. **Preparar o projeto:**
```bash
cd backend-api
```

2. **Criar arquivo Railway:**
```dockerfile
# Criar: railway.toml
[build]
  builder = "nixpacks"
  
[deploy]
  startCommand = "dotnet run --urls http://0.0.0.0:$PORT"
  
[env]
  PORT = "8080"
```

3. **Ajustar configuração:**
```json
// appsettings.Production.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=ecommerce.db"
  },
  "JwtSettings": {
    "SecretKey": "SUA_CHAVE_SUPER_SECRETA_DE_32_CARACTERES_AQUI",
    "Issuer": "EcommerceMM",
    "Audience": "EcommerceMM",
    "ExpiryMinutes": 60
  },
  "AllowedOrigins": [
    "https://seu-admin.vercel.app",
    "https://seu-frontend.vercel.app"
  ]
}
```

4. **Deploy:**
   - Acesse [railway.app](https://railway.app)
   - Conecte seu GitHub
   - Selecione o repositório
   - Configure: `Root Directory = backend-api`
   - Deploy automático!

5. **URL resultante:** `https://seu-projeto.railway.app`

---

## 👨‍💻 **2. DEPLOY DO ADMIN PANEL**

### **📍 Opções de Hospedagem:**
- **Vercel** (GRATUITO - RECOMENDADO)
- **Netlify** (GRATUITO)
- **GitHub Pages** (GRATUITO)

### **🛠️ Deploy no Vercel (RECOMENDADO)**

1. **Configurar API URL:**
```javascript
// admin-templates/src/services/apiConfig.js
const API_CONFIG = {
  development: 'http://localhost:5006',
  production: 'https://seu-projeto.railway.app' // URL da API
};

export const API_BASE_URL = API_CONFIG[process.env.NODE_ENV] || API_CONFIG.production;
```

2. **Build do projeto:**
```bash
cd admin-templates
npm install
npm run build
```

3. **Deploy:**
   - Acesse [vercel.com](https://vercel.com)
   - Import do GitHub
   - Configure: `Root Directory = admin-templates`
   - Deploy automático!

4. **URL resultante:** `https://admin-mm.vercel.app`

---

## 🌐 **3. DEPLOY DO FRONTEND PÚBLICO**

### **📍 Opções de Hospedagem:**
- **Vercel** (GRATUITO - RECOMENDADO)
- **Netlify** (GRATUITO)
- **GitHub Pages** (GRATUITO)

### **🛠️ Deploy no Vercel**

1. **Configurar API URL:**
```javascript
// ecommerce-mm/src/services/api.js
const API_CONFIG = {
  development: 'http://localhost:5006',
  production: 'https://seu-projeto.railway.app' // URL da API
};

export const API_BASE_URL = API_CONFIG[process.env.NODE_ENV] || API_CONFIG.production;
```

2. **Build do projeto:**
```bash
cd ecommerce-mm
npm install
npm run build
```

3. **Deploy:**
   - Acesse [vercel.com](https://vercel.com)
   - Import do GitHub
   - Configure: `Root Directory = ecommerce-mm`
   - Deploy automático!

4. **URL resultante:** `https://ecommerce-mm.vercel.app`

---

## 🧪 **TESTES GRATUITOS ANTES DA COMPRA**

### **🎯 ESTRATÉGIA DE TESTES:**

#### **FASE 1: TESTES LOCAIS (GRÁTIS)**
```
Backend:     http://localhost:5006
Admin:       http://localhost:3001  
Frontend:    http://localhost:3000
```

#### **FASE 2: TESTES EM SUBDOMÍNIOS GRATUITOS (GRÁTIS)**
```
Backend:     https://api-mm.railway.app
Admin:       https://admin-mm.vercel.app
Frontend:    https://loja-mm.vercel.app
```

#### **FASE 3: TESTES COM DOMÍNIO TEMPORÁRIO (GRÁTIS)**
```
Backend:     https://api-mm.railway.app
Admin:       https://admin.minhalojatest.tk (gratuito)
Frontend:    https://minhalojatest.tk (gratuito)
```

### **🆓 Domínios Gratuitos para Teste:**
- **Freenom:** `.tk`, `.ml`, `.ga` (gratuitos por 1 ano)
- **InfinityFree:** subdomínio `.epizy.com`
- **000WebHost:** subdomínio `.000webhostapp.com`

---

## 🏠 **CONFIGURAÇÃO DE DOMÍNIOS**

### **📋 QUANDO COMPRAR DOMÍNIO:**

#### **1. Escolher Provedor:**
- **Registro.br** (domínios .com.br) - R$ 40/ano
- **GoDaddy** (domínios .com) - R$ 60/ano  
- **Namecheap** (domínios .com) - $12/ano

#### **2. Configurar DNS:**
```
Tipo    Nome        Valor
A       @           IP_DO_SERVIDOR_BACKEND
CNAME   admin       admin-mm.vercel.app
CNAME   www         ecommerce-mm.vercel.app
```

#### **3. Exemplo Final:**
```
Backend:     https://api.minhaloja.com.br
Admin:       https://admin.minhaloja.com.br
Frontend:    https://www.minhaloja.com.br
```

---

## 📋 **CHECKLIST DE DEPLOY**

### **✅ PRÉ-DEPLOY:**
- [ ] Backup do banco de dados
- [ ] Configurar variáveis de ambiente
- [ ] Testar builds localmente
- [ ] Configurar CORS para produção

### **✅ BACKEND:**
- [ ] Deploy no Railway/Render
- [ ] Testar endpoints da API
- [ ] Configurar banco de dados
- [ ] Testar autenticação JWT

### **✅ ADMIN:**
- [ ] Configurar URL da API
- [ ] Deploy no Vercel
- [ ] Testar login de admin
- [ ] Testar cadastro de produtos

### **✅ FRONTEND:**
- [ ] Configurar URL da API
- [ ] Deploy no Vercel
- [ ] Testar carregamento de produtos
- [ ] Testar PWA/navegação

### **✅ PÓS-DEPLOY:**
- [ ] Configurar domínios
- [ ] Configurar SSL/HTTPS
- [ ] Testar performance
- [ ] Configurar analytics
- [ ] Backup automático

---

## 🔄 **PROCESSO COMPLETO PASSO A PASSO**

### **DIA 1: BACKEND**
1. Deploy no Railway (gratuito)
2. Testar API endpoints
3. Anotar URL da API

### **DIA 2: ADMIN**
1. Configurar URL da API no admin
2. Deploy no Vercel
3. Fazer primeiro login
4. Cadastrar produtos de teste

### **DIA 3: FRONTEND**
1. Configurar URL da API no frontend
2. Deploy no Vercel
3. Testar navegação completa
4. Verificar produtos aparecendo

### **DIA 4: DOMÍNIO TESTE**
1. Registrar domínio gratuito (.tk)
2. Configurar DNS
3. Testar sistema completo

### **DIA 5: PRODUÇÃO FINAL**
1. Comprar domínio definitivo
2. Migrar configurações
3. Sistema no ar! 🎉

---

## 💰 **CUSTOS ESTIMADOS**

### **CENÁRIO GRATUITO (Para testes):**
```
Backend:     Railway.app       = GRÁTIS (500h/mês)
Admin:       Vercel            = GRÁTIS
Frontend:    Vercel            = GRÁTIS
Domínio:     .tk/.ml           = GRÁTIS
TOTAL:                         = R$ 0,00/mês
```

### **CENÁRIO PAGO (Produção):**
```
Backend:     DigitalOcean      = R$ 25,00/mês
Admin:       Vercel            = GRÁTIS
Frontend:    Vercel            = GRÁTIS  
Domínio:     .com.br           = R$ 3,33/mês
TOTAL:                         = R$ 28,33/mês
```

---

## 🆘 **SUPORTE E PRÓXIMOS PASSOS**

### **🔧 Se der problema:**
1. Verificar logs no Railway/Vercel
2. Testar URLs individualmente
3. Verificar configuração de CORS
4. Verificar variáveis de ambiente

### **📈 Melhorias futuras:**
- CDN para imagens
- Cache Redis
- Backup automático
- Monitoramento
- SSL personalizado

---

## ⚡ **COMANDOS RÁPIDOS DE DEPLOY**

```bash
# 1. Preparar Backend
cd backend-api
git add . && git commit -m "Deploy backend"
git push

# 2. Preparar Admin
cd ../admin-templates
npm run build
git add . && git commit -m "Deploy admin"
git push

# 3. Preparar Frontend
cd ../ecommerce-mm
npm run build
git add . && git commit -m "Deploy frontend"
git push
```

---

**🎯 RESUMO:** Comece pelos **testes gratuitos** (Railway + Vercel), valide tudo funcionando, depois migre para domínio próprio quando estiver seguro!

**🚀 PRÓXIMO PASSO:** Fazer deploy do backend no Railway primeiro!
