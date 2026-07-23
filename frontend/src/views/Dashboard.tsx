import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
} from '@mui/material';
import StatCard from '../components/StatCard';
import { salesAPI } from '../api/client';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState({
    customers: 0,
    products: 0,
    totalQuantity: 0,
  });

  const [financial, setFinancial] = useState({
    total_revenue_paid: 0,
    total_receivable_pending: 0,
    average_ticket_paid: 0,
    average_ticket_overall: 0,
    finalized_sales_count: 0,
    pending_sales_count: 0,
    gross_profit_paid: 0,
  });

  const [latestSales, setLatestSales] = useState<any[]>([]);
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString('pt-BR');
  };

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await salesAPI.dashboardSummary({ latest_sales_limit: 8 });
      const data = response.data;
      setSummary(data.summary || {});
      setFinancial(data.financial || {});
      setPendingItems(data.pending_items || []);
      setBestSellers(data.best_sellers || []);
      setLatestSales(data.latest_sales || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Não foi possível carregar o painel geral.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const quickLinks = [
    { to: '/customers', eyebrow: 'Relacionamento', title: 'Clientes', description: 'Centralize cadastros, histórico e vínculos comercial.' },
    { to: '/products', eyebrow: 'Coleção', title: 'Produtos', description: 'Organize peças, códigos, imagens e precificação.' },
    { to: '/inventory', eyebrow: 'Acervo', title: 'Estoque', description: 'Acompanhe reposição, saldo e itens de giro.' },
    { to: '/reports', eyebrow: 'Leitura', title: 'Relatórios', description: 'Observe desempenho, ticket, margem e volume.' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Banner section */}
      <Box
        sx={{
          borderRadius: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background:
            'linear-gradient(135deg, rgba(255, 67, 163, 0.18), rgba(237, 50, 55, 0.14) 35%, rgba(17, 15, 16, 0.95) 72%)',
          p: { xs: 4, md: 6 },
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} lg={7.5}>
            <Typography
              sx={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.45em',
                color: '#FF43A3',
                fontWeight: 700,
              }}
            >
              Maison overview
            </Typography>
            <Typography
              variant="h1"
              sx={{
                mt: 2.5,
                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.6rem' },
                lineHeight: 1.1,
                color: '#ffffff',
              }}
            >
              A leitura essencial da boutique, em uma visão sofisticada.
            </Typography>
            <Typography variant="body1" sx={{ mt: 3, color: 'rgba(255, 255, 255, 0.7)', maxWidth: '600px', lineHeight: 1.7 }}>
              Acompanhe o ritmo comercial da marca, a saúde financeira e as peças que ainda aguardam retorno em caixa.
            </Typography>

            <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant="contained"
                component={RouterLink}
                to="/sales"
                sx={{ borderRadius: '24px', px: 4, py: 1.5 }}
              >
                Nova venda
              </Button>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/products"
                sx={{
                  borderRadius: '24px',
                  px: 4,
                  py: 1.5,
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  '&:hover': {
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                Refinar catálogo
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} lg={4.5}>
            <Box
              sx={{
                borderRadius: '28px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                background: 'linear-gradient(180deg, rgba(48, 42, 45, 0.92), rgba(28, 24, 26, 0.94))',
                p: 4,
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.35em',
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontWeight: 700,
                  mb: 3,
                }}
              >
                Panorama financeiro
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.24em', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Recebido</Typography>
                  <Typography variant="h5" sx={{ color: '#a7f3d0' }}>{formatCurrency(financial.total_revenue_paid)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.24em', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>A receber</Typography>
                  <Typography variant="h5" sx={{ color: '#fef3c7' }}>{formatCurrency(financial.total_receivable_pending)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.24em', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Margem realizada</Typography>
                  <Typography variant="h5" sx={{ color: '#FF43A3' }}>{formatCurrency(financial.gross_profit_paid)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.24em', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Ticket Médio Pago</Typography>
                  <Typography variant="h5" sx={{ color: '#ffffff' }}>{formatCurrency(financial.average_ticket_paid)}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: '16px' }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards Section */}
      <Grid container spacing={3}>
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Grid item xs={12} sm={6} xl={3} key={index}>
              <Card sx={{ p: 4, height: '150px' }}>
                <Skeleton width="40%" height={15} />
                <Skeleton width="70%" height={50} sx={{ mt: 2 }} />
              </Card>
            </Grid>
          ))
        ) : (
          <>
            <Grid item xs={12} sm={6} xl={3}>
              <StatCard title="Clientes" value={String(summary.customers)} icon="C" description="Relacionamentos ativos que sustentam a recorrência." />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <StatCard title="Produtos" value={String(summary.products)} icon="P" description="Peças prontas para catálogo, estoque e experiência." />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <StatCard title="Recebido" value={formatCurrency(financial.total_revenue_paid)} icon="R$" textColor="#a7f3d0" description="Valor já convertido em caixa com consistência." />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <StatCard title="A receber" value={formatCurrency(financial.total_receivable_pending)} icon="AR" textColor="#fef3c7" description="Saldo ainda em aberto nas vendas pendentes." />
            </Grid>
          </>
        )}
      </Grid>

      {/* Main Grid content */}
      <Grid container spacing={4}>
        <Grid item xs={12} xl={7.5}>
          <Card sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.35em', color: '#FF43A3', fontWeight: 700 }}>Indicadores</Typography>
                <Typography variant="h3" sx={{ mt: 1, fontSize: '2rem', color: '#ffffff' }}>Pulso da operação</Typography>
              </Box>
              <Chip label={`${financial.pending_sales_count} pendentes`} sx={{ borderRadius: '24px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.75rem', px: 1 }} />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 3, borderRadius: '24px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.24em', fontWeight: 600 }}>Ticket Médio Geral</Typography>
                  <Typography variant="h4" sx={{ mt: 2, color: '#ffffff', fontWeight: 700 }}>{formatCurrency(financial.average_ticket_overall)}</Typography>
                  <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary' }}>Considera vendas liquidadas e em aberto.</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 3, borderRadius: '24px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.24em', fontWeight: 600 }}>Vendas Finalizadas</Typography>
                  <Typography variant="h4" sx={{ mt: 2, color: '#a7f3d0', fontWeight: 700 }}>{financial.finalized_sales_count}</Typography>
                  <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary' }}>Pedidos que retornaram receita efetiva.</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 3, borderRadius: '24px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.24em', fontWeight: 600 }}>Estoque Total</Typography>
                  <Typography variant="h4" sx={{ mt: 2, color: '#ffffff', fontWeight: 700 }}>{summary.totalQuantity}</Typography>
                  <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary' }}>Volume disponível no acervo comercial.</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 3, borderRadius: '24px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.24em', fontWeight: 600 }}>Itens Pendentes</Typography>
                  <Typography variant="h4" sx={{ mt: 2, color: '#fef3c7', fontWeight: 700 }}>{pendingItems.length}</Typography>
                  <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary' }}>Peças entregues que aguardam quitação.</Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Best Sellers */}
            <Box sx={{ mt: 5 }}>
              <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.35em', color: '#FF43A3', fontWeight: 700, mb: 3 }}>Mais vendidos</Typography>
              {bestSellers.length === 0 ? (
                <Box sx={{ p: 4, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '22px', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)' }}>Sem ranking</Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>Assim que a boutique ganhar giro, o ranking aparecerá aqui.</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {bestSellers.map((product) => (
                    <Box
                      key={product.product_name}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderRadius: '22px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        p: 3,
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>{product.product_name}</Typography>
                        <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', mt: 0.5, display: 'block' }}>{product.quantity} unidades</Typography>
                      </Box>
                      <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 700, color: '#FF43A3' }}>{formatCurrency(product.revenue)}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} xl={4.5}>
          {/* Pending Items Card */}
          <Card sx={{ p: 4, mb: 4 }}>
            <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.35em', color: '#FF43A3', fontWeight: 700 }}>A receber</Typography>
            <Typography variant="h3" sx={{ mt: 1, fontSize: '2rem', color: '#ffffff', mb: 4 }}>Peças ainda não quitadas</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxHeight: '420px', overflowY: 'auto', pr: 1 }}>
              {pendingItems.length === 0 ? (
                <Box sx={{ p: 4, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '22px', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)' }}>Fluxo Saudável</Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>No momento, não há peças aguardando retorno financeiro.</Typography>
                </Box>
              ) : (
                pendingItems.map((item, idx) => (
                  <Box
                    key={`${item.sale_id}-${item.product_id}-${idx}`}
                    sx={{
                      borderRadius: '22px',
                      border: '1px solid rgba(245, 134, 52, 0.15)',
                      backgroundColor: 'rgba(245, 134, 52, 0.03)',
                      p: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>{item.product_name}</Typography>
                        <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', display: 'block', mt: 0.5 }}>
                          Venda #{item.sale_id} • {item.customer_name}
                        </Typography>
                      </Box>
                      <Chip label={item.status} color="warning" size="small" sx={{ borderRadius: '12px', fontSize: '0.65rem', fontWeight: 'bold' }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        {item.quantity} un. • {formatCurrency(item.unit_price)} cada
                      </Typography>
                      <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 700, color: '#fef3c7' }}>
                        {formatCurrency(item.subtotal)}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Card>

          {/* Quick shortcuts */}
          <Card sx={{ p: 4, mb: 4 }}>
            <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.35em', color: '#FF43A3', fontWeight: 700 }}>Fluxos essenciais</Typography>
            <Typography variant="h3" sx={{ mt: 1, fontSize: '2rem', color: '#ffffff', mb: 4 }}>Atalhos da maison</Typography>

            <Grid container spacing={2}>
              {quickLinks.map((link) => (
                <Grid item xs={6} key={link.to}>
                  <Box
                    component={RouterLink}
                    to={link.to}
                    sx={{
                      display: 'block',
                      textDecoration: 'none',
                      p: 3,
                      borderRadius: '24px',
                      border: '1px solid rgba(255,255,255,0.05)',
                      backgroundColor: 'rgba(255,255,255,0.01)',
                      transition: 'all 0.2s',
                      height: '100%',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: 'rgba(255,255,255,0.15)',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                      },
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>{link.eyebrow}</Typography>
                    <Typography variant="h5" sx={{ mt: 1, mb: 0.5, color: '#ffffff', fontWeight: 700 }}>{link.title}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.4, display: 'block' }}>{link.description}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>

          {/* Recent sales */}
          <Card sx={{ p: 4 }}>
            <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.35em', color: '#FF43A3', fontWeight: 700 }}>Últimas vendas</Typography>
            <Typography variant="h3" sx={{ mt: 1, fontSize: '2rem', color: '#ffffff', mb: 4 }}>Ritmo da boutique</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {latestSales.length === 0 ? (
                <Box sx={{ p: 4, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '22px', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)' }}>Sem ritmo</Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>Nenhuma venda encontrada ainda.</Typography>
                </Box>
              ) : (
                latestSales.map((sale) => (
                  <Box
                    key={sale.id}
                    sx={{
                      borderRadius: '22px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      p: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>Venda #{sale.id}</Typography>
                        <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', display: 'block', mt: 0.5 }}>
                          {sale.customer?.name || 'Cliente não identificado'}
                        </Typography>
                      </Box>
                      <Chip
                        label={sale.status}
                        size="small"
                        sx={{
                          borderRadius: '12px',
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
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
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Typography sx={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 700, color: '#FF43A3' }}>
                        {formatCurrency(sale.total_amount)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {formatDate(sale.sale_date)}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
