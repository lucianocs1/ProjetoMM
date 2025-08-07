# Estágio 1: Compilação (Build) da Aplicação
# Usamos a imagem completa do SDK do .NET 8 para compilar o projeto
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia o arquivo de projeto e restaura as dependências primeiro para otimizar o cache
COPY ["EcommerceMM.Api.csproj", "."]
RUN dotnet restore "./EcommerceMM.Api.csproj"

# Copia o restante do código-fonte
COPY . .
WORKDIR "/src/."

# Publica a aplicação para produção
RUN dotnet publish "./EcommerceMM.Api.csproj" -c Release -o /app/publish --no-restore

# Estágio 2: Imagem Final (Runtime)
# Usamos a imagem leve do ASP.NET 8, que é menor e mais segura para rodar a aplicação
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copia os arquivos publicados do estágio de compilação
COPY --from=build /app/publish .

# O ENTRYPOINT é o comando que será executado quando o container iniciar.
# A aplicação ASP.NET Core irá escutar automaticamente na porta definida pela Render ($PORT).
ENTRYPOINT ["dotnet", "EcommerceMM.Api.dll"]