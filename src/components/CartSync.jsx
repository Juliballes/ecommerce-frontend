import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { fetchCart } from '../store/slices/cartSlice';

const CartSync = () => {
  const { token } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart(token));
  }, [dispatch, token]);

  return null;
};

export default CartSync;
