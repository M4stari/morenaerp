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
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  FileDownload as DownloadIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { stocksAPI } from '../api/client';
import { useNotification } from '../context/NotificationContext';

const Inventory: React.FC = () => {
  const { showNotification } = useNotification();
  const [stocks, setStocks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog actions
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustType, setAdjustType] = useState<'add' | 'remove'>('add');
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState(1);
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustSaving, setAdjustSaving] = useState(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);

  // Edit Product from Stock Dialog
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [editData, setEditData] = useState({
    name: '',
    purchase_price: 0,
    sale_price: 0,
    category: '',
    size: '',
    color: '',
    image_url: '',
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchStocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await stocksAPI.list({ limit: 100 });
      setStocks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Erro ao carregar estoque.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleOpenAdjust = (stock: any, type: 'add' | 'remove') => {
    setAdjustError(null);
    setSelectedStock(stock);
    setAdjustType(type);
    setAdjustQuantity(1);
    setAdjustReason(type === 'add' ? 'Reposição de peças' : 'Retirada para demonstração');
    setAdjustOpen(true);
  };

  const handleCloseAdjust = () => {
    setAdjustOpen(false);
    setSelectedStock(null);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;

    setAdjustError(null);
    setAdjustSaving(true);

    try {
      if (adjustType === 'add') {
        await stocksAPI.addQuantity(selectedStock.id, adjustQuantity, adjustReason);
        showNotification('Estoque adicionado com sucesso.', 'success');
      } else {
        await stocksAPI.removeQuantity(selectedStock.id, adjustQuantity, adjustReason);
        showNotification('Estoque removido com sucesso.', 'success');
      }
      fetchStocks();
      handleCloseAdjust();
    } catch (err: any) {
      setAdjustError(err.response?.data?.detail || err.message || 'Erro ao ajustar estoque.');
    } finally {
      setAdjustSaving(false);
    }
  };

  const handleOpenEdit = async (stock: any) => {
    setEditError(null);
    setEditOpen(true);
    setEditSaving(true);
    try {
      const response = await stocksAPI.getDetails(stock.product_id);
      const details = response.data;
      setSelectedProduct(details);
      setEditData({
        name: details.name || '',
        purchase_price: Number(details.purchase_price || 0),
        sale_price: Number(details.sale_price || 0),
        category: details.category || '',
        size: details.size || '',
        color: details.color || '',
        image_url: details.image_url || '',
      });
    } catch (err: any) {
      setEditError(err.message || 'Erro ao buscar detalhes da peça.');
    } finally {
      setEditSaving(false);
    }
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedProduct(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setEditError(null);
    setEditSaving(true);

    try {
      await stocksAPI.editProduct(selectedProduct.id, {
        name: editData.name,
        purchase_price: Number(editData.purchase_price),
        sale_price: Number(editData.sale_price),
        category: editData.category,
        size: editData.size,
        color: editData.color || null,
        image_url: editData.image_url || null,
      });

      showNotification('Especificação da peça atualizada com sucesso.', 'success');
      fetchStocks();
      handleCloseEdit();
    } catch (err: any) {
      setEditError(err.response?.data?.detail || err.message || 'Erro ao atualizar especificações da peça.');
    } finally {
      setEditSaving(false);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (stocks.length === 0) return;

    const headers = ['Produto', 'Sku', 'Quantidade', 'Custo (compra)', 'Preço (venda)', 'Armazém', 'Margem (%)'];
    const rows = filteredStocks.map((s) => {
      const margin = s.product.purchase_price
        ? (((s.product.sale_price - s.product.purchase_price) / s.product.purchase_price) * 100).toFixed(0)
        : '0';
      return [
        s.product.name,
        s.product.sku,
        s.quantity,
        s.product.purchase_price,
        s.product.sale_price,
        s.warehouse,
        `${margin}%`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `estoque_morena_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Zerado', color: 'error' as const };
    if (quantity <= 5) return { label: 'Baixo', color: 'warning' as const };
    return { label: 'Regular', color: 'success' as const };
  };

  // Calculations
  const inventoryRows = stocks;
  const totalQuantity = stocks.reduce((acc, s) => acc + (s.quantity || 0), 0);
  const totalInventoryValue = stocks.reduce((acc, s) => acc + (s.quantity || 0) * (s.product?.sale_price || 0), 0);
  const lowStockCount = stocks.filter((s) => s.quantity > 0 && s.quantity <= 5).length;
  const emptyStockCount = stocks.filter((s) => s.quantity === 0).length;

  const averageMargin = (() => {
    const valid = stocks.filter((s) => s.product?.purchase_price > 0);
    if (valid.length === 0) return '0';
    const sum = valid.reduce((acc, s) => {
      const margin = ((s.product.sale_price - s.product.purchase_price) / s.product.purchase_price) * 100;
      return acc + margin;
    }, 0);
    return (sum / valid.length).toFixed(0);
  })();

  const filteredStocks = stocks.filter((s) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch =
      s.product.name.toLowerCase().includes(term) ||
      s.product.sku.toLowerCase().includes(term) ||
      s.product.category.toLowerCase().includes(term);

    let matchesStatus = true;
    if (filterStatus === 'baixo') {
      matchesStatus = s.quantity > 0 && s.quantity <= 5;
    } else if (filterStatus === 'vazio') {
      matchesStatus = s.quantity === 0;
    } else if (filterStatus === 'ok') {
      matchesStatus = s.quantity > 5;
    }

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
              Operação
            </Typography>
            <Typography variant="h2" sx={{ mt: 1.5, fontSize: '2.5rem', color: '#ffffff' }}>
              Controle de Estoque
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              Acompanhe o inventário completo dos produtos cadastrados.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" color="inherit" onClick={fetchStocks} startIcon={<RefreshIcon />} sx={{ borderRadius: '16px', py: 1.5, borderColor: 'rgba(255,255,255,0.1)' }}>
              Atualizar
            </Button>
            <Button variant="contained" color="primary" onClick={handleExportCSV} startIcon={<DownloadIcon />} sx={{ borderRadius: '16px', py: 1.5 }}>
              Exportar CSV
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Query Filter and Selection */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Buscar por produto, SKU ou categoria..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status de Estoque</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status de Estoque"
          >
            <MenuItem value="">Todos os produtos</MenuItem>
            <MenuItem value="baixo">Estoque baixo</MenuItem>
            <MenuItem value="ok">Estoque regular</MenuItem>
            <MenuItem value="vazio">Estoque zerado</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: '16px' }}>
          {error}
        </Alert>
      )}

      {/* Metrics Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 3, borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Total Produtos</Typography>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 700, color: '#ffffff' }}>{inventoryRows.length}</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.5)' }}>Itens cadastrados no acervo.</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 3, borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Em estoque</Typography>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 700, color: '#FF43A3' }}>{totalQuantity}</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.5)' }}>Giro pronto para faturamento.</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 3, borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Valor Exposto</Typography>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 700, color: '#a7f3d0' }}>R$ {totalInventoryValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.5)' }}>Avaliado ao preço final de vitrine.</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 3, borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Margem Média</Typography>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 700, color: '#fef3c7' }}>{averageMargin}%</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.5)' }}>{lowStockCount} baixos • {emptyStockCount} zerados.</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Stocks Table */}
      <TableContainer component={Paper} sx={{ borderRadius: '28px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}>
            <TableRow>
              <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Produto</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Código</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Quantidade</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Custo Médio</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Status</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Margem</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Preço de Venda</TableCell>
              <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 2.5 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredStocks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    Nenhuma peça correspondente localizada.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredStocks.map((stock) => {
                const status = getStockStatus(stock.quantity);
                const margin = stock.product.purchase_price
                  ? (((stock.product.sale_price - stock.product.purchase_price) / stock.product.purchase_price) * 100).toFixed(0)
                  : '0';

                return (
                  <TableRow key={stock.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02) !important' } }}>
                    <TableCell sx={{ px: 3, py: 2 }}>
                      <Typography sx={{ fontWeight: 600, color: '#ffffff' }}>{stock.product.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{stock.product.category} • Tamanho {stock.product.size}</Typography>
                    </TableCell>
                    <TableCell sx={{ px: 3, py: 2, fontFamily: 'monospace', color: '#FF43A3' }}>{stock.product.sku}</TableCell>
                    <TableCell sx={{ px: 3, py: 2, fontWeight: 'bold' }}>{stock.quantity}</TableCell>
                    <TableCell sx={{ px: 3, py: 2, color: 'text.secondary' }}>R$ {Number(stock.product.purchase_price).toFixed(2)}</TableCell>
                    <TableCell sx={{ px: 3, py: 2 }}>
                      <Chip label={status.label} color={status.color} size="small" sx={{ borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700 }} />
                    </TableCell>
                    <TableCell sx={{ px: 3, py: 2, fontWeight: 700, color: '#FF43A3' }}>{margin}%</TableCell>
                    <TableCell sx={{ px: 3, py: 2, fontWeight: 700, color: '#a7f3d0' }}>R$ {Number(stock.product.sale_price).toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ px: 3, py: 2 }}>
                      <IconButton onClick={() => handleOpenAdjust(stock, 'add')} color="success" sx={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', mr: 0.5 }}>
                        <AddIcon size="small" />
                      </IconButton>
                      <IconButton onClick={() => handleOpenAdjust(stock, 'remove')} color="warning" sx={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', mr: 0.5 }}>
                        <RemoveIcon size="small" />
                      </IconButton>
                      <IconButton onClick={() => handleOpenEdit(stock)} color="primary" sx={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                        <EditIcon size="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Adjust Quantity Dialog */}
      <Dialog open={adjustOpen} onClose={handleCloseAdjust} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: '#FF43A3', fontWeight: 700 }}>
            Movimentar Estoque
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700 }}>
            {adjustType === 'add' ? 'Adicionar Quantidade' : 'Remover Quantidade'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleAdjustSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {adjustError && (
              <Alert severity="error" sx={{ borderRadius: '12px' }}>
                {adjustError}
              </Alert>
            )}
            {selectedStock && (
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#ffffff' }}>{selectedStock.product.name}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Saldo atual: {selectedStock.quantity}</Typography>
              </Box>
            )}
            <TextField
              label="Quantidade"
              type="number"
              required
              fullWidth
              inputProps={{ min: '1' }}
              value={adjustQuantity}
              onChange={(e) => setAdjustQuantity(Number(e.target.value))}
            />
            <TextField
              label="Motivo / Justificativa"
              required
              fullWidth
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseAdjust} variant="text" color="inherit" sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button
            onClick={handleAdjustSubmit}
            variant="contained"
            disabled={adjustSaving}
            startIcon={adjustSaving && <CircularProgress size={16} color="inherit" />}
          >
            {adjustSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Specifications Dialog */}
      <Dialog open={editOpen} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: '#FF43A3', fontWeight: 700 }}>
            Manutenção de Estoque
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700 }}>
            Editar Especificações da Peça
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleEditSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {editError && (
              <Alert severity="error" sx={{ borderRadius: '12px' }}>
                {editError}
              </Alert>
            )}
            {editSaving && !selectedProduct ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Nome da peça"
                    required
                    fullWidth
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Preço de compra (custo)"
                    type="number"
                    required
                    fullWidth
                    inputProps={{ step: '0.01', min: '0' }}
                    value={editData.purchase_price}
                    onChange={(e) => setEditData(prev => ({ ...prev, purchase_price: Number(e.target.value) }))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Preço de venda"
                    type="number"
                    required
                    fullWidth
                    inputProps={{ step: '0.01', min: '0' }}
                    value={editData.sale_price}
                    onChange={(e) => setEditData(prev => ({ ...prev, sale_price: Number(e.target.value) }))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Categoria"
                    required
                    fullWidth
                    value={editData.category}
                    onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Tamanho"
                    required
                    fullWidth
                    value={editData.size}
                    onChange={(e) => setEditData(prev => ({ ...prev, size: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Cor"
                    fullWidth
                    value={editData.color}
                    onChange={(e) => setEditData(prev => ({ ...prev, color: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="URL da Imagem"
                    fullWidth
                    value={editData.image_url}
                    onChange={(e) => setEditData(prev => ({ ...prev, image_url: e.target.value }))}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseEdit} variant="text" color="inherit" sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={editSaving}
            startIcon={editSaving && <CircularProgress size={16} color="inherit" />}
          >
            {editSaving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;
