import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  textColor?: string;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, textColor = '#ffffff', description }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.35em',
              color: 'text.secondary',
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.05)',
              px: 2,
              py: 0.5,
              fontSize: '0.85rem',
              fontWeight: 'bold',
              color: '#FF43A3',
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography
          variant="h2"
          sx={{
            mt: 3,
            fontSize: '2.5rem',
            fontWeight: 800,
            color: textColor,
          }}
        >
          {value}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: 'rgba(255, 255, 255, 0.55)',
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
