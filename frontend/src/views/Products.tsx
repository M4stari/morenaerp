import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  ContentCopy as DuplicateIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { productsAPI } from '../api/client';
import { useNotification } from '../context/NotificationContext';

const Products: React.FC = () => {
  const { showNotification } = useNotification();
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    size: '',
    color: '',
    purchase_price: 0,
    sale_price: 0,
    image_url: '',
  });

  // Image Upload states
  const [imageUploading, setImageUploading] = useState(false);
  const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
  const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

  // Duplication Dialog states
  const [dupDialogOpen, setDupDialogOpen] = useState(false);
  const [dupProductId, setDupProductId] = useState<number | null>(null);
  const [dupData, setDupData] = useState({
    new_sku: '',
    new_name: '',
    new_color: '',
    new_size: '',
  });
  const [dupSaving, setDupSaving] = useState(false);
  const [dupError, setDupError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsAPI.list({ limit: 100 });
      setProducts(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenDialog = (product?: any) => {
    setFormError(null);
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        category: product.category || '',
        size: product.size || '',
        color: product.color || '',
        purchase_price: Number(product.purchase_price || 0),
        sale_price: Number(product.sale_price || 0),
        image_url: product.image_url || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        sku: '',
        description: '',
        category: '',
        size: '',
        color: '',
        purchase_price: 0,
        sale_price: 0,
        image_url: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setFormData({
      name: '',
      sku: '',
      description: '',
      category: '',
      size: '',
      color: '',
      purchase_price: 0,
      sale_price: 0,
      image_url: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploading(true);

    if (cloudinaryCloudName && cloudinaryUploadPreset) {
      try {
        const cloudData = new FormData();
        cloudData.append('file', file);
        cloudData.append('upload_preset', cloudinaryUploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
          method: 'POST',
          body: cloudData,
        });

        if (!response.ok) {
          throw new Error('Falha no upload para nuvem');
        }

        const data = await response.json();
        setFormData((prev) => ({ ...prev, image_url: data.secure_url }));
        setImageUploading(false);
        return;
      } catch (error) {
        console.warn('Cloudinary upload indisponível, fallback local.', error);
      }
    }

    // Fallback: base64
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, image_url: reader.result as string }));
      setImageUploading(false);
    };
    reader.onerror = () => {
      setImageUploading(false);
      alert('Não foi possível ler a imagem selecionada.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplySuggested = () => {
    const suggested = Number((formData.purchase_price * 2.2).toFixed(2));
    setFormData((prev) => ({ ...prev, sale_price: suggested }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);

    try {
      const payload = {
        ...formData,
        purchase_price: Number(formData.purchase_price),
        sale_price: Number(formData.sale_price),
      };

      if (editingId) {
        await productsAPI.update(editingId, payload);
        showNotification('Peça atualizada com sucesso.', 'success');
      } else {
        await productsAPI.create(payload);
        showNotification('Nova peça adicionada com sucesso.', 'success');
      }
      fetchProducts();
      handleCloseDialog();
    } catch (err: any) {
      setFormError(err.response?.data?.detail || err.message || 'Erro ao salvar produto.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza de que deseja deletar este produto?')) return;

    try {
      await productsAPI.delete(id);
      showNotification('Produto excluído com sucesso.', 'success');
      fetchProducts();
    } catch (err: any) {
      showNotification(
        `Erro ao excluir produto: ${err.response?.data?.detail || err.message}`,
        'error'
      );
    }
  };

  // Duplication Handlers
  const handleOpenDuplicate = (product: any) => {
    setDupError(null);
    setDupProductId(product.id);
    setDupData({
      new_sku: `${product.sku}-CLONE`,
      new_name: `${product.name} (Cópia)`,
      new_color: product.color || '',
      new_size: product.size || '',
    });
    setDupDialogOpen(true);
  };

  const handleCloseDuplicate = () => {
    setDupDialogOpen(false);
    setDupProductId(null);
  };

  const handleDuplicateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dupProductId) return;

    setDupError(null);
    setDupSaving(true);

    try {
      await productsAPI.duplicate(dupProductId, {
        new_sku: dupData.new_sku,
        new_name: dupData.new_name || undefined,
        new_color: dupData.new_color || undefined,
        new_size: dupData.new_size || undefined,
      });

      showNotification('Produto duplicado com sucesso.', 'success');
      fetchProducts();
      handleCloseDuplicate();
    } catch (err: any) {
      setDupError(err.response?.data?.detail || err.message || 'Erro ao duplicar produto.');
    } finally {
      setDupSaving(false);
    }
  };

  const calculateProfit = (product: any) => {
    if (!product.purchase_price) return 0;
    const profit = ((product.sale_price - product.purchase_price) / product.purchase_price) * 100;
    return profit.toFixed(0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  const filteredProducts = products.filter((product) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      (product.color && product.color.toLowerCase().includes(term));

    const matchesCategory = !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
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
              Coleção
            </Typography>
            <Typography variant="h2" sx={{ mt: 1.5, fontSize: '2.5rem', color: '#ffffff' }}>
              Curadoria de Produtos
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              Organize a coleção com apresentação refinada, preço posicionado e imagem alinhada.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ py: 1.8, px: 3, borderRadius: '16px' }}
          >
            Nova peça
          </Button>
        </Box>
      </Card>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Buscar por nome, categoria, código ou cor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Todas as categorias</InputLabel>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            label="Todas as categorias"
          >
            <MenuItem value="">Todas as categorias</MenuItem>
            <MenuItem value="Blusas">Blusas</MenuItem>
            <MenuItem value="Tops">Tops</MenuItem>
            <MenuItem value="Bodies">Bodies</MenuItem>
            <MenuItem value="Calças">Calças</MenuItem>
            <MenuItem value="Vestidos">Vestidos</MenuItem>
            <MenuItem value="Saias">Saias</MenuItem>
            <MenuItem value="Acessórios">Acessórios</MenuItem>
          </Select>
        </FormControl>
        <IconButton onClick={fetchProducts} color="inherit" sx={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', p: 1.8 }}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: '16px' }}>
          {error}
        </Alert>
      )}

      {/* Grid List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Box sx={{ p: 8, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '28px', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', display: 'block', mb: 2 }}>Coleção em construção</Typography>
          <Typography variant="h4" sx={{ color: '#ffffff', mb: 2 }}>Nenhum produto encontrado</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: '400px', mx: 'auto', mb: 4 }}>
            Cadastre a primeira peça para compor a coleção, abastecer o estoque e girar a boutique.
          </Typography>
          <Button variant="contained" onClick={() => handleOpenDialog()}>
            Adicionar primeira peça
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    height: 180,
                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {product.image_url ? (
                    <CardMedia
                      component="img"
                      image={product.image_url}
                      alt={product.name}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Typography variant="h3" sx={{ color: 'rgba(255,255,255,0.2)', fontWeight: 800 }}>
                      MC
                    </Typography>
                  )}
                </Box>
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                    <Box>
                      <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.15em', color: 'text.secondary' }}>
                        {product.category}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, mt: 0.5, fontSize: '1.1rem' }}>
                        {product.name}
                      </Typography>
                    </Box>
                    <Chip label={product.size} size="small" sx={{ borderRadius: '8px', bgcolor: 'rgba(255,67,163,0.1)', color: '#FF43A3', fontWeight: 'bold' }} />
                  </Box>

                  <Box sx={{ my: 2.5, display: 'flex', flexDirection: 'column', gap: 1, fontSize: '0.85rem', flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Código: <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#FF43A3' }}>{product.sku}</span>
                    </Typography>
                    {product.color && (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Cor: <span style={{ color: '#ffffff' }}>{product.color}</span>
                      </Typography>
                    )}
                    {product.description && (
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {product.description}
                      </Typography>
                    )}
                  </Box>

                  <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', p: 2 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Compra</Typography>
                        <Typography sx={{ fontWeight: 700, mt: 0.5 }}>{formatCurrency(product.purchase_price)}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', p: 2 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Venda</Typography>
                        <Typography sx={{ fontWeight: 700, mt: 0.5, color: '#FF43A3' }}>{formatCurrency(product.sale_price)}</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ bgcolor: 'rgba(255,67,163,0.03)', border: '1px solid rgba(255,67,163,0.1)', borderRadius: '16px', p: 1.5, textAlign: 'center', mb: 3 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Margem estimada</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#FF43A3' }}>{calculateProfit(product)}%</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" color="inherit" fullWidth onClick={() => handleOpenDialog(product)} startIcon={<EditIcon />} sx={{ py: 1.2, borderColor: 'rgba(255,255,255,0.1)', '&:hover': { borderColor: '#ffffff' } }}>
                      Editar
                    </Button>
                    <IconButton onClick={() => handleOpenDuplicate(product)} color="secondary" sx={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', p: 1.2 }}>
                      <DuplicateIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product.id)} color="error" sx={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', p: 1.2 }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Product Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: '#FF43A3', fontWeight: 700 }}>
            Coleção
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700 }}>
            {editingId ? 'Editar Peça' : 'Nova Peça'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {formError && (
              <Alert severity="error" sx={{ borderRadius: '12px' }}>
                {formError}
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Nome"
                  required
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="sku"
                  label="Código (SKU)"
                  required
                  fullWidth
                  value={formData.sku}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="category"
                  label="Categoria"
                  required
                  fullWidth
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="size"
                  label="Tamanho"
                  required
                  fullWidth
                  value={formData.size}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="color"
                  label="Cor"
                  fullWidth
                  value={formData.color}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="purchase_price"
                  label="Preço de compra"
                  type="number"
                  required
                  fullWidth
                  inputProps={{ step: '0.01', min: '0' }}
                  value={formData.purchase_price}
                  onChange={handleInputChange}
                  helperText="Custo atacado ou fabricação."
                />
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ p: 2, border: '1px solid rgba(255,67,163,0.15)', borderRadius: '16px', bgcolor: 'rgba(255,67,163,0.02)' }}>
                  <Typography variant="caption" sx={{ color: '#FF43A3', fontWeight: 'bold', display: 'block' }}>Markup Sugerido (2.2x)</Typography>
                  <Typography sx={{ mt: 0.5, fontWeight: 700 }}>
                    {formatCurrency(formData.purchase_price * 2.2)}
                  </Typography>
                  <Button size="small" variant="outlined" onClick={handleApplySuggested} sx={{ mt: 1, py: 0.5, fontSize: '0.7rem' }}>
                    Usar sugestão
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="sale_price"
                  label="Preço de venda"
                  type="number"
                  required
                  fullWidth
                  inputProps={{ step: '0.01', min: '0' }}
                  value={formData.sale_price}
                  onChange={handleInputChange}
                  helperText="Valor exposto na vitrine comercial."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="image_url"
                  label="URL da imagem externa"
                  fullWidth
                  value={formData.image_url}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary' }}>Upload de imagem do dispositivo</Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '16px',
                    border: '1px dashed rgba(255,255,255,0.15)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                />
                {imageUploading && <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: '#FF43A3' }}>Enviando imagem...</Typography>}
              </Grid>
              {formData.image_url && (
                <Grid item xs={12}>
                  <Box sx={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', height: 120 }}>
                    <img src={formData.image_url} alt="Previa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Descrição da peça"
                  multiline
                  rows={3}
                  fullWidth
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} variant="text" color="inherit" sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={saving || imageUploading}
            startIcon={saving && <CircularProgress size={16} color="inherit" />}
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Duplicate Form Dialog */}
      <Dialog open={dupDialogOpen} onClose={handleCloseDuplicate} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: '#FF43A3', fontWeight: 700 }}>
            Duplicar Produto
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700 }}>
            Gerar Cópia
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleDuplicateSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {dupError && (
              <Alert severity="error" sx={{ borderRadius: '12px' }}>
                {dupError}
              </Alert>
            )}
            <TextField
              label="Novo SKU"
              required
              fullWidth
              value={dupData.new_sku}
              onChange={(e) => setDupData(prev => ({ ...prev, new_sku: e.target.value }))}
            />
            <TextField
              label="Novo Nome (opcional)"
              fullWidth
              value={dupData.new_name}
              onChange={(e) => setDupData(prev => ({ ...prev, new_name: e.target.value }))}
            />
            <TextField
              label="Nova Cor (opcional)"
              fullWidth
              value={dupData.new_color}
              onChange={(e) => setDupData(prev => ({ ...prev, new_color: e.target.value }))}
            />
            <TextField
              label="Novo Tamanho (opcional)"
              fullWidth
              value={dupData.new_size}
              onChange={(e) => setDupData(prev => ({ ...prev, new_size: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDuplicate} variant="text" color="inherit" sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button
            onClick={handleDuplicateSubmit}
            variant="contained"
            disabled={dupSaving}
            startIcon={dupSaving && <CircularProgress size={16} color="inherit" />}
          >
            Duplicar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
