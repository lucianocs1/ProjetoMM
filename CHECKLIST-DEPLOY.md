# ✅ CHECKLIST DE DEPLOY - E-COMMERCE MM

## 📋 **PRÉ-DEPLOY** (Execute deploy-producao.bat)
- [ ] ✅ Script de preparação executado
- [ ] ✅ Build do admin concluído (admin-templates/dist/)
- [ ] ✅ Build do frontend concluído (ecommerce-mm/dist/)
- [ ] ✅ Arquivos railway.toml e vercel.json criados
- [ ] ✅ Repositório commitado no GitHub

---

## 🔧 **1. DEPLOY BACKEND (1º LUGAR)**

### Railway.app Deploy:
- [ ] Acesse [railway.app](https://railway.app)
- [ ] Faça login com GitHub
- [ ] Clique "New Project" → "Deploy from GitHub repo"
- [ ] Selecione repositório `ProjetoMM`
- [ ] Configure:
  - [ ] **Root Directory:** `backend-api`
  - [ ] **Start Command:** `dotnet run --urls http://0.0.0.0:$PORT`
- [ ] Clique "Deploy"
- [ ] Aguarde o deploy (5-10 minutos)

### Pós-Deploy Backend:
- [ ] ✅ URL da API gerada: `https://________.railway.app`
- [ ] ✅ Teste endpoint: `GET https://sua-api.railway.app/api/products`
- [ ] ✅ Status 200 ou 401 (normal)

**📝 ANOTE A URL:** `https://________.railway.app`

---

## 👨‍💻 **2. DEPLOY ADMIN (2º LUGAR)**

### Configurar API URL:
- [ ] Abra: `admin-templates/src/services/apiConfig.js`
- [ ] Altere a linha da production:
```javascript
production: 'https://SUA-URL-RAILWAY.railway.app'
```
- [ ] Commit e push das mudanças

### Vercel Deploy:
- [ ] Acesse [vercel.com](https://vercel.com)
- [ ] Clique "Import Git Repository"
- [ ] Selecione repositório `ProjetoMM`
- [ ] Configure:
  - [ ] **Project Name:** `admin-ecommerce-mm`
  - [ ] **Root Directory:** `admin-templates`
  - [ ] **Build Command:** `npm run build`
  - [ ] **Output Directory:** `dist`
- [ ] Clique "Deploy"

### Pós-Deploy Admin:
- [ ] ✅ URL admin gerada: `https://________.vercel.app`
- [ ] ✅ Acesse a URL e teste o login
- [ ] ✅ Login funciona (admin / admin123)
- [ ] ✅ Cadastre 2-3 produtos de teste

**📝 ANOTE A URL:** `https://________.vercel.app`

---

## 🌐 **3. DEPLOY FRONTEND (3º LUGAR)**

### Configurar API URL:
- [ ] Abra: `ecommerce-mm/src/services/api.js`
- [ ] Altere a linha da production:
```javascript
production: 'https://SUA-URL-RAILWAY.railway.app'
```
- [ ] Commit e push das mudanças

### Vercel Deploy:
- [ ] Acesse [vercel.com](https://vercel.com) 
- [ ] Clique "Import Git Repository"
- [ ] Selecione repositório `ProjetoMM`
- [ ] Configure:
  - [ ] **Project Name:** `ecommerce-mm-loja`
  - [ ] **Root Directory:** `ecommerce-mm`
  - [ ] **Build Command:** `npm run build`
  - [ ] **Output Directory:** `dist`
- [ ] Clique "Deploy"

### Pós-Deploy Frontend:
- [ ] ✅ URL loja gerada: `https://________.vercel.app`
- [ ] ✅ Acesse a URL
- [ ] ✅ Produtos aparecem na página
- [ ] ✅ Navegação funciona
- [ ] ✅ PWA instala no celular

**📝 ANOTE A URL:** `https://________.vercel.app`

---

## 🔗 **4. CONFIGURAR CORS (IMPORTANTE!)**

### No Railway (Backend):
- [ ] Acesse painel do Railway
- [ ] Vá em "Variables"
- [ ] Adicione variável:
  - [ ] **Nome:** `ASPNETCORE_ENVIRONMENT`
  - [ ] **Valor:** `Production`
- [ ] Salve e redeploy

### Atualizar appsettings.Production.json:
- [ ] Edite: `backend-api/appsettings.Production.json`
- [ ] Adicione suas URLs:
```json
"AllowedOrigins": [
  "https://admin-ecommerce-mm.vercel.app",
  "https://ecommerce-mm-loja.vercel.app"
]
```
- [ ] Commit e push (redeploy automático)

---

## 🧪 **5. TESTES FINAIS**

### Sistema Completo:
- [ ] ✅ **Backend:** API responde
- [ ] ✅ **Admin:** Login funciona
- [ ] ✅ **Admin:** Cadastro de produto funciona  
- [ ] ✅ **Frontend:** Produtos aparecem
- [ ] ✅ **Frontend:** Navegação funciona
- [ ] ✅ **PWA:** Instala no celular

### URLs Finais:
```
Backend:   https://________.railway.app
Admin:     https://________.vercel.app
Frontend:  https://________.vercel.app
```

---

## 🏠 **6. DOMÍNIO PERSONALIZADO (OPCIONAL)**

### Para usar domínio próprio:
- [ ] Compre domínio (.com, .com.br, etc.)
- [ ] No Vercel: Settings → Domains
- [ ] Adicione seu domínio
- [ ] Configure DNS no registrador:
  - [ ] `A` record: `@` → `76.76.19.61`
  - [ ] `CNAME` record: `www` → `seu-projeto.vercel.app`

---

## 🎉 **DEPLOY CONCLUÍDO!**

### ✅ **SISTEMA NO AR:**
- Backend API funcionando
- Admin para gerenciar produtos  
- Loja online para clientes
- PWA instalável
- Pronto para vendas!

### 💰 **CUSTOS:**
- Railway: GRÁTIS (500h/mês)
- Vercel: GRÁTIS (ilimitado)
- **TOTAL: R$ 0,00/mês**

### 📈 **PRÓXIMOS PASSOS:**
1. Cadastrar produtos reais
2. Testar compras
3. Configurar analytics
4. Divulgar a loja
5. Começar a vender! 🚀
