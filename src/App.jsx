import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Carrito from './pages/Carrito';
import Login from './pages/Login';
import Register from './pages/Register';
import AgregarProducto from './pages/AgregarProducto';
import './App.css';

// App define todas las rutas de la aplicación
// Routes agrupa las rutas, Route define cada una con su path y componente
function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* Ruta home: muestra el listado de productos y categorías */}
        <Route path="/" element={<Home />} />

        {/* Ruta dinámica: :id es el parámetro del producto */}
        <Route path="/products/:id" element={<ProductDetail />} />

        {/* Carrito de compras */}
        <Route path="/carrito" element={<Carrito />} />

        {/* Login y registro */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Solo para admin: agregar producto */}
        <Route path="/admin/agregar-producto" element={<AgregarProducto />} />
      </Routes>
    </div>
  );
}

export default App;
