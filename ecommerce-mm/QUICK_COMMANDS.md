# 🚀 Comandos Rápidos - E-commerce Full Stack

## Frontend (React + Vite)
```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

## Backend (.NET + SQLite)

### Primeira configuração:
```bash
# Criar pasta do backend
mkdir ecommerce-backend
cd ecommerce-backend

# Criar projeto Web API
dotnet new webapi -n EcommerceApi
cd EcommerceApi

# Instalar pacotes
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.AspNetCore.Cors
```

### Comandos diários:
```bash
# Restaurar dependências
dotnet restore

# Executar a API
dotnet run

# Executar em modo watch (hot reload)
dotnet watch run

# Build
dotnet build
```

### Banco de dados:
```bash
# Criar migration
dotnet ef migrations add NomeDaMigration

# Aplicar migration
dotnet ef database update

# Remover última migration
dotnet ef migrations remove
```

## URLs de Desenvolvimento

- **Frontend**: http://localhost:3000
- **Backend API**: https://localhost:7001
- **Swagger**: https://localhost:7001/swagger
- **Banco SQLite**: `ecommerce.db` (gerado automaticamente)

## Admin Panel (separado)
- **Admin**: http://localhost:5173 (ou outra porta configurada)

## Estrutura Completa do Projeto

```
projeto-ecommerce/
├── ecommerce-mm/                 # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/           # API integration
│   │   ├── hooks/              # React hooks
│   │   └── types/              # Data models
│   ├── dist/                   # Build de produção
│   └── package.json
├── ecommerce-backend/           # Backend .NET
│   └── EcommerceApi/
│       ├── Controllers/
│       ├── Models/
│       ├── DTOs/
│       ├── Data/
│       ├── ecommerce.db        # SQLite database
│       └── Program.cs
└── docs/                       # Documentação
```

## Workflow de Desenvolvimento

### 1. Iniciar o Backend:
```bash
cd ecommerce-backend/EcommerceApi
dotnet run
```

### 2. Iniciar o Frontend:
```bash
cd ecommerce-mm
npm run dev
```

### 3. Acessar:
- Frontend: http://localhost:3000
- API: https://localhost:7001/swagger

## Integração Frontend ↔ Backend

O frontend já está configurado com:
- ✅ `src/services/api.js` - Cliente HTTP
- ✅ `src/services/productService.js` - Endpoints de produtos  
- ✅ `src/hooks/useProducts.js` - Hooks React
- ✅ `src/types/models.js` - Modelos de dados
- ✅ Variables de ambiente configuradas

## Próximos Passos

1. **Criar o backend** seguindo o `BACKEND_SETUP.md`
2. **Copiar `.env.example` para `.env`**
3. **Executar ambos os projetos**
4. **Testar a integração**
5. **Desenvolver funcionalidades específicas**

## Comandos Úteis

```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar portas em uso
netstat -ano | findstr :5173
netstat -ano | findstr :7001

# Matar processo por porta (Windows)
taskkill /PID <PID> /F
```

---

**Projeto limpo, otimizado e pronto para desenvolvimento full stack!** 🎉
