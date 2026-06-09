import productPlaceholder from '../assets/product-placeholder.svg';

export function getProductImageSrc(product) {
  const candidates = [
    product?.imagenes?.[0],
    product?.imagen,
    product?.imageUrl,
    product?.imagenUrl,
    product?.urlImagen,
    product?.thumbnail,
  ];

  return candidates.find((src) => typeof src === 'string' && src.trim() !== '') || productPlaceholder;
}

export function mergeProductImages(item, productDetail) {
  if (!productDetail) return item;

  return {
    ...item,
    imagenes: productDetail.imagenes ?? item.imagenes,
    imagen: productDetail.imagen ?? item.imagen,
  };
}
