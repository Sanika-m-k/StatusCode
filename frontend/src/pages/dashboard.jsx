import { Navbar } from '../components/navbar';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';


export const Dashboard = () => {

  const { user, getAccessTokenSilently } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await getAccessTokenSilently();
        
        // Make API call to backend with the token
        const response = await fetch('http://localhost:5000/api/users/verify', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        const data = await response.json();
        console.log('Response data:', data);
        if (response.ok) {
          setUserInfo(data.user);
          console.log('User info:', data.user);
        } else {
          console.error('Failed to fetch user info:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserInfo();
    }
  }, [user, getAccessTokenSilently]);

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