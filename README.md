# WAREMAP ADMIN (2D)

Aplicación independiente para la demostración del proyecto WAREMAP. Permite editar las **mismas 105 ubicaciones** de Supabase sin cambiar la aplicación de visualización.

## Preparación

1. En Supabase > Authentication > Users, crea un usuario con email y contraseña (confirma el correo si tu proyecto lo requiere). Copia su **User UID**.
2. En Supabase > SQL Editor, ejecuta `admin_permisos.sql` completo. Luego ejecuta esta consulta reemplazando el UUID por el UID real:
   ```sql
   insert into public.waremap_admins(user_id) values ('AQUI-EL-UUID-REAL') on conflict do nothing;
   ```
3. Abre el `app.js` de tu WAREMAP original: localiza `API_CONFIG` y copia solo la URL y la **publishable key** pública, nunca la contraseña, la `service_role` ni claves `sb_secret_`.
4. En este proyecto abre `config.js`, pega ambos valores y guarda.
5. Crea otro repositorio público `WAREMAP-ADMIN` en GitHub. Sube los archivos y la carpeta `assets/` conservando `index.html` en la raíz.
6. Settings > Pages > Deploy from a branch > main > /(root) > Save.
7. Visita `https://sebagox07.github.io/WAREMAP-ADMIN/`, inicia sesión y selecciona una posición en el mapa. Edita y guarda. En WAREMAP se reflejará automáticamente en aprox. 15 segundos.

## Uso

- Verde = ocupado, blanco = vacío, amarillo = seleccionado.
- Puedes agregar, eliminar y editar varios productos dentro de una ubicación, incluida la familia de films y etiquetas del Rack 05.
- Al liberar una ubicación se guarda `tipo3d='vacio'` y `productos=[]`.
- Los cambios se aplican a la base real; usa datos ficticios y guarda copia antes de una demostración.
- La contraseña no se guarda en archivos; el token de acceso se mantiene solo en memoria de la pestaña y se pierde al recargar.
- Sesión breve: si expira el token, cierra sesión e inicia de nuevo.

## Seguridad

- No publiques claves secretas, contraseñas ni tokens en GitHub.
- `anon` solo tiene `SELECT`; únicamente miembros de `waremap_admins` autenticados pueden editar `tipo3d` y `productos`.
- El administrador requiere políticas RLS; no basta un botón de login.
- La lectura anónima sigue activada en la aplicación WAREMAP: usa **solo datos ficticios**, nunca inventario real privado.
- La edición del `jsonb` de productos reemplaza el arreglo completo de esa ubicación: no edites la misma ubicación simultáneamente desde dos ventanas.
