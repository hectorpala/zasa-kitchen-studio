# 🔧 Configuración DNS GoDaddy → Netlify

## Pasos Rápidos

### 1️⃣ En Netlify:
1. Site settings → Domain management
2. Add custom domain → `zasakitchen.com`
3. Anotar el nombre de tu sitio: `[nombre].netlify.app`

### 2️⃣ En GoDaddy:
1. Mis productos → Dominios → zasakitchen.com
2. Click en "DNS" o "Administrar DNS"

### 3️⃣ Configurar estos registros:

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A | @ | 75.2.60.5 | 1 hora |
| CNAME | www | [tu-sitio].netlify.app | 1 hora |

### 4️⃣ Eliminar:
- ❌ Cualquier otro registro A para @
- ❌ Cualquier otro registro CNAME para www
- ✅ Mantener registros MX (si usas correo)

### 5️⃣ Guardar y esperar:
- Cambios visibles: 5-30 minutos
- Propagación completa: hasta 48 horas

## Verificación

### En terminal:
```bash
# Verificar registro A
nslookup zasakitchen.com

# Verificar CNAME
nslookup www.zasakitchen.com

# Verificar propagación DNS
curl -I https://zasakitchen.com
```

### En navegador:
1. https://zasakitchen.com
2. https://www.zasakitchen.com

Ambos deben cargar tu sitio.

## Problemas Comunes

### "DNS_PROBE_FINISHED_NXDOMAIN"
- Los DNS no se han propagado aún
- Esperar más tiempo o limpiar caché DNS

### "Certificate error"
- En Netlify: Domain settings → HTTPS
- Click "Provision certificate"
- Esperar 10-15 minutos

### El sitio no carga
- Verificar que el branch `production` esté deployado
- En Netlify: Deploys → Trigger deploy

## Registros DNS Correctos

```
zasakitchen.com.     A      75.2.60.5
www.zasakitchen.com. CNAME  [tu-sitio].netlify.app.
```

## Contacto Soporte

- **GoDaddy:** https://www.godaddy.com/help
- **Netlify:** https://www.netlify.com/support/

---
Fecha: 2025-08-24