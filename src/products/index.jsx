// pages/UsersPage.jsx
import React from 'react';
import { ProductsProvider } from '../context/ProductsContext.jsx';
import ProductsView from './ProductsView.jsx';

const ProductsPage = () => {
  return (
    <ProductsProvider>
        <ProductsView />
    </ProductsProvider>
  );
};

export default ProductsPage;