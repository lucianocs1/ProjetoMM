# � E-commerce Admin Panel - Versão Produção

Sistema administrativo moderno para gerenciamento de produtos e-commerce, desenvolvido com React + Vite e integração com backend .NET Core.

## ✨ **Características da Versão Produção:**

### 🏗️ **Arquitetura**
- **Frontend**: React 18 + Vite 5
- **UI Library**: Material-UI 5
- **Integração**: API REST (.NET Core)
- **Fallback**: localStorage para desenvolvimento
- **Build**: Otimizado para produção

### � **Estrutura Otimizada**
```
src/
├── services/          # Integração com API
│   ├── apiConfig.js   # Configurações da API
│   ├── authService.js # Autenticação
│   └── productService.js # Produtos
├── App.jsx           # Componente principal
├── Login.jsx         # Tela de login
├── ProductManager.jsx # Dashboard principal
├── ProductForm.jsx   # Formulário de produtos
├── ProductList.jsx   # Lista de produtos
└── index.css        # Estilos globais
```

## 🚀 **Deploy e Produção**

### **📦 Build para Produção:**
```bash
# Instalar dependências
npm install

# Build otimizado
npm run build:production

# Preview do build
npm run preview
```

### **🌐 Deploy:**
```bash
# Build gera pasta 'dist/' pronta para deploy
# Compatível com: Vercel, Netlify, Apache, Nginx, IIS
```

## ⚙️ **Configuração de Ambiente**

### **📋 Variáveis de Ambiente:**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=10000

# App Info
VITE_APP_NAME=E-commerce Admin Panel
VITE_APP_VERSION=1.0.0

# Upload Settings
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### **🔄 Ambientes:**
- **Development**: `.env.development`
- **Production**: `.env.production`
- **Local**: `.env.local` (ignorado pelo git)

## 🔌 **Integração Backend .NET**

### **🎯 Endpoints Esperados:**
```
POST   /api/auth/login
GET    /api/products
GET    /api/products/{id}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
GET    /api/products/dashboard
```

### **📡 Fallback Sistema:**
- **API Disponível**: Usa endpoints REST
- **API Indisponível**: Fallback para localStorage
- **Desenvolvimento**: Funciona offline

## 🛠️ **Scripts Disponíveis**

```bash
npm run dev              # Desenvolvimento
npm run build            # Build produção
npm run build:production # Build otimizado
npm run preview          # Preview do build
npm run lint             # Verificar código
npm run lint:fix         # Corrigir automaticamente
```

## 📋 **Funcionalidades**

### ✅ **Autenticação**
- Login seguro com JWT
- Renovação automática de token
- Logout com limpeza de sessão

### ✅ **Gestão de Produtos**
- CRUD completo
- Upload de múltiplas imagens
- Categorias e tags
- Busca e filtros
- Validação de dados

### ✅ **Dashboard**
- Estatísticas em tempo real
- Interface responsiva
- Animações suaves
- Feedback visual

## � **Segurança**

- Headers CORS configurados
- Validação de tipos de arquivo
- Sanitização de dados
- Token JWT seguro
- Fallback seguro para desenvolvimento

## 📱 **Responsividade**

- Mobile First
- Tablet otimizado
- Desktop completo
- Touch friendly

## 🎨 **Customização**

### **🎨 Tema Material-UI:**
- Cores primárias personalizáveis
- Componentes estilizados
- Bordas arredondadas
- Gradientes modernos

### **⚡ Performance:**
- Code splitting
- Tree shaking
- Lazy loading
- Build otimizado

## 🚀 **Pronto para:**

✅ **Deploy Imediato**
✅ **Integração Backend**
✅ **Ambiente Produção**
✅ **Clientes Finais**

---

**Versão**: 1.0.0 | **Última Atualização**: Agosto 2025
