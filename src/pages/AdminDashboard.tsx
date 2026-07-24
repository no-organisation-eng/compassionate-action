import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Volunteer, Profile } from '@/lib/database.types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    // Fetch profiles and their associated volunteer data
    const { data, error } = await supabase
      .from('profiles')
      .select('*, volunteers(*)')
      .order('created_at', { ascending: false });

    if (error) {
      setErrorMsg(error.message || JSON.stringify(error));
      toast.error('Failed to load users. Ensure RLS policies are updated.');
    } else {
      setErrorMsg(null);
      setUsers(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (profileId: string) => {
    const tier = window.prompt("Enter Volunteer Tier (e.g., Unit Volunteer, State Volunteer):", "Unit Volunteer");
    if (!tier) return;

    const { error } = await supabase.from('volunteers').upsert({
      profile_id: profileId,
      tier: tier,
      payment_status: 'Paid',
      status: 'Approved'
    }, { onConflict: 'profile_id' });

    if (error) {
      toast.error(`Failed to approve user: ${error.message}`);
    } else {
      toast.success("User successfully approved and marked as paid!");
      fetchUsers();
    }
  };

  const handleEvictToggle = async (profileId: string, currentlyEvicted: boolean) => {
    const newStatus = !currentlyEvicted;
    const { error } = await supabase
      .from('profiles')
      .update({ is_evicted: newStatus })
      .eq('id', profileId);

    if (error) {
      toast.error(`Failed to update eviction status: ${error.message}`);
    } else {
      toast.success(`User ${newStatus ? 'evicted' : 'pardoned'} successfully!`);
      fetchUsers();
    }
  };

  return (
    <div className="container mx-auto py-10 pt-24 min-h-screen">
      <h1 className="text-3xl font-heading font-bold text-navy mb-6">Admin Dashboard</h1>
      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Database Access Error</p>
          <p className="text-sm">Please ensure you have run the provided SQL script in your Supabase Dashboard to allow admins to view all profiles.</p>
          <p className="text-xs mt-2 text-red-500 font-mono">{errorMsg}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">All Community Users</h2>
        
        {loading ? (
          <p className="text-lg">Loading...</p>
        ) : (
          <Table className="text-base">
            <TableHeader>
              <TableRow>
                <TableHead>User Details</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Volunteer Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const volData = user.volunteers && user.volunteers.length > 0 ? user.volunteers[0] : null;
                const isApproved = volData?.status === 'Approved';
                const isEvicted = user.is_evicted === true;

                return (
                  <TableRow key={user.id} className={isEvicted ? "opacity-50 bg-red-50" : ""}>
                    <TableCell>
                      <div className="font-medium text-navy">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400">{user.country || 'Unknown Location'}</div>
                    </TableCell>
                    <TableCell>
                      {user.is_admin ? (
                        <Badge className="bg-gold text-navy hover:bg-gold/80">Admin</Badge>
                      ) : (
                        <Badge variant="outline">Member</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {volData ? (
                        <div className="flex flex-col gap-1 items-start">
                          <Badge variant={isApproved ? 'default' : 'secondary'}>
                            {volData.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {volData.tier} - {volData.payment_status}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No Application</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {!isApproved && (
                          <Button 
                            size="sm" 
                            onClick={() => handleApprove(user.id)} 
                            className="bg-green-600 hover:bg-green-700"
                            disabled={isEvicted}
                          >
                            Approve
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant={isEvicted ? "outline" : "destructive"} 
                          onClick={() => handleEvictToggle(user.id, isEvicted)}
                        >
                          {isEvicted ? "Pardon (Un-evict)" : "Evict"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">No users found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
