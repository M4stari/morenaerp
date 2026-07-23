import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  Chip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  RemoveCircleOutline as RemoveIcon,
} from '@mui/icons-material';
import { salesAPI, customersAPI, productsAPI } from '../api/client';
import { useNotification } from '../context/NotificationContext';

const Sales: React.FC = () => {
  const { showNotification } = useNotification();
  const [sales, setSales] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sale creation form states
  const [createOpen, setCreateOpen] = useState(false);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const [customerId, setCustomerId] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
  const [installmentCount, setInstallmentCount] = useState(1);
  const [dueDate, setDueDate] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [items, setItems] = useState<any[]>([{ product_id: '', quantity: 1 }]);

  // Installment payment dialog states
  const [payOpen, setPayOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  const [payCount, setPayCount] = useState(1);
  const [paySaving, setPaySaving] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const fetchSales = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await salesAPI.list();
      setSales(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Erro ao carregar vendas.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomersAndProducts = async () => {
    try {
      const [cRes, pRes] = await Promise.all([
        customersAPI.list({ limit: 100 }),
        productsAPI.list({ limit: 100 }),
      ]);
      setCustomers(cRes.data);
      setProducts(pRes.data);
    } catch (err) {
      console.error('Erro ao buscar clientes e produtos', err);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchCustomersAndProducts();
  }, []);

  const handleOpenCreate = () => {
    setFormError(null);
    setCustomerId('');
    setNotes('');
    setPaymentMethod('Dinheiro');
    setInstallmentCount(1);
    setDueDate('');
    setPaymentNotes('');
    setItems([{ product_id: '', quantity: 1 }]);
    setCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setCreateOpen(false);
  };

  const handleAddItem = () => {
    setItems((prev) => [...prev, { product_id: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Form validations
    if (!customerId) {
      setFormError('Selecione um cliente.');
      return;
    }

    const invalidItem = items.some((item) => !item.product_id || item.quantity <= 0);
    if (invalidItem) {
      setFormError('Preencha os produtos e quantidades corretamente.');
      return;
    }

    setFormSaving(true);
    try {
      const payload = {
        customer_id: Number(customerId),
        notes: notes || null,
        payment_method: paymentMethod,
        installment_count: Number(installmentCount),
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        payment_notes: paymentNotes || null,
        items: items.map((item) => ({
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
        })),
      };

      await salesAPI.create(payload);
      showNotification('Venda registrada com sucesso.', 'success');
      fetchSales();
      handleCloseCreate();
    } catch (err: any) {
      setFormError(err.response?.data?.detail || err.message || 'Erro ao registrar venda.');
    } finally {
      setFormSaving(false);
    }
  };

  const handleCancelSale = async (id: number) => {
    if (!window.confirm('Tem certeza de que deseja cancelar esta venda?')) return;

    try {
      await salesAPI.cancel(id);
      showNotification('Venda cancelada com sucesso.', 'success');
      fetchSales();
    } catch (err: any) {
      showNotification(err.response?.data?.detail || err.message || 'Erro ao cancelar venda.', 'error');
    }
  };

  const handleFinalizeSale = async (id: number) => {
    if (!window.confirm('Deseja quitar integralmente as parcelas desta venda?')) return;

    try {
      await salesAPI.finalize(id);
      showNotification('Venda quitada integralmente.', 'success');
      fetchSales();
    } catch (err: any) {
      showNotification(err.response?.data?.detail || err.message || 'Erro ao finalizar venda.', 'error');
    }
  };

  const handleOpenPay = (sale: any) => {
    setPayError(null);
    setSelectedSale(sale);
    const remaining = Math.max(0, sale.installment_count - sale.paid_installments);
    setPayCount(Math.min(1, remaining));
    setPayOpen(true);
  };

  const handleClosePay = () => {
    setPayOpen(false);
    setSelectedSale(null);
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSale) return;

    setPayError(null);
    setPaySaving(true);

    try {
      await salesAPI.payInstallment(selectedSale.id, payCount);
      showNotification(`${payCount} parcela(s) quitada(s) com sucesso.`, 'success');
      fetchSales();
      handleClosePay();
    } catch (err: any) {
      setPayError(err.response?.data?.detail || err.message || 'Erro ao registrar pagamento.');
    } finally {
      setPaySaving(false);
    }
  };

  const handleDeleteSale = async (id: number) => {
    if (!window.confirm('Deseja deletar esta venda permanentemente? O estoque será devolvido.')) return;

    try {
      await salesAPI.delete(id);
      showNotification('Registro de venda excluído.', 'success');
      fetchSales();
    } catch (err: any) {
      showNotification(err.response?.data?.detail || err.message || 'Erro ao excluir venda.', 'error');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString('pt-BR');
  };

  const filteredSales = sales.filter((sale) => {
    const term = searchQuery.toLowerCase();
    const customerName = sale.customer?.name || '';
    const matchesSearch = customerName.toLowerCase().includes(term) || String(sale.id).includes(term);

    const matchesStatus = !filterStatus || sale.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Header */}
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
              Comercial
            </Typography>
            <Typography variant="h2" sx={{ mt: 1.5, fontSize: '2.5rem', color: '#ffffff' }}>
              Gestão de Vendas
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              Monitore faturamento, parcelamentos e controle de quitação por cliente.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{ py: 1.8, px: 3, borderRadius: '16px' }}
          >
            Registrar venda
          </Button>
        </Box>
      </Card>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Buscar por cliente ou ID da venda..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status da Venda</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status da Venda"
          >
            <MenuItem value="">Todos os status</MenuItem>
            <MenuItem value="Pendente">Pendente</MenuItem>
            <MenuItem value="Parcial">Parcial</MenuItem>
            <MenuItem value="Finalizada">Finalizada</MenuItem>
            <MenuItem value="Cancelada">Cancelada</MenuItem>
          </Select>
        </FormControl>
        <IconButton onClick={fetchSales} color="inherit" sx={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', p: 1.8 }}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: '16px' }}>
          {error}
        </Alert>
      )}

      {/* Sales Table */}
      <TableContainer component={Paper} sx={{ borderRadius: '28px', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)' }}>
            <TableRow>
              <TableRow sx={{ display: 'contents' }}>
                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>ID</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Cliente</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Data</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Forma</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Parcelas</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Status</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Total</TableCell>
                <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Ações</TableCell>
              </TableRow>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    Nenhuma venda registrada correspondente à busca.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredSales.map((sale) => {
                const isCancellable = sale.status !== 'Cancelada' && sale.status !== 'Finalizada';
                const isDeletable = sale.status === 'Pendente' || sale.status === 'Parcial';

                return (
                  <TableRow key={sale.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02) !important' } }}>
                    <TableCell sx={{ px: 3, py: 2, fontWeight: 'bold' }}>#{sale.id}</TableCell>
                    <TableCell sx={{ px: 3, py: 2, fontWeight: 600, color: '#ffffff' }}>
                      {sale.customer?.name || 'Cliente Desconhecido'}
                    </TableCell>
                    <TableCell sx={{ px: 3, py: 2, color: 'text.secondary' }}>{formatDate(sale.sale_date)}</TableCell>
                    <TableCell sx={{ px: 3, py: 2, color: 'text.secondary' }}>{sale.payment_method}</TableCell>
                    <TableCell sx={{ px: 3, py: 2, color: 'text.secondary' }}>
                      {sale.paid_installments} / {sale.installment_count}
                    </TableCell>
                    <TableCell sx={{ px: 3, py: 2 }}>
                      <Chip
                        label={sale.status}
                        size="small"
                        sx={{
                          borderRadius: '8px',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          backgroundColor:
                            sale.status === 'Finalizada'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : sale.status === 'Cancelada'
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(245, 158, 11, 0.15)',
                          color:
                            sale.status === 'Finalizada'
                              ? '#a7f3d0'
                              : sale.status === 'Cancelada'
                              ? '#fca5a5'
                              : '#fef3c7',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ px: 3, py: 2, fontWeight: 700, color: '#FF43A3' }}>
                      {formatCurrency(sale.total_amount)}
                    </TableCell>
                    <TableCell align="right" sx={{ px: 3, py: 2 }}>
                      {isCancellable && (
                        <>
                          <IconButton onClick={() => handleOpenPay(sale)} color="warning" title="Pagar Parcela" sx={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', mr: 0.5 }}>
                            <PaymentIcon size="small" />
                          </IconButton>
                          <IconButton onClick={() => handleFinalizeSale(sale.id)} color="success" title="Quitar Venda" sx={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', mr: 0.5 }}>
                            <CheckCircleIcon size="small" />
                          </IconButton>
                          <IconButton onClick={() => handleCancelSale(sale.id)} color="error" title="Cancelar Venda" sx={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', mr: 0.5 }}>
                            <CancelIcon size="small" />
                          </IconButton>
                        </>
                      )}
                      {isDeletable && (
                        <IconButton onClick={() => handleDeleteSale(sale.id)} color="inherit" title="Deletar permanentemente" sx={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                          <DeleteIcon size="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Sale Creation Dialog */}
      <Dialog open={createOpen} onClose={handleCloseCreate} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: '#FF43A3', fontWeight: 700 }}>
            Comercial
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700 }}>
            Registrar Nova Venda
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreateSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {formError && (
              <Alert severity="error" sx={{ borderRadius: '12px' }}>
                {formError}
              </Alert>
            )}

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Selecione a cliente</InputLabel>
                  <Select
                    value={customerId}
                    onChange={(e) => setCustomerId(Number(e.target.value))}
                    label="Selecione a cliente"
                  >
                    {customers.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name} ({c.cpf})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Forma de pagamento</InputLabel>
                  <Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    label="Forma de pagamento"
                  >
                    <MenuItem value="Dinheiro">Dinheiro</MenuItem>
                    <MenuItem value="Pix">Pix</MenuItem>
                    <MenuItem value="Cartão de Crédito">Cartão de Crédito</MenuItem>
                    <MenuItem value="Cartão de Débito">Cartão de Débito</MenuItem>
                    <MenuItem value="Duplicata / Carnê">Duplicata / Carnê</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Número de parcelas"
                  type="number"
                  fullWidth
                  inputProps={{ min: '1', max: '24' }}
                  value={installmentCount}
                  onChange={(e) => setInstallmentCount(Number(e.target.value))}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Data de vencimento"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Notas de pagamento"
                  placeholder="Ex: Entrada de 50%"
                  fullWidth
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Observações gerais"
                  multiline
                  rows={2}
                  fullWidth
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700 }}>Itens da venda</Typography>
              <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={handleAddItem}>
                Adicionar item
              </Button>
            </Box>

            {items.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl sx={{ flexGrow: 1 }}>
                  <InputLabel>Selecione o produto</InputLabel>
                  <Select
                    value={item.product_id}
                    onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                    label="Selecione o produto"
                  >
                    {products.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name} - {p.size} ({formatCurrency(p.sale_price)})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  label="Qtd"
                  type="number"
                  style={{ width: '100px' }}
                  inputProps={{ min: '1' }}
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                />

                {items.length > 1 && (
                  <IconButton onClick={() => handleRemoveItem(index)} color="error">
                    <RemoveIcon />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseCreate} variant="text" color="inherit" sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreateSubmit}
            variant="contained"
            disabled={formSaving}
            startIcon={formSaving && <CircularProgress size={16} color="inherit" />}
          >
            Confirmar Venda
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pay Installment Dialog */}
      <Dialog open={payOpen} onClose={handleClosePay} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: '#FF43A3', fontWeight: 700 }}>
            Quitação Parcial
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700 }}>
            Registrar Pagamento
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handlePaySubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {payError && (
              <Alert severity="error" sx={{ borderRadius: '12px' }}>
                {payError}
              </Alert>
            )}
            {selectedSale && (
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#ffffff' }}>Cliente: {selectedSale.customer?.name}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Quitadas: {selectedSale.paid_installments} de {selectedSale.installment_count} parcelas.
                </Typography>
              </Box>
            )}
            <TextField
              label="Quantidade de parcelas a quitar"
              type="number"
              required
              fullWidth
              inputProps={{ min: '1' }}
              value={payCount}
              onChange={(e) => setPayCount(Number(e.target.value))}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClosePay} variant="text" color="inherit" sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button
            onClick={handlePaySubmit}
            variant="contained"
            disabled={paySaving}
            startIcon={paySaving && <CircularProgress size={16} color="inherit" />}
          >
            Registrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sales;
