import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Mail, Calendar, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface UserDetails {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      toast.error('Failed to load user details');
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="container mx-auto p-6">
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">User not found</p>
              <Button className="mt-4" onClick={() => navigate('/admin')}>
                Back to Admin Panel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/admin')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin Panel
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              User Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  Username
                </div>
                <p className="text-lg font-medium">{user.username}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <p className="text-lg font-medium">{user.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Role
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'ADMIN'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </div>
                <p className="text-lg font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetail;
