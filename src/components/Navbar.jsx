import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  let items = [];

  if (!user) {
    items = [
      { label: 'Inicio', icon: 'pi pi-home', url: '/' },
      { label: 'Login', icon: 'pi pi-sign-in', url: '/login' },
      { label: 'Register', icon: 'pi pi-user-plus', url: '/register' },
    ];
  } else {
    items = [
      { label: 'Inicio', icon: 'pi pi-home', url: '/' },
      { label: 'Productos', icon: 'pi pi-shopping-cart', url: '/products' },
      { label: 'Usuarios', icon: 'pi pi-users', url: '/users' },
      { label: 'Ventas', icon: 'pi pi-dollar', url: '/sales' },
      { label: 'Logout', icon: 'pi pi-sign-out', command: logout },
    ];
  }

  return (
    <Menubar 
      model={items.map(item => ({
        ...item,
        template: <Link to={item.url || "#"} className="p-menuitem-link" onClick={item.command}>
          <span className={item.icon}></span>
          <span>{item.label}</span>
        </Link>
      }))}
    />
  );
}

export default Navbar;
