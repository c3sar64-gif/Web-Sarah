---
name: sarah-bakery-ordering
description: Consultar catálogo de repostería artesanal en Cochabamba y registrar pedidos con entrega a domicilio y pago QR Simple BNB.
---

# Sarah Bakery Ordering Skill

## Instrucciones para Agentes de IA

Este skill permite a los agentes de IA interactuar con la pastelería artesanal **Sarah — Horneado con Amor** en Cochabamba, Bolivia.

### Capacidades
1. **Consultar Menú**: Ver productos como Pie de Limón (85 Bs), Queque Tradicional (70 Bs), Galletas (35 Bs), Tortas (120 Bs).
2. **Validar Cobertura**: Entregas en Cercado Centro, Norte, Sur, Tiquipaya, Sacaba, Quillacollo, Colcapirhua.
3. **Reglas de Entrega**: Mínimo 48 horas de anticipación para el horneado. Horarios de entrega de 17:00 a 21:00.
4. **Pago**: Generación de QR Simple BNB válido desde cualquier banco de Bolivia.

### API Endpoints
- Catálogo: `GET /api/productos`
- Crear Pedido: `POST /api/ordenes`
- Confirmar Pago: `POST /api/ordenes/{id}/confirmar-pago`
