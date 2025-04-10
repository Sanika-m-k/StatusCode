import { Navbar } from '../components/navbar';

export const HomePage = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to StatusPage</h1>
        <p className="mb-4">Monitor the status of your services in real-time.</p>
        <p>This is the public-facing page that shows service statuses. The detailed dashboard is available after login.</p>
      </div>
    </div>
  );
};