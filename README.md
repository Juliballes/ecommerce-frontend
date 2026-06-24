
<img width="1147" height="809" alt="image" src="https://github.com/user-attachments/assets/c2aaf525-0937-4da3-9eb5-9b1d90058cfc" />

## Arquitectura y Tecnologías Implementadas

El proyecto se desarrolló utilizando **React** como framework principal para la construcción de una aplicación web de tipo **Single Page Application (SPA)**.

### Estructura del Proyecto

La aplicación se encuentra organizada en carpetas según su responsabilidad:

* **pages/**: contiene las páginas asociadas a las distintas rutas de la aplicación, como Home, Detalle de Producto, Carrito, Login, Registro, Agregar Producto, entre otras.
* **components/**: incluye componentes reutilizables y desacoplados utilizados en toda la interfaz, siguiendo el principio de responsabilidad única (Navbar, ProductList, ProductCard, ProductListCategoria, etc.).
* **redux/**: almacena la configuración del estado global mediante Redux Toolkit, incluyendo slices y store.
* **services/**: centraliza todas las llamadas a la API REST, favoreciendo la reutilización y el mantenimiento del código.
* **assets/**: contiene imágenes, íconos y demás recursos estáticos utilizados por la aplicación.

### Gestión de Estado

Para el manejo del estado global se implementó **Redux Toolkit**:

* Carrito de compras.
* Productos favoritos.
* Persistencia y sincronización de datos con el backend.

Además, se utiliza **Context API** para gestionar el estado visual de la sesión del usuario y compartir información entre componentes sin necesidad de prop drilling.

### Navegación y Enrutamiento

La navegación se implementó mediante **React Router**, permitiendo:

* Navegación SPA sin recarga de página.
* Rutas dinámicas mediante `useParams`.
* Navegación programática mediante `useNavigate`.
* Implementación de rutas protegidas para funcionalidades que requieren autenticación.

### Integración con API REST

La aplicación consume servicios REST utilizando llamadas asíncronas basadas en promesas (`async/await`), gestionando la comunicación entre frontend y backend para operaciones como:

* Autenticación de usuarios.
* Consulta y filtrado de productos.
* Visualización de detalles de productos.
* Gestión del carrito de compras.
* Checkout y procesamiento de pedidos.
* Administración de favoritos.

### Autenticación y Seguridad

Se implementó un mecanismo de autenticación basado en **JWT almacenado en cookies HttpOnly**, mejorando la seguridad de la aplicación.

Características implementadas:

* El backend valida las credenciales (email y contraseña).
* Una vez autenticado, el backend genera un JWT y lo almacena en una cookie HttpOnly.
* El token no se almacena en `localStorage`, `sessionStorage` ni en el estado de React.
* Las solicitudes a endpoints protegidos envían automáticamente la cookie mediante `credentials: 'include'`.
* El backend valida el JWT a través de un filtro de seguridad (`JwtFilter`), garantizando la autenticación de cada petición.

### Funcionalidades Principales Implementadas

Se desarrolló un flujo funcional completo que incluye:

* Búsqueda y filtrado de productos.
* Visualización de detalle de producto.
* Gestión de carrito de compras.
* Gestión de productos favoritos.
* Registro e inicio de sesión de usuarios.
* Checkout de compra.
* Administración de productos.
* Persistencia de información en base de datos mediante integración con API REST.

### Buenas Prácticas Aplicadas

Durante el desarrollo se priorizaron los siguientes aspectos:

* Reutilización de componentes.
* Separación de responsabilidades.
* Organización modular del código.
* Uso de hooks (`useState`, `useEffect`, `useContext`).
* Renderizado condicional según estado y permisos.
* Nombres descriptivos y estructura legible.
* Centralización de servicios y lógica de negocio.
* Escalabilidad y facilidad de mantenimiento.

### Experiencia de Usuario

La interfaz fue diseñada para proporcionar una experiencia de usuario clara y funcional, permitiendo una navegación intuitiva a través de las distintas funcionalidades del sistema y garantizando una interacción fluida con los datos obtenidos desde la API.
