import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from '@mui/material';

interface Order {
  id: number;
  item: string;
  orderId: string;
  status: 'Delivered' | 'In Transit' | 'Pending';
}

const orders: Order[] = [
  { id: 1, item: 'Voices Tee', orderId: '#DUG4567', status: 'Delivered' },
  { id: 2, item: 'Voices Tee', orderId: '#DUG4567', status: 'Delivered' },
  { id: 3, item: 'DuGod Cap', orderId: '#DUG8910', status: 'In Transit' },
];

export const RecentOrders = () => {
  return (
    <Paper sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #eaeaea' }}>
        Recent Orders
      </Typography>
      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: 'black' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>#</TableCell>
              <TableCell sx={{ color: 'white' }}>Item</TableCell>
              <TableCell sx={{ color: 'white' }}>Order ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.item}</TableCell>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    size="small"
                    sx={{
                      bgcolor: order.status === 'Delivered' ? '#2FD65D' : 
                             order.status === 'In Transit' ? '#FFB800' : '#999',
                      color: 'white',
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}; 