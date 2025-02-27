# Flujo de Prompts – Generación de Documentación PRD

Este documento describe el proceso de creación del documento de Product Requirements Document (PRD) que se implementa en [`pm/prd.js`](cofounder/api/system/functions/pm/prd.js). Se detallan los pasos del flujo, las entradas que alimentan cada prompt y las salidas esperadas en cada etapa.

---

## 1. Paso 1: Captura y Actualización de Detalles Iniciales

**Entrada:**  
- Detalles del proyecto proporcionados por el usuario (texto y, en un futuro, archivos adjuntos).  
- Estos datos se extraen de la propiedad `details` almacenada en la entrada `pm`.

**Proceso:**  
- La función `pmPrdAnalysis` captura y actualiza el estado del proyecto mediante el método `context.run` para almacenar los detalles en la clave `pm.details`.

**Salida Esperada:**  
- Estado actualizado con la información inicial en `pm.details`.

---

## 2. Paso 2: Construcción del Prompt para el PRD

**Entrada:**  
- Texto del proyecto (extraído de `details.text`) como parte del bloque de descripción.  
- Los contenidos relevantes del análisis de PRD (incluyendo las expectativas funcionales y características que debe cubrir).

**Proceso:**  
- Se construye un arreglo de mensajes que incluyen:  
  - Un mensaje del sistema que instruye al modelo LLM a generar un documento PRD 100% completo y adaptado a los requisitos del proyecto.  
  - Mensajes de usuario que delimitan claramente los fragmentos de datos, por ejemplo:  
    - El bloque de `app-project:description`.
    - El bloque de `PRD:product-requirements-document` con el contenido capturado en `details.text`.
- Estos mensajes son enviados al LLM mediante la llamada a `context.run` con un modelo como `chatgpt-4o-latest`.

**Salida Esperada:**  
- Un documento de PRD generado en formato Markdown, que cubre:
  - La descripción y detalle del proyecto.
  - Expectativas de funcionalidad y requerimientos.
  - Las observaciones y análisis crítico adicionales (sección “Additional Analysis”) que aseguran la exhaustividad del análisis.

---

## 3. Paso 3: Actualización del Estado del Proyecto con el PRD Generado

**Entrada:**  
- El documento generado por el LLM (output del array de mensajes enviado en el Paso 2).

**Proceso:**  
- Se realiza una llamada a `context.run` para actualizar el estado del proyecto, almacenando el documento PRD en la clave `pm.prd`.

**Salida Esperada:**  
- Estado actualizado con el documento completo del PRD en `pm.prd`.
- Este documento será utilizado directamente por el equipo de desarrollo para implementar los requerimientos del proyecto.

---

## Resumen del Flujo de Prompts

1. **Captura de Datos Iniciales:**  
   - **Entrada:** Detalles de proyecto (`details.text`) y metainformación adjunta.  
   - **Salida:** Estado actualizado en `pm.details`.

2. **Construcción y Envío del Prompt para PRD:**  
   - **Entrada:** Mensajes que agregan:
     - Descripción general del proyecto.
     - Requisitos del PRD y especificaciones a cubrir.  
   - **Salida:** Documento PRD generado en formato Markdown.

3. **Actualización Final del Estado del Proyecto:**  
   - **Entrada:** Respuesta del LLM (documento PRD).  
   - **Salida:** Documento PRD grabado en `pm.prd` listo para desarrollo.

---

> **Nota:**  
> Este flujo se integra dentro de un sistema de estados, donde cada función actualiza el estado del proyecto a través de `context.run`, permitiendo que la documentación fluya de manera modular entre las diferentes etapas (PRD, FRD, BRD, etc.).  
> El documento final (PRD) se transfiere tal cual al equipo de desarrollo para ser utilizado como base en la implementación de los requerimientos del proyecto.

---

Este es el flujo general para la generación del PRD que asegura que se cubren todos los aspectos críticos del producto, garantizando una documentación integral y 100% alineada con los detalles del proyecto.