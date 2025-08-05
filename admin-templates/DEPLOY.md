# 🚀 Guia de Deploy - E-commerce Admin Panel

## 📦 **Build de Produção**

```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo .env.production com suas configurações
cp .env.example .env.production

# 3. Build otimizado para produção
npm run build:production

# 4. Testar build localmente
npm run preview
```

## 🌐 **Opções de Deploy**

### **1. Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configurar variáveis de ambiente no dashboard
```

### **2. Netlify**
```bash
# Deploy via CLI
npm i -g netlify-cli
netlify deploy --prod --dir=dist

# Ou arrastar pasta 'dist/' no dashboard
```

### **3. GitHub Pages**
```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Adicionar script no package.json:
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

### **4. Servidor Próprio (Apache/Nginx)**
```bash
# Copiar pasta 'dist/' para servidor
scp -r dist/* user@server:/var/www/html/admin/

# Configurar .htaccess (Apache)
# Ou nginx.conf (Nginx)
```

## ⚙️ **Configurações por Ambiente**

### **📋 Variáveis de Ambiente:**

**.env.production:**
```env
VITE_API_BASE_URL=https://api.seudominio.com/api
VITE_APP_NAME=Admin Panel - Produção
VITE_ENABLE_DEVTOOLS=false
VITE_LOG_LEVEL=error
```

**.env.development:**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Admin Panel - Dev
VITE_ENABLE_DEVTOOLS=true
VITE_LOG_LEVEL=debug
```

## 🔧 **Configuração de Servidor**

### **Apache (.htaccess):**
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]

# Habilitar GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache Headers
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

### **Nginx:**
```nginx
server {
    listen 80;
    server_name admin.seudominio.com;
    
    root /var/www/admin/dist;
    index index.html;
    
    # Gzip
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
    
    # Cache estático
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Fallback para SPA
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🐳 **Docker (Opcional)**

### **Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build:production

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### **docker-compose.yml:**
```yaml
version: '3.8'
services:
  admin-panel:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## 🔒 **Segurança em Produção**

### **Checklist:**
- ✅ HTTPS habilitado
- ✅ CORS configurado no backend
- ✅ Variáveis sensíveis em .env
- ✅ Build minificado
- ✅ Console.log removido
- ✅ Headers de segurança configurados

### **Headers de Segurança:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'
```

## 📊 **Monitoramento**

### **Ferramentas Recomendadas:**
- **Uptime**: UptimeRobot, Pingdom
- **Analytics**: Google Analytics 4
- **Errors**: Sentry, LogRocket
- **Performance**: Lighthouse, WebPageTest

## 🚀 **Deploy Automatizado (CI/CD)**

### **GitHub Actions:**
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:production
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

**✅ Projeto pronto para deploy em qualquer ambiente de produção!**
