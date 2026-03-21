# A/B Testing Infrastructure - Beneficios Medicare

Este repositorio incluye un marco de pruebas A/B ligero diseñado para Cloudflare Pages estático. Sin renderizado del lado del servidor requerido.

## Descripción General

El sistema de pruebas A/B funciona mediante:
1. **Asignación de variantes** a visitantes usando cookies persistentes (persiste entre sesiones)
2. **Aplicación de cambios DOM** basados en la asignación de variantes
3. **Seguimiento de resultados** en Google Analytics 4 con dimensiones personalizadas
4. **Configuración** mediante un simple objeto JavaScript en la parte superior de `ab-testing.js`

## Ubicación del Archivo

- **Framework**: `/ab-testing.js` (cargado en index.html)
- **ID de Propiedad GA4**: `G-VG5N9NKWPF` (Beneficios Medicare)

## Inicio Rápido: Definir una Nueva Prueba

### 1. Abra `/ab-testing.js`

### 2. Agregue su prueba al objeto de configuración `AB_TESTS`

**Ejemplo: Pruebe un nuevo titular de héroe**

```javascript
const AB_TESTS = {
  'titular-hero-v1': {
    enabled: true,
    variants: {
      control: {
        // Control = sin cambios (experiencia original)
      },
      variant_a: {
        selector: '.hero-banner h1',
        innerHTML: 'Encuentra Tu Plan de Medicare Perfecto Hoy'
      },
      variant_b: {
        selector: '.hero-banner h1',
        innerHTML: 'Obtén Ayuda Experta en Medicare Gratis'
      }
    },
    traffic: 0.5,  // 50% de visitantes ven la prueba (50% control, 25% var_a, 25% var_b)
    duration: 30   // Opcional: duración de seguimiento en días
  }
};
```

### 3. Cambios de Variante Soportados

Puede modificar elementos de varias maneras:

```javascript
// Cambiar contenido HTML
innerHTML: 'Nuevo texto de encabezado'

// Cambiar solo texto (sin etiquetas HTML)
textContent: 'Texto sin formato'

// Reemplazar todas las clases
className: 'nombre-nueva-clase'

// Agregar clases sin reemplazar las existentes
addClass: 'clase-destacada'  // o ['clase1', 'clase2']

// Establecer atributos HTML (href, src, data-*, etc.)
setAttribute: {
  'href': 'https://url-nueva.com',
  'target': '_blank',
  'data-prueba': 'valor'
}

// Aplicar estilos CSS en línea
style: {
  'color': '#FF0000',
  'font-weight': 'bold',
  'display': 'none'
}

// Establecer atributos de datos
dataset: {
  'idPrueba': 'mi-valor',
  'variante': 'a'
}
```

### 4. Desplegar

Simplemente confirme e impulse. La asignación de variantes ocurre automáticamente en la primera visita.

## Prueba de su Experimento

### Ver Asignaciones en la Consola del Navegador

```javascript
// Ver su asignación(es) de variante actual
ABTestInfo()

// Ejemplo de salida:
// {
//   assignments: { 'titular-hero-v1': 'variant_a' },
//   cookies: [{ name: 'titular-hero-v1', variant: 'variant_a' }]
// }
```

### Forzar una Variante Específica

Útil para QA y prueba de diferentes variaciones:

```javascript
// Forzar variante para prueba
ForceVariant('titular-hero-v1', 'variant_b')

// Luego recargue la página para ver cambios
```

### Limpiar Asignaciones de Prueba

Para reiniciar y obtener una nueva asignación aleatoria:

```javascript
// Limpiar todas las pruebas
ClearABTests()

// Limpiar una prueba específica
ClearABTests('titular-hero-v1')

// Luego recargue
```

## Verificar Resultados en Google Analytics 4

### 1. Navegue a la Propiedad GA4

