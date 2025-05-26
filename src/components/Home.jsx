import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
<div className="flex flex-wrap justify-content-center align-items-center mt-5">
      <Card title="PRODUCTOS" className="w-20rem">
        <p>Aca podras ver todos los productos</p>
        <Link to="/products">
          <Button label="Ver productos" />
        </Link>
      </Card>
      <Card title="USUARIOS" className="w-20rem">
        <p>Aca podras ver a todos los usuarios</p>
        <Link to="/users">
          <Button label="Ver usuarios" />
        </Link>
      </Card>
    </div>
  );
};

export default Home;
