import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Refresh as RefreshIcon,
  Leaderboard as LeaderboardIcon,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { salesAPI } from '../api/client';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Reports: React.FC = () => {
  const [financialReport, setFinancialReport] = useState<any>(null);
  const [dailyReport, setDailyReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const [finRes, salesRes] = await Promise.all([
        salesAPI.financialReport(),
        salesAPI.list({ limit: 100 }),
      ]);
      setFinancialReport(finRes.data);

      const salesList = salesRes.data || [];
      
      // Group and sum sales by local date string
      const grouped: { [key: string]: number } = {};
      salesList.forEach((sale: any) => {
        const day = new Date(sale.sale_date).toLocaleDateString('pt-BR');
        grouped[day] = (grouped[day] || 0) + sale.total_amount;
      });

      // Sort dates chronologically
      const sortedDates = Object.keys(grouped).sort((a, b) => {
        const parseDate = (dStr: string) => {
          const [d, m, y] = dStr.split('/').map(Number);
          return new Date(y, m - 1, d).getTime();
        };
        return parseDate(a) - parseDate(b);
      });

      const formattedDailyReport = sortedDates.map((date) => ({
        date,
        revenue: grouped[date],
      }));

      setDailyReport(formattedDailyReport);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Erro ao carregar relatórios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExportPDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#161314',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 size width
      const pageHeight = 295; // A4 size height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`relatorio_morena_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Erro ao exportar PDF', err);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  // Line Chart Config (Daily Revenue)
  const lineChartData = {
    labels: dailyReport.map((r) => r.date),
    datasets: [
      {
        label: 'Receita Diária',
        data: dailyReport.map((r) => r.revenue),
        borderColor: '#FF43A3',
        backgroundColor: 'rgba(255, 67, 163, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Bar Chart Config (Best Sellers Category/Product)
  const bestSellers = financialReport?.best_sellers || [];
  const barChartData = {
    labels: bestSellers.map((item: any) => item.product_name),
    datasets: [
      {
        label: 'Receita Acumulada',
        data: bestSellers.map((item: any) => item.revenue),
        backgroundColor: 'rgba(245, 134, 52, 0.8)',
        borderColor: '#F58634',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#bdbfc1',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#bdbfc1',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#bdbfc1',
        },
      },
    },
  };

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
              Leitura
            </Typography>
            <Typography variant="h2" sx={{ mt: 1.5, fontSize: '2.5rem', color: '#ffffff' }}>
              Relatório Comercial e Financeiro
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              Analise faturamento, margens de lucro de produtos e volumes vendidos.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" color="inherit" onClick={fetchReports} startIcon={<RefreshIcon />} sx={{ borderRadius: '16px', py: 1.5, borderColor: 'rgba(255,255,255,0.1)' }}>
              Atualizar
            </Button>
            <Button variant="contained" color="secondary" onClick={handleExportPDF} startIcon={<PdfIcon />} sx={{ borderRadius: '16px', py: 1.5 }}>
              Exportar PDF
            </Button>
          </Box>
        </Box>
      </Card>

      {error && (
        <Alert severity="error" sx={{ borderRadius: '16px' }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box ref={reportRef} sx={{ display: 'flex', flexDirection: 'column', gap: 4, bgcolor: '#161314', p: 1 }}>
          {/* Summary Cards */}
          {financialReport && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 4, borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Faturamento Bruto</Typography>
                  <Typography variant="h4" sx={{ mt: 2, fontWeight: 700, color: '#ffffff' }}>
                    {formatCurrency(financialReport.total_revenue_overall)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.5)' }}>Total das vendas liquidadas e pendentes.</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 4, borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Faturamento Efetivo</Typography>
                  <Typography variant="h4" sx={{ mt: 2, fontWeight: 700, color: '#a7f3d0' }}>
                    {formatCurrency(financialReport.total_revenue_paid)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.5)' }}>Valor já recebido em caixa.</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 4, borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Margem Realizada</Typography>
                  <Typography variant="h4" sx={{ mt: 2, fontWeight: 700, color: '#FF43A3' }}>
                    {formatCurrency(financialReport.gross_profit_paid)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.5)' }}>Lucro bruto obtido sobre os itens pagos.</Typography>
                </Box>
              </Grid>
            </Grid>
          )}

          {/* Charts section */}
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Card sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ color: '#ffffff', mb: 3 }}>Tendência Comercial de Receita (Diária)</Typography>
                {dailyReport.length === 0 ? (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Nenhum dado diário disponível.</Typography>
                ) : (
                  <Line data={lineChartData} options={chartOptions} />
                )}
              </Card>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Card sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ color: '#ffffff', mb: 3 }}>Faturamento por Peça (Ranking)</Typography>
                {bestSellers.length === 0 ? (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Nenhum dado de ranking de vendas.</Typography>
                ) : (
                  <Bar data={barChartData} options={chartOptions} />
                )}
              </Card>
            </Grid>
          </Grid>

          {/* Detailed summary lists */}
          {financialReport && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <LeaderboardIcon color="primary" />
                    <Typography variant="h6" sx={{ color: '#ffffff' }}>Performance por Produto</Typography>
                  </Box>
                  <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden' }}>
                    <Table>
                      <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                        <TableRow>
                          <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Produto</TableCell>
                          <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Unidades Vendidas</TableCell>
                          <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Preço de Venda</TableCell>
                          <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Receita Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bestSellers.map((item: any, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>{item.product_name}</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>{item.quantity}</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>{formatCurrency(item.revenue / item.quantity)}</TableCell>
                            <TableCell sx={{ color: '#FF43A3', fontWeight: 700 }}>{formatCurrency(item.revenue)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Reports;
