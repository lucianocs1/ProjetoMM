@echo off
echo ===============================================
echo   MENINA MULHER - Deploy para Producao Web
echo ===============================================

echo Verificando ambiente...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: npm nao encontrado!
    pause
    exit /b 1
)

echo.
echo ===============================================
echo   1. Limpando arquivos antigos
echo ===============================================
if exist "dist" rmdir /s /q "dist"
npm run clean

echo.
echo ===============================================
echo   2. Instalando dependencias
echo ===============================================
npm ci --production=false

echo.
echo ===============================================
echo   3. Executando testes e linting
echo ===============================================
npm run lint
if %errorlevel% neq 0 (
    echo AVISO: Problemas encontrados no linting
    set /p continue="Continuar mesmo assim? (y/N): "
    if /i not "%continue%"=="y" (
        echo Deploy cancelado
        pause
        exit /b 1
    )
)

echo.
echo ===============================================
echo   4. Building para producao
echo ===============================================
set VITE_NODE_ENV=production
npm run build

if %errorlevel% neq 0 (
    echo ERRO: Build falhou!
    pause
    exit /b 1
)

echo.
echo ===============================================
echo   5. Verificando build
echo ===============================================
if not exist "dist\index.html" (
    echo ERRO: Build nao gerou arquivos esperados!
    pause
    exit /b 1
)

echo Build concluido com sucesso!
echo.
echo Arquivos gerados em: dist/
dir dist /b

echo.
echo ===============================================
echo   6. Testando build localmente
echo ===============================================
echo Iniciando servidor de preview...
echo URL: http://localhost:4173
echo.
echo Pressione Ctrl+C para parar o servidor
npm run preview:dist

echo.
echo ===============================================
echo   Deploy concluido!
echo ===============================================
echo.
echo Proximos passos:
echo 1. Teste a aplicacao em http://localhost:4173
echo 2. Copie os arquivos da pasta 'dist/' para seu servidor web
echo 3. Configure o servidor para servir o index.html para rotas SPA
echo 4. Configure HTTPS no servidor
echo 5. Atualize as variaveis de ambiente de producao
echo.
pause
