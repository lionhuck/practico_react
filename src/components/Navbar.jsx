// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';

function Navbar() {
  const items = [
    {
      label: 'Auth',
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Login',
          icon: 'pi pi-fw pi-sign-in',
          url: '/login'
        },
        {
          label: 'Register',
          icon: 'pi pi-fw pi-user-plus',
          url: '/register'
        }
      ]
    },
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
    },
    {
      label: 'Ventas',
      icon: 'pi pi-dollar',
      url: '/sales'
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