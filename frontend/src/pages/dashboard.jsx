import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navbar } from '../components/navbar';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../components/ui/dialog.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select.jsx";
import { ChevronDown, Plus, Building } from 'lucide-react';

export const Dashboard = () => {

  const { user, getAccessTokenSilently } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isCreateOrgDialogOpen, setIsCreateOrgDialogOpen] = useState(false);
  const [newOrgData, setNewOrgData] = useState({
    name: '',
    domain: '',
    info: '',
    employeeCount: ''
  });

  // Employee range options
  const employeeRanges = [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "201-500", label: "201-500 employees" },
    { value: "501-1000", label: "501-1000 employees" },
    { value: "1001+", label: "1001+ employees" }
  ];

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await getAccessTokenSilently();
        
        // Make API call to backend with the token
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/verify`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        const data = response.data;
        console.log('Response data:', data);
        setUserInfo(data.user);
        
        // If organizations exist, set the first one as selected
        if (data.user?.organizations && data.user.organizations.length > 0) {
          setSelectedOrg(data.user.organizations[0]);
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

  const handleCreateOrganization = async () => {
    try {
      const token = await getAccessTokenSilently();
      
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/organizations/create`, 
        newOrgData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );
      
      // Update user info with new organization
      const updatedUserInfo = { ...userInfo };
      if (!updatedUserInfo.organizations) {
        updatedUserInfo.organizations = [];
      }
      
      updatedUserInfo.organizations.push(response.data.organization);
      setUserInfo(updatedUserInfo);
      setSelectedOrg(response.data.organization);
      setIsCreateOrgDialogOpen(false);
      
      // Reset form data
      setNewOrgData({
        name: '',
        domain: '',
        info: '',
        employeeCount: ''
      });
      
    } catch (error) {
      console.error('Error creating organization:', error);
      // Handle error (could add error state and display to user)
    }
  };

  const handleOrgChange = (orgId) => {
    const org = userInfo.organizations.find(o => o._id === orgId);
    if (org) {
      setSelectedOrg(org);
      console.log('Selected organization:', org);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrgData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmployeeCountChange = (value) => {
    setNewOrgData(prev => ({
      ...prev,
      employeeCount: value
    }));
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Placeholder data for the dashboard when an organization is selected
  const renderDashboardContent = () => {
    if (!selectedOrg) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
            <CardDescription>Manage your services</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total Services: 0</p>
            <Button className="mt-4">Add Service</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Incidents</CardTitle>
            <CardDescription>Manage incidents and maintenance</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Active Incidents: 0</p>
            <Button className="mt-4">Report Incident</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Status Page</CardTitle>
            <CardDescription>Your public status page</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="mt-4">View Status Page</Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Determine if we should show the "Create Organization" button or organization selector
  const hasOrganizations = userInfo?.organizations && userInfo.organizations.length > 0;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          
          {/* Organization selector or create button */}
          {hasOrganizations ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Building size={16} />
                  {selectedOrg?.name || "Select Organization"}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {userInfo.organizations.map((org) => (
                    <DropdownMenuItem 
                      key={org._id}
                      onClick={() => handleOrgChange(org._id)}
                    >
                      {org.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsCreateOrgDialogOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Create Organization
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setIsCreateOrgDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              Create Organization
            </Button>
          )}
        </div>
        
        {/* Welcome message */}
        <p className="mb-4">Welcome, {user?.name === user?.email ? 'User' : user?.name}!</p>
        
        {/* Show empty state or organization content */}
        {!hasOrganizations ? (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Create your first organization to manage services and incidents</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button size="lg" onClick={() => setIsCreateOrgDialogOpen(true)}>
                <Plus size={16} className="mr-2" />
                Create Organization
              </Button>
            </CardContent>
          </Card>
        ) : (
          renderDashboardContent()
        )}
        
        {/* Create Organization Dialog */}
        <Dialog open={isCreateOrgDialogOpen} onOpenChange={setIsCreateOrgDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Organization</DialogTitle>
              <DialogDescription>
                Add a new organization to manage services and incidents.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newOrgData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Organization name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="domain" className="text-right">
                  Domain
                </Label>
                <Input
                  id="domain"
                  name="domain"
                  value={newOrgData.domain}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="info" className="text-right">
                  Info
                </Label>
                <Input
                  id="info"
                  name="info"
                  value={newOrgData.info}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Brief description"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeeCount" className="text-right">
                  Size
                </Label>
                <Select 
                  onValueChange={handleEmployeeCountChange}
                  value={newOrgData.employeeCount}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateOrganization}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};