- Vaya a [Google Analytics](https://analytics.google.com)
- Seleccione propiedad: `G-VG5N9NKWPF` (Beneficios Medicare)

### 2. Ver Datos de Prueba

**Opción A: Usando Informe de Eventos**
- Barra lateral izquierda → Informes → Eventos
- Busque evento: `ab_test_assigned`
- Filtrar por parámetro de evento: `test_name`

**Opción B: Usando Exploraciones**
- Barra lateral izquierda → Explorar → Crear Nueva Exploración
- Seleccione plantilla "Formulario Libre"
- Dimensiones: `test_name`, `ab_variant`
- Métricas: `Sesiones`, `Recuento de Eventos`, `Tasa de Conversión`
- Comparar variantes por dimensión `ab_variant`

**Opción C: Usando Informes Personalizados**
- Crear informe personalizado filtrando por dimensiones personalizadas:
  - `ab_test` = nombre de la prueba
  - `ab_variant` = nombre de variante

### 3. Métricas para Monitorear

- **Sesiones por variante**: La distribución igual significa prueba justa
- **Tasa de conversión**: ¿Qué variante impulsa mejores resultados?
- **Tasa de rebote**: ¿Las variantes afectan el compromiso?
- **Recuento de eventos**: ¿Cómo difieren las interacciones?
- **Vistas de página**: ¿Cómo difiere el flujo?

### 4. Significancia Estadística

Para que un resultado sea significativo:
- Ejecute durante al menos 2-4 semanas (variaciones estacionales)
- Apunte a 1,000+ sesiones por variante mínimo
- Monitoree niveles de confianza (>95% es bueno)

## Finalizar una Prueba y Elegir un Ganador

### 1. Recopilar Resultados (2-4 semanas)

Use GA4 para monitorear tasas de conversión, tasa de rebote y métricas de compromiso.

### 2. Analizar en GA4

Compare sus métricas entre variantes. Busque significancia estadística (confianza >95%).

### 3. Tomar Decisión

Una vez que tenga un ganador claro:

**Si Control Gana (o sin ganador claro):**
- Mantener original sin cambios
- Eliminar prueba de configuración `AB_TESTS`
- Eliminar asignación de cookie: `ClearABTests('nombre-prueba')`

**Si Variante Gana:**
- Actualizar versión permanente en su HTML
- Lanzar al 100% de visitantes

### 4. Desplegar Ganador

```javascript
// Opción A: Lanzar variante al 100% (convertirla en control)
const AB_TESTS = {
  'titular-hero-v1': {
    enabled: false  // Deshabilitar prueba - ahora al 100% para todos
  }
};

// Luego actualizar su HTML directamente con el texto/diseño ganador
// Y eliminar completamente la prueba de AB_TESTS
```

### 5. Limpiar

Una vez desplegado:
- Eliminar la prueba de configuración `AB_TESTS`
- Eliminar cookies de prueba antiguas
- Documentar el resultado en su mensaje de confirmación

## Ejemplo: Flujo de Prueba Completo

### Configuración (Día 1)
```javascript
const AB_TESTS = {
  'prueba-color-cta': {
    enabled: true,
    variants: {
      control: {},
      variant_a: {
        selector: '.cta-button',
        setAttribute: { 'style': 'background-color: #FF6B35;' }
      }
    },
    traffic: 0.5
  }
};
```

### Prueba (Días 2-3)
```javascript
// Probar cada variante en consola
ForceVariant('prueba-color-cta', 'control')  // recargue
ForceVariant('prueba-color-cta', 'variant_a')  // recargue
```

### Monitoreo (Días 4-28)
- Verificar GA4 diariamente para recopilación de datos
- Monitorear tasas de conversión
- Vigilar problemas

### Análisis (Día 29)
- Variante A: tasa de conversión del 8.5%
- Control: tasa de conversión del 7.2%
- Ganador: Variante A (mejora del 18%)

### Despliegue (Día 30)
```javascript
// Actualizar código permanente
// En index.html, cambiar color del botón CTA directamente

// Eliminar de AB_TESTS o deshabilitar:
const AB_TESTS = {
  // prueba eliminada
};

// Limpiar cookies
ClearABTests('prueba-color-cta')
```

## Detalles Técnicos

### Estructura de Cookie

Cada prueba almacena una cookie persistente:
- **Nombre**: `ab_test_{nombre-prueba}`
- **Valor**: `control`, `variant_a`, `variant_b`, etc.
- **Expiración**: 365 días desde la última visita
- **Alcance**: Ruta `/` para todas las páginas

### Integración GA4

Las asignaciones de variantes se envían como:
- **Evento**: `ab_test_assigned`
- **Parámetros de evento**:
  - `test_name`: Nombre de la prueba
  - `variant`: Variante asignada
  - `test_date`: Fecha asignada
- **Propiedades de usuario**:
  - `ab_test`: Nombre de prueba más reciente
  - `ab_variant`: Variante más reciente

### Distribución de Tráfico

Cuando `traffic: 0.5`:
- 50% ven la prueba (divididos equitativamente entre variantes)
- 50% ven control (original)

Ejemplo con 3 variantes:
- `traffic: 0.6` → 60% en prueba, 40% control
  - Si 3 variantes: 20% cada una + 40% control

### Compatibilidad de Navegador

Funciona en todos los navegadores modernos (Chrome, Firefox, Safari, Edge). Requiere:
- Cookies habilitadas
- JavaScript habilitado
- Sin marcos especiales

## Solución de Problemas

### ¿La prueba no se aplica?

1. Verificar que el selector sea correcto:
   ```javascript
   // En consola, verificar que el elemento exista
   document.querySelectorAll('.hero-banner h1').length
   // Debe devolver > 0
   ```

2. Limpiar prueba y recargar:
   ```javascript
   ClearABTests('nombre-prueba')
   ```

3. Verificar errores de JS en consola

### ¿GA4 no muestra eventos?

1. Verificar que GA4 esté cargado:
   ```javascript
   typeof gtag !== 'undefined'  // debe ser true
   ```

2. Verificar que el ID de propiedad GA4 sea correcto en ab-testing.js

3. Permitir 24 horas para que los eventos aparezcan en informes (el tiempo real puede mostrar inmediatamente)

### ¿Tráfico sesgado (no 50/50)?

Esto es normal para nuevos visitantes. Después de ejecutar durante una semana, la distribución debería ser aproximadamente igual a medida que más usuarios reciben asignaciones.

## Avanzado: Seguimiento de Eventos Personalizados

Para rastrear eventos personalizados en su variante:

```javascript
variants: {
  variant_a: {
    selector: '.form-button',
    innerHTML: 'Enviar Gratis',
    // Nota: También puede agregar controladores onclick mediante setAttribute
    setAttribute: {
      'onclick': 'gtag("event", "variante_a_clic");'
    }
  }
}
```

## Soporte

Para preguntas sobre el marco o implementación, verifique:
- Consola del navegador: `ABTestInfo()` para asignaciones actuales
- ID de Propiedad GA4: `G-VG5N9NKWPF`
- Archivo de Pruebas AB: `/ab-testing.js`
