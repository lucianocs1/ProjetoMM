@echo off
REM ================================================================
REM           SCRIPT DE DEPLOY AUTOMATIZADO - E-COMMERCE MM
REM ================================================================

echo.
echo ========================================
echo    🚀 DEPLOY E-COMMERCE MM - PRODUÇÃO
echo ========================================
echo.

REM Verificar se está na pasta correta
if not exist "ProjetoMM.sln" (
    echo ❌ ERRO: Execute este script na pasta raiz do projeto ProjetoMM
    pause
    exit /b 1
)

echo 📋 PREPARANDO DEPLOY PARA PRODUÇÃO...
echo.

REM =============================================================================
REM 1. PREPARAR BACKEND PARA DEPLOY
REM =============================================================================
echo.
echo 🔧 ETAPA 1/3: PREPARANDO BACKEND...
echo ----------------------------------------

cd backend-api

REM Criar arquivo de configuração para Railway
echo [build] > railway.toml
echo builder = "nixpacks" >> railway.toml
echo. >> railway.toml
echo [deploy] >> railway.toml
echo startCommand = "dotnet run --urls http://0.0.0.0:$PORT" >> railway.toml
echo. >> railway.toml
echo [env] >> railway.toml
echo PORT = "8080" >> railway.toml

echo ✅ Arquivo railway.toml criado
echo ✅ Backend preparado para Railway

cd..

REM =============================================================================
REM 2. PREPARAR ADMIN PARA DEPLOY
REM =============================================================================
echo.
echo 👨‍💻 ETAPA 2/3: PREPARANDO ADMIN...
echo ----------------------------------------

cd admin-templates

REM Instalar dependências se necessário
if not exist "node_modules" (
    echo 📦 Instalando dependências do admin...
    npm install
)

REM Fazer build do admin
echo 🔨 Fazendo build do admin...
npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERRO no build do admin
    pause
    exit /b 1
)

echo ✅ Build do admin concluído
echo ✅ Admin preparado para Vercel

cd..

REM =============================================================================
REM 3. PREPARAR FRONTEND PARA DEPLOY
REM =============================================================================
echo.
echo 🌐 ETAPA 3/3: PREPARANDO FRONTEND...
echo ----------------------------------------

cd ecommerce-mm

REM Instalar dependências se necessário
if not exist "node_modules" (
    echo 📦 Instalando dependências do frontend...
    npm install
)

REM Fazer build do frontend
echo 🔨 Fazendo build do frontend...
npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERRO no build do frontend
    pause
    exit /b 1
)

echo ✅ Build do frontend concluído
echo ✅ Frontend preparado para Vercel

cd..

REM =============================================================================
REM 4. INSTRUÇÕES DE DEPLOY
REM =============================================================================
echo.
echo ========================================
echo       🎉 PREPARAÇÃO CONCLUÍDA!
echo ========================================
echo.
echo 📋 PRÓXIMOS PASSOS PARA DEPLOY:
echo.
echo 🥇 1º LUGAR - BACKEND (API):
echo    • Acesse: https://railway.app
echo    • Conecte seu GitHub
echo    • Selecione este repositório
echo    • Root Directory: backend-api
echo    • Deploy automático!
echo.
echo 🥈 2º LUGAR - ADMIN PANEL:
echo    • Acesse: https://vercel.com  
echo    • Import from GitHub
echo    • Selecione este repositório
echo    • Root Directory: admin-templates
echo    • Deploy automático!
echo.
echo 🥉 3º LUGAR - FRONTEND PÚBLICO:
echo    • Acesse: https://vercel.com
echo    • Import from GitHub  
echo    • Selecione este repositório
echo    • Root Directory: ecommerce-mm
echo    • Deploy automático!
echo.
echo ⚠️  IMPORTANTE:
echo    • Anote a URL da API do Railway
echo    • Configure as URLs nos arquivos apiConfig.js
echo    • Teste cada aplicação após o deploy
echo.
echo 📖 Consulte: GUIA-COMPLETO-DEPLOY-PRODUCAO.md
echo.

pause
