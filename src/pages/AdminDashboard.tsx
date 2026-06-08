import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Volunteer } from '@/lib/database.types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVolunteers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('volunteers')
      .select('*, profiles(name, email)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load volunteers');
    } else {
      setVolunteers(data as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('volunteers')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error(`Failed to update status: ${error.message}`);
    } else {
      toast.success(`Volunteer status updated to ${status}`);
      fetchVolunteers();
    }
  };

  const handleToggleExecutive = async (id: string, is_executive: boolean) => {
    const { error } = await supabase
      .from('volunteers')
      .update({ is_executive: !is_executive })
      .eq('id', id);

    if (error) {
      toast.error(`Failed to toggle executive status: ${error.message}`);
    } else {
      toast.success(`Executive status updated`);
      fetchVolunteers();
    }
  };

  return (
    <div className="container mx-auto py-10 pt-24 min-h-screen">
      <h1 className="text-3xl font-heading font-bold text-navy mb-6">Admin Dashboard</h1>
      <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Volunteer Applications</h2>
        
        {loading ? (
          <p className="text-lg">Loading...</p>
        ) : (
          <Table className="text-base">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Executive</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((vol) => (
                <TableRow key={vol.id}>
                  <TableCell className="font-medium">{vol.profiles?.name || 'Unknown'}</TableCell>
                  <TableCell>{vol.profiles?.email || 'Unknown'}</TableCell>
                  <TableCell>{vol.tier}</TableCell>
                  <TableCell>
                    {vol.location_context && typeof vol.location_context === 'object' 
                      ? Object.values(vol.location_context).join(', ') 
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={vol.payment_status === 'Paid' ? 'default' : 'secondary'}>
                      {vol.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      vol.status === 'Approved' ? 'default' : 
                      vol.status === 'Rejected' ? 'destructive' : 'outline'
                    }>
                      {vol.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={vol.is_executive ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => handleToggleExecutive(vol.id, vol.is_executive)}
                    >
                      {vol.is_executive ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {vol.status !== 'Approved' && (
                        <Button size="sm" onClick={() => handleUpdateStatus(vol.id, 'Approved')} className="bg-green-600 hover:bg-green-700">Approve</Button>
                      )}
                      {vol.status !== 'Rejected' && (
                        <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(vol.id, 'Rejected')}>Reject</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {volunteers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">No volunteers found</TableCell>
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
