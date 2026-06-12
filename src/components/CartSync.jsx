import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { clearCart, setCartItems } from '../store/slices/cartSlice';
import { getCart } from '../services/cartApi';

const CartSync = () => {
  const { token } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    let activo = true;

    const cargarCarrito = async () => {
      if (!token) {
        dispatch(clearCart());
        return;
      }

      try {
        const items = await getCart(token);
        if (activo) dispatch(setCartItems(items));
      } catch {
        if (activo) dispatch(clearCart());
      }
    };

    cargarCarrito();

    return () => {
      activo = false;
    };
  }, [dispatch, token]);

  return null;
};

export default CartSync;
