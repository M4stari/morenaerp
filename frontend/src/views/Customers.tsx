import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { customersAPI } from '../api/client';
import { useNotification } from '../context/NotificationContext';

const Customers: React.FC = () => {
  const { showNotification } = useNotification();
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
  });

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await customersAPI.list({ limit: 100 });
      setCustomers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Erro ao carregar clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenDialog = (customer?: any) => {
    setFormError(null);
    if (customer) {
      setEditingId(customer.id);
      setFormData({
        name: customer.name || '',
        cpf: customer.cpf || '',
        email: customer.email || '',
        phone: customer.phone || '',
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', cpf: '', email: '', phone: '' });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setFormData({ name: '', cpf: '', email: '', phone: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);

    try {
      const payload = {
        name: formData.name,
        cpf: formData.cpf,
        email: formData.email || null,
        phone: formData.phone || null,
      };

      if (editingId) {
        await customersAPI.update(editingId, payload);
        showNotification('Cadastro da cliente atualizado com sucesso.', 'success');
      } else {
        await customersAPI.create(payload);
        showNotification('Nova cliente cadastrada com sucesso.', 'success');
      }
      fetchCustomers();
      handleCloseDialog();
    } catch (err: any) {
      setFormError(err.response?.data?.detail || err.message || 'Erro ao salvar cliente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza de que deseja excluir esta cliente?')) return;

    try {
      await customersAPI.delete(id);
      showNotification('Cliente excluída com sucesso.', 'success');
      fetchCustomers();
    } catch (err: any) {
      showNotification(
        `Erro ao excluir cliente: ${err.response?.data?.detail || err.message}`,
        'error'
      );
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.cpf.includes(query) ||
      (customer.email && customer.email.toLowerCase().includes(query))
    );
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Page Header */}
      <Card sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography
              sx={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.35em',
                color: '#FF43A3',
                fontWeight: 700,
              }}
            >
              Relacionamento
            </Typography>
            <Typography variant="h2" sx={{ mt: 1.5, fontSize: '2.5rem', color: '#ffffff' }}>
              Clientes da Boutique
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              Centralize cadastros, histórico e vínculos comerciais em uma base organizada.
            </Typography>
          </Box>
          <Box
            sx={{
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.05)',
              p: 2.5,
              fontSize: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.4)',
            }}
          >
            <PeopleIcon fontSize="large" />
          </Box>
        </Box>
      </Card>

      {/* Filter and Add Bar */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Buscar clientes por nome, CPF ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <IconButton onClick={fetchCustomers} color="inherit" sx={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', p: 1.8 }}>
          <RefreshIcon />
        </IconButton>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ py: 1.8, px: 3, borderRadius: '16px' }}
        >
          Nova cliente
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: '16px' }}>
          {error}
        </Alert>
      )}

      {/* Customers Table */}
      <TableContainer component={Paper} sx={{ borderRadius: '28px', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)' }}>
            <TableRow>
              <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Nome</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>CPF</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Email</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Telefone</TableCell>
              <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    Nenhum cliente cadastrado ou correspondente à busca.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02) !important' } }}>
                  <TableCell sx={{ px: 3, py: 2, fontWeight: 600, color: '#ffffff' }}>{customer.name}</TableCell>
                  <TableCell sx={{ px: 3, py: 2, color: 'text.secondary' }}>{customer.cpf}</TableCell>
                  <TableCell sx={{ px: 3, py: 2, color: 'text.secondary' }}>{customer.email || '-'}</TableCell>
                  <TableCell sx={{ px: 3, py: 2, color: 'text.secondary' }}>{customer.phone || '-'}</TableCell>
                  <TableCell align="right" sx={{ px: 3, py: 2 }}>
                    <IconButton onClick={() => handleOpenDialog(customer)} color="primary" sx={{ mr: 1 }}>
                      <EditIcon size="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(customer.id)} color="error">
                      <DeleteIcon size="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Customer Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', pb: 1 }}>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: '#FF43A3', fontWeight: 700 }}>
            Relacionamento
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700 }}>
            {editingId ? 'Editar Cliente' : 'Nova Cliente'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {formError && (
              <Alert severity="error" sx={{ borderRadius: '12px' }}>
                {formError}
              </Alert>
            )}
            <TextField
              name="name"
              label="Nome completo"
              required
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              name="cpf"
              label="CPF"
              required
              fullWidth
              value={formData.cpf}
              onChange={handleInputChange}
            />
            <TextField
              name="email"
              label="E-mail"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              name="phone"
              label="Telefone"
              type="tel"
              fullWidth
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} variant="text" color="inherit" sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={saving}
            startIcon={saving && <CircularProgress size={16} color="inherit" />}
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;
