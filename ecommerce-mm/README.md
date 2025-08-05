# ModaFem - E-commerce de Moda Feminina

Um e-commerce moderno e responsivo desenvolvido em React com Material-UI, focado em moda feminina.

## 🚀 Funcionalidades

- **Design Responsivo**: Interface adaptável para desktop, tablet e mobile
- **Navegação por Categorias**: Blusas, Saias & Calças, Sapatos
- **Integração Social**: Botões para WhatsApp e Instagram em cada produto
- **Sistema de Favoritos**: Marcar produtos favoritos
- **Layout Moderno**: Utilizando Material-UI com tema personalizado
- **Cards de Produto**: Exibição detalhada com preços, tamanhos e descrições

## 🛠️ Tecnologias Utilizadas

- **React 18**: Framework JavaScript para interfaces
- **Vite**: Build tool moderna e rápida
- **Material-UI (MUI)**: Biblioteca de componentes React
- **React Router DOM**: Navegação entre páginas
- **Emotion**: CSS-in-JS para estilização

## 📦 Instalação e Execução

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd ecommerce-mm
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o projeto**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador**
   ```
   http://localhost:5173
   ```

## 🎨 Estrutura do Projeto

```
src/
├── components/
│   ├── Navbar/          # Barra de navegação
│   ├── Footer/          # Rodapé com links sociais
│   └── ProductCard/     # Card de produto
├── pages/
│   ├── Home/            # Página inicial
│   ├── Blusas/          # Catálogo de blusas
│   ├── SaiaCalca/       # Catálogo de saias e calças
│   └── Sapatos/         # Catálogo de sapatos
├── data/
│   └── products.js      # Dados dos produtos
├── App.jsx              # Componente principal
└── main.jsx             # Ponto de entrada
```

## 🛍️ Categorias de Produtos

- **Blusas**: Básicas, estampadas, sociais, cropped
- **Saias & Calças**: Midi, skinny, lápis, wide leg
- **Sapatos**: Scarpins, tênis, sandálias, botas

## 📱 Funcionalidades de Contato

- **WhatsApp**: Envio automático de mensagem com detalhes do produto
- **Instagram**: Redirecionamento para perfil da loja

## 🔧 Personalização

### Alterando Dados dos Produtos
Edite o arquivo `src/data/products.js` para:
- Adicionar novos produtos
- Alterar preços e descrições
- Modificar URLs das imagens

### Configurando Contatos
No arquivo `src/components/Footer/Footer.jsx` e `src/components/ProductCard/ProductCard.jsx`:
- Altere `whatsappNumber` para seu número real
- Altere `instagramHandle` para seu perfil

### Personalizando Cores
No arquivo `src/main.jsx`, modifique o tema:
```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#e91e63', // Sua cor principal
    },
    secondary: {
      main: '#3f51b5', // Sua cor secundária
    },
  },
})
```

## 📈 Próximas Funcionalidades

- [ ] Sistema de carrinho de compras
- [ ] Filtros e busca por produtos
- [ ] Páginas individuais de produtos
- [ ] Sistema de avaliações
- [ ] Integração com backend
- [ ] Processamento de pagamentos

## 🚀 Deploy

Para fazer o deploy do projeto:

```bash
npm run build
```

O build será gerado na pasta `dist/` e pode ser hospedado em qualquer servidor estático.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

Desenvolvido com ❤️ para o mundo da moda feminina+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
