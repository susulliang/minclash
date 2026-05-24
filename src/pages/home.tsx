import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BasePage } from '@/components/base'
import { useCurrentProxy } from '@/hooks/use-current-proxy'
import delayManager from '@/services/delay'
import { useNavigate } from 'react-router'

const HomePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  // Get current proxy info
  const { currentProxy, primaryGroupName } = useCurrentProxy()
  const [loading, setLoading] = useState(true)
  const [delay, setDelay] = useState<number | undefined>()

  useEffect(() => {
    if (currentProxy?.name && primaryGroupName) {
      const d = delayManager.getDelay(currentProxy.name, primaryGroupName)
      setTimeout(() => setDelay(d), 0)
    }
    setTimeout(() => setLoading(false), 0)
  }, [currentProxy, primaryGroupName])

  const isConnected = !!currentProxy && delay !== undefined && delay > 0 && delay !== 1e6

  return (
    <BasePage
      title={t('home.page.title')}
      contentStyle={{ padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, width: '100%', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
          {/* Connection Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" color="text.secondary">Status:</Typography>
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              <Typography 
                variant="h6" 
                sx={{ 
                  color: isConnected ? 'success.main' : 'error.main',
                  fontWeight: 'bold'
                }}
              >
                {isConnected ? 'Connected' : 'Disconnected'}
              </Typography>
            )}
          </Box>

          {/* Node Name */}
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">Node:</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'medium', wordBreak: 'break-all' }}>
              {loading ? <CircularProgress size={20} /> : (currentProxy?.name || 'No Node Selected')}
            </Typography>
          </Box>

          {/* Ping */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" color="text.secondary">Ping:</Typography>
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                {delay !== undefined && delay > 0 && delay !== 1e6 ? `${delay}ms` : 'N/A'}
              </Typography>
            )}
          </Box>

          {/* Add Subscription Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => navigate('/profile')}
            sx={{ marginTop: 2 }}
          >
            Add New Subscription
          </Button>
        </Box>
      </Paper>
    </BasePage>
  )
}

export default HomePage
