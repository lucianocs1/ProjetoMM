# Admin Panel - E-commerce MM

Painel administrativo desenvolvido em React + Vite para gerenciamento de produtos, categorias e usuários de um e-commerce de moda feminina.

## 🚀 Tecnologias
- React 18
- Vite
- JavaScript
- Material-UI
- PropTypes
- Vitest (testes)
- ESLint (lint)

## 📁 Estrutura de Pastas
```
admin-templates/
├── public/
│   └── logo.jpg
├── src/
│   ├── assets/           # Imagens, fontes, ícones
│   ├── components/       # Componentes reutilizáveis
│   ├── contexts/         # Contextos do React
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Páginas principais
│   ├── services/         # Serviços de API
│   ├── types/            # Tipos JS/PropTypes
│   ├── utils/            # Funções utilitárias
│   ├── App.jsx           # Componente principal
│   ├── main.jsx          # Ponto de entrada do React
│   ├── index.css         # CSS global
│   └── setupTests.js     # Configuração de testes
├── .env                  # Variáveis de ambiente
├── package.json          # Configuração do projeto e scripts
├── vite.config.js        # Configuração do Vite
└── README.md             # Documentação do projeto
```

## 📝 Scripts disponíveis
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera o build de produção
- `npm run preview` - Visualiza o build localmente
- `npm run test` - Executa os testes unitários
- `npm run lint` - Executa o lint nos arquivos

## 🌐 Variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```
VITE_API_URL=http://localhost:5006
```

## 🧩 Organização dos arquivos
- **components/**: Botões, cards, modais, header, etc.
- **pages/**: Login, dashboard, produtos, categorias, etc.
- **services/**: Integração com API (authService, productService)
- **contexts/**: Contextos globais (autenticação, tema)
- **hooks/**: Custom hooks para lógica reutilizável
- **utils/**: Funções auxiliares (logger, formatadores)
- **types/**: Tipos JS/PropTypes

## 🧪 Testes
- Testes unitários com Vitest
- Arquivos de teste em `src/__tests__/` ou junto dos componentes

## ✅ Boas práticas
- Modularização e separação de responsabilidades
- Uso de variáveis de ambiente
- Scripts para dev, build, preview, test e lint
- Pronto para integração contínua e deploy

## 📦 Instalação
```bash
npm install
```

## 🏃‍♂️ Como rodar
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000)

## 🛠️ Build para produção
```bash
npm run build
```

## 👨‍💻 Testes
```bash
npm run test
```

## 📚 Documentação
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Material-UI](https://mui.com/)
- [Vitest](https://vitest.dev/)

---

**Projeto pronto para produção!**
