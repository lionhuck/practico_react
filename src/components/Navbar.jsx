// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';

function Navbar() {
  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      url: '/'
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      url: '/users'
    },
    {
      label: 'Productos',
      icon: 'pi pi-shopping-cart',
      url: '/products'
    }
  ];


  return (
    <Menubar 
      model={items.map(item => ({
        ...item,
        template: <Link to={item.url} className="p-menuitem-link">
          <span className={item.icon}></span>
          <span>{item.label}</span>
        </Link>
      }))}
    />
  );
}

export default Navbar;