# Configurações de Segurança para Produção
# Este arquivo contém as configurações necessárias para deploy seguro

## 1. Headers de Segurança (para servidor web - Nginx/Apache)

### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name meninmulher.com.br www.meninmulher.com.br;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    
    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Content Security Policy
    add_header Content-Security-Policy "
        default-src 'self';
        script-src 'self' 'unsafe-inline' https://apis.google.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: https://images.unsplash.com;
        connect-src 'self' https://api.whatsapp.com https://wa.me;
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'self';
        upgrade-insecure-requests;
    " always;
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=search:10m rate=10r/m;
    limit_req_zone $binary_remote_addr zone=general:10m rate=30r/m;
    
    location / {
        limit_req zone=general burst=5 nodelay;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/search {
        limit_req zone=search burst=2 nodelay;
        # Proxy para API se necessário
    }
    
    # Disable server tokens
    server_tokens off;
    
    # Hide Nginx version
    more_set_headers "Server: MENINA-MULHER";
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name meninmulher.com.br www.meninmulher.com.br;
    return 301 https://$server_name$request_uri;
}
```

### Apache Configuration (.htaccess)
```apache
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security Headers
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# Content Security Policy
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com"

# Rate Limiting (requires mod_security)
SecRule REQUEST_URI "/search" "phase:1,id:1001,ratelimit:key:%{remote_addr},rate:10/60"
```

## 2. Variáveis de Ambiente (.env.production)

```env
# Modo de produção
NODE_ENV=production
VITE_APP_ENV=production

# URLs da API (se houver backend)
VITE_API_URL=https://api.meninmulher.com.br
VITE_CDN_URL=https://cdn.meninmulher.com.br

# Configurações de segurança
VITE_ENABLE_HTTPS=true
VITE_ENABLE_CSP=true
VITE_ENABLE_RATE_LIMITING=true

# Analytics (Google Analytics - opcional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Integrations
VITE_WHATSAPP_NUMBER=5511999999999
VITE_INSTAGRAM_HANDLE=@meninmulher

# Habilitar logging de segurança
VITE_SECURITY_LOGGING=true
VITE_LOG_ENDPOINT=https://logs.meninmulher.com.br/security
```

## 3. Vite Configuration para Produção (vite.config.js)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    
    // Build optimizations
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction, // Remove console.log em produção
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            mui: ['@mui/material', '@mui/icons-material'],
          },
        },
      },
    },
    
    // Security
    server: {
      https: isProduction,
      headers: isProduction ? {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
      } : {},
    },
    
    // Performance
    optimizeDeps: {
      include: ['@mui/material', '@mui/icons-material'],
    },
  }
})
```

## 4. Checklist de Segurança para Deploy

### ✅ Implementado:
- [x] Cookies seguros com SameSite=Strict
- [x] Criptografia básica de dados em cookies
- [x] Sanitização de entrada de dados
- [x] Rate limiting básico
- [x] Logging de segurança
- [x] Banner de cookies (LGPD/GDPR)
- [x] Headers de segurança no HTML
- [x] Content Security Policy
- [x] Validação de dados de entrada

### 🔄 Para Implementar em Produção:
- [ ] HTTPS obrigatório (SSL/TLS)
- [ ] Certificado SSL válido
- [ ] Rate limiting no servidor
- [ ] Firewall de aplicação web (WAF)
- [ ] Monitoramento de segurança
- [ ] Backup automático
- [ ] Logs centralizados
- [ ] Atualizações de segurança automáticas

### 🚨 Crítico para E-commerce:
- [ ] Sistema de pagamento seguro (PCI DSS)
- [ ] Criptografia de dados sensíveis
- [ ] Autenticação de dois fatores
- [ ] Audit logs completos
- [ ] Política de retenção de dados
- [ ] Processo de resposta a incidentes

## 5. Comandos para Deploy Seguro

```bash
# Build para produção
npm run build

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades automáticas
npm audit fix

# Verificar dependências desatualizadas
npm outdated

# Analisar bundle size
npm run build -- --analyze

# Deploy com verificações
./deploy-secure.sh
```

## 6. Monitoramento Contínuo

### Ferramentas Recomendadas:
- **Sentry**: Monitoramento de erros
- **LogRocket**: Gravação de sessões
- **Google Analytics**: Análise de tráfego
- **Uptime Robot**: Monitoramento de disponibilidade
- **SSL Labs**: Verificação de SSL

### Alertas Configurados:
- Tentativas de XSS
- Rate limiting ativado
- Erros 4xx/5xx excessivos
- Certificado SSL próximo do vencimento
- Uso anormal de recursos

---

**Nota**: Este é um e-commerce básico/demonstrativo. Para produção real com pagamentos, 
implemente medidas adicionais como PCI DSS, criptografia de ponta a ponta e auditoria 
de segurança profissional.
