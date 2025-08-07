@echo off
echo ====================================
echo   EcommerceMM - Iniciando Producao
echo ====================================

echo Configurando ambiente de producao...
set ASPNETCORE_ENVIRONMENT=Production

echo Verificando dependencias...
dotnet --version
if %errorlevel% neq 0 (
    echo ERRO: .NET 8 nao encontrado! 
    pause
    exit /b 1
)

echo Restaurando pacotes...
dotnet restore

echo Verificando configuracoes de producao...
if not exist "appsettings.Production.json" (
    echo AVISO: appsettings.Production.json nao encontrado!
    echo Usando configuracoes padrao...
)

echo.
echo ====================================
echo   Iniciando API em modo PRODUCAO
echo ====================================
echo URL: http://localhost:5006
echo Swagger: Desabilitado em producao
echo ====================================
echo.

dotnet run --configuration Release --urls "http://localhost:5006"
