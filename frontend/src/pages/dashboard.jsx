import { Navbar } from '../components/navbar';
import { useAuth0 } from '@auth0/auth0-react';

export const Dashboard = () => {
  const { user } = useAuth0();

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="mb-4">Welcome, {user?.name}!</p>
        <p>This is your status page dashboard. Here you can manage your services and incidents.</p>
      </div>
    </div>
  );
};