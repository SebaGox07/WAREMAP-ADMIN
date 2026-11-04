
# 🛠️ WAREMAP ADMIN — Administración de Ubicaciones

**Proyecto de Título | Ingeniería en Informática | IPCHILE**

🌐 **[Abrir WAREMAP ADMIN](https://sebagox07.github.io/WAREMAP-ADMIN/)**

---

## 📖 Descripción

**WAREMAP ADMIN** es una aplicación web desarrollada como complemento administrativo de **WAREMAP**, el sistema de visualización y consulta de racks de bodega.

Su propósito es permitir la administración de los datos de demostración utilizados por WAREMAP, manteniendo separadas las funciones de consulta y edición.

La aplicación permite que usuarios autorizados puedan modificar productos, cantidades y tipos de almacenamiento asociados a las ubicaciones.

Ambas aplicaciones se encuentran publicadas en GitHub Pages y comparten una misma base de datos **Supabase**, mediante API REST.

La información utilizada corresponde a un prototipo académico y no está conectada directamente con Microsoft Dynamics 365.

---

## 🎯 Objetivo

Proporcionar una interfaz administrativa que permita mantener actualizada la información de las ubicaciones utilizadas por WAREMAP, mediante operaciones controladas y autenticación de usuarios.

WAREMAP ADMIN fue desarrollado para facilitar las pruebas y demostraciones del prototipo sin incorporar funciones de modificación dentro de la aplicación principal.

---

## 🚀 Funcionalidades principales

### 🔐 Inicio de sesión

- Autenticación mediante Supabase Auth.
- Acceso administrativo para usuarios autorizados.
- Comprobación de permisos mediante políticas de seguridad.
- Separación entre consulta pública y administración.

### 🗺️ Mapa administrativo 2D

- Representación de los racks y sus ubicaciones.
- Identificación visual de posiciones ocupadas y vacías.
- Selección interactiva de posiciones.
- Visualización de la ubicación actualmente seleccionada.

Los colores utilizados son:

| Color | Significado |
|---|---|
| 🟢 Verde | Ubicación ocupada |
| ⚪ Blanco | Ubicación vacía |
| 🟡 Amarillo | Ubicación seleccionada |

### 🔎 Búsqueda de ubicaciones

Permite buscar por:

- Código de ubicación.
- SKU.
- Nombre del producto.

Esto facilita localizar una posición antes de realizar modificaciones.

### 📦 Administración de productos

Desde una ubicación seleccionada es posible:

- Agregar productos.
- Modificar productos existentes.
- Eliminar productos.
- Editar SKU.
- Editar nombre del producto.
- Modificar cantidades.
- Modificar unidades de medida.
- Administrar varios productos en una misma ubicación.

### 🏷️ Tipos de almacenamiento

El sistema permite modificar el tipo de representación asociado a una ubicación.

Entre los tipos contemplados se encuentran:

- Ubicación vacía.
- Big bag.
- Rollos de etiquetas.
- Rollos de sachet o film.

### 🧹 Liberación de ubicaciones

La aplicación permite liberar una posición, eliminando los productos de demostración asociados.

Esta operación deja los siguientes valores:

```javascript
tipo3d = "vacio"
productos = []
```

### 💾 Guardado de cambios

Los cambios realizados se almacenan en Supabase mediante API REST.

Una vez guardados, la aplicación principal WAREMAP puede consultar la información actualizada.

---

## 🏗️ Estructura de la bodega

WAREMAP ADMIN administra las mismas ubicaciones representadas por WAREMAP Online.

| Elemento | Cantidad |
|---|---:|
| Racks | 5 |
| Niveles por rack | 3 |
| Posiciones por nivel | 7 |
| **Total de ubicaciones** | **105** |

Ejemplo de identificación:

`R02-N1-P05`

- `R02`: Rack 02.
- `N1`: Nivel 1.
- `P05`: Posición 05.

---

## 💻 Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| HTML5 | Estructura de la interfaz |
| CSS3 | Diseño visual |
| JavaScript | Lógica administrativa |
| Supabase Auth | Autenticación de usuarios |
| PostgreSQL | Almacenamiento de información |
| API REST / PostgREST | Consulta y actualización de datos |
| Row Level Security (RLS) | Control de permisos |
| GitHub Pages | Publicación web |

---

## 📂 Estructura del proyecto

```text
WAREMAP-ADMIN/
│
├── index.html
├── style.css
├── app.js
├── config.js
│
├── assets/
│   └── logo-waremap.png
│
├── admin_permisos.sql
├── .nojekyll
└── README.md
```

**Descripción de los archivos:**

- `index.html`: interfaz de inicio de sesión, mapa y formulario de edición.
- `style.css`: diseño de la aplicación administrativa.
- `app.js`: autenticación, búsqueda, lectura y modificación de ubicaciones.
- `config.js`: configuración de conexión con Supabase.
- `admin_permisos.sql`: configuración de permisos administrativos.
- `assets/`: recursos gráficos de la aplicación.

---

## 🧭 Cómo utilizar WAREMAP ADMIN

1. Ingresar a **[WAREMAP ADMIN](https://sebagox07.github.io/WAREMAP-ADMIN/)**.
2. Iniciar sesión con una cuenta administradora autorizada.
3. Buscar o seleccionar una ubicación en el mapa 2D.
4. Revisar los productos asociados.
5. Modificar los datos necesarios.
6. Presionar **Guardar cambios**.
7. Abrir WAREMAP Online para comprobar la actualización.

Los cambios deberían reflejarse en WAREMAP durante su siguiente consulta automática, aproximadamente cada 15 segundos.

---

## ⚙️ Configuración para una instalación nueva

> La instalación publicada ya se encuentra funcionando. Estos pasos se incluyen únicamente como documentación técnica.

### 1. Base de datos

Utilizar el mismo proyecto Supabase configurado para WAREMAP Online.

La aplicación trabaja sobre la tabla:

`public.ubicaciones`

### 2. Autenticación

Crear un usuario desde:

**Supabase → Authentication → Users**

### 3. Permisos administrativos

Ejecutar el archivo `admin_permisos.sql` desde SQL Editor.

Posteriormente, registrar el UUID del usuario autorizado:

```sql
insert into public.waremap_admins (user_id)
values ('UUID_DEL_USUARIO_AUTORIZADO')
on conflict do nothing;
```

### 4. Configuración de conexión

Configurar `config.js` con:

- URL pública del proyecto Supabase.
- Clave publicable correspondiente.

No se deben incluir contraseñas ni claves secretas.

### 5. Publicación

Publicar los archivos mediante GitHub Pages utilizando la rama `main` y la carpeta raíz.

### 6. Verificación

Comprobar:

- Inicio de sesión.
- Permisos administrativos.
- Carga de las ubicaciones.
- Búsqueda de productos.
- Edición de información.
- Guardado de cambios.
- Actualización posterior en WAREMAP Online.

---

## 🔒 Seguridad

WAREMAP ADMIN utiliza mecanismos de autenticación y autorización para restringir las operaciones administrativas.

Entre las medidas consideradas se encuentran:

- Inicio de sesión mediante Supabase Auth.
- Identificación de usuarios administradores.
- Políticas Row Level Security (RLS).
- Restricción de operaciones de actualización.
- Uso de claves públicas en el frontend.

**Consideraciones importantes:**

- No publicar contraseñas.
- No incluir claves `service_role` o `sb_secret_` en GitHub.
- Mantener correctamente configuradas las políticas RLS.
- Evitar editar simultáneamente una misma ubicación desde distintas sesiones.
- Utilizar datos ficticios para las demostraciones.
- Mantener respaldos antes de realizar modificaciones importantes.

---

## 🔄 Relación con WAREMAP Online

Las dos aplicaciones comparten la misma tabla de ubicaciones de Supabase.

### Funcionamiento general

```text
       WAREMAP ADMIN
              |
              | Modifica información
              v
     SUPABASE / PostgreSQL
       public.ubicaciones
              |
              | API REST
              v
        WAREMAP ONLINE
              |
              v
     Visualización 2D y 3D
     Búsqueda y consulta
```

**WAREMAP ADMIN** administra los datos del prototipo.

**WAREMAP Online** consulta y representa visualmente esos mismos datos.

Esto permite mantener una separación entre las funciones de administración y las funciones de consulta.

🌐 **[Abrir WAREMAP Online](https://sebagox07.github.io/WAREMAP/)**

---

## 📌 Alcance y limitaciones

WAREMAP ADMIN forma parte de un prototipo académico desarrollado para demostrar la administración y actualización de ubicaciones.

Actualmente:

- Permite administrar datos simulados.
- Comparte información con WAREMAP Online.
- Utiliza autenticación y permisos administrativos.
- No registra movimientos logísticos reales.
- No modifica inventarios de Microsoft Dynamics 365.
- No reemplaza un WMS o ERP.

La integración directa con Microsoft Dynamics 365 queda considerada como una posible mejora futura.

---

## 📊 Estado del proyecto

**Estado actual: Aplicación administrativa funcional y publicada.**

WAREMAP ADMIN se encuentra disponible mediante GitHub Pages y su comunicación con WAREMAP Online ha sido comprobada durante el desarrollo.

Forma parte del proyecto de título de **Ingeniería en Informática de IPCHILE**.

---

## 👨‍💻 Autor

**Sebastián González**

Proyecto de Título — Ingeniería en Informática  
IPCHILE — Chile

---

*WAREMAP ADMIN — Administración de datos para la visualización de ubicaciones de almacenamiento.*
