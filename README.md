El proyecto está organizado en varias carpetas principales:
pages/ contiene las páginas asociadas a las rutas de la aplicación (Home, ProductDetail, Carrito, Login, Register, AgregarProducto, entre otras).

components/ contiene los componentes reutilizables utilizados por las páginas y otras partes de la interfaz (Navbar, ProductList, ProductListCategoria, CardProductos, etc.).

redux/ contiene la configuración del store, slices y lógica de estado global de la aplicación.

services/ centraliza las llamadas a la API y la comunicación con el backend.

assets/ almacena imágenes, íconos y otros recursos estáticos.

El estado de carrito y favoritos se gestiona mediante Redux.

Se implementó el uso de cookies HttpOnly.
El backend valida email/pass y responde con una cookie. Lee (el backend) el JWT desde la cookie en JwtFilter.
Cada request protegido manda la cookie automáticamente con credentials: 'include'.
El frontend ya no guarda JWT en localStorage.

