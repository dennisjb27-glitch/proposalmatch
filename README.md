# ProposalMatch — Procurement Intelligence Tool

Herramienta web para análisis automático y comparación de propuestas de proveedores.

## ✨ Características

- ✅ Extracción automática de datos de PDFs
- ✅ Scoring y ranking automático
- ✅ Criterios ponderados ajustables
- ✅ Panel de colaboración con stakeholders
- ✅ Exportación de reportes
- ✅ 100% privacidad (PDFs se borran automáticamente)

## 🚀 Despliegue

Ver `DEPLOY.md` para instrucciones de despliegue en Railway.

## 📊 Cómo funciona

1. Sube PDFs de propuestas
2. La app extrae automáticamente:
   - Precio unitario
   - Plazo de entrega
   - Volumen mínimo
   - Términos de pago
   - Certificaciones
   - Índice de confiabilidad

3. Visualiza rankings y comparativas
4. Ajusta pesos de criterios
5. Colabora con stakeholders
6. Exporta el análisis

## 🔒 Seguridad

- PDFs se procesan en memoria
- Se borran automáticamente después de 30 minutos
- HTTPS automático (certificado SSL gratis)
- Sin almacenamiento persistente de documentos
- Cada sesión es independiente

## 📋 Requisitos

- Node.js 18.x
- Express.js
- Multer (carga de archivos)
- pdf-parse (extracción de PDFs)

## 📝 Licencia

Privado

---

**¡ProposalMatch - Análisis inteligente de propuestas!**
