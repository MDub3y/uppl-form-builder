import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, IconButton, Button, Box, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Menu, Close, LightMode, DarkMode, AutoAwesome } from '@mui/icons-material';
import { RootState } from '../../store';
import { toggleTheme } from '../../store/slices/themeSlice';

const Navigation: React.FC = () => {
  console.log('Navigation component rendering');
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const navItems = [
    { label: 'Create', path: '/create' },
    { label: 'Preview', path: '/preview' },
    { label: 'My Forms', path: '/my-forms' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ p: 2 }}>
          <motion.div
            className="flex items-center gap-2 text-primary font-bold text-xl"
            whileHover={{ scale: 1.05 }}
          >
            <AutoAwesome />
            Uppliance Form Studio
          </motion.div>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <motion.div
                className="w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={item.path} className="w-full block">
                  <ListItemText 
                    primary={item.label} 
                    sx={{ 
                      textAlign: 'center',
                      color: location.pathname === item.path ? 'primary.main' : 'text.primary'
                    }} 
                  />
                </Link>
              </motion.div>
            </ListItem>
          ))}
        </List>
      </motion.div>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          ...(themeMode === 'dark' && {
            background: 'rgba(18, 18, 18, 0.8)',
          })
        }}
      >
        <Toolbar className="max-w-7xl mx-auto w-full">
          <motion.div
            className="flex items-center gap-2 text-primary font-bold text-xl flex-1"
            whileHover={{ scale: 1.02 }}
          >
            <Link to="/" className="flex items-center gap-2">
              <AutoAwesome />
              <span 
                key={themeMode}
                className="hidden sm:block"
                style={{
                  fontWeight: 700,
                  background: themeMode === 'light'
                    ? 'linear-gradient(90deg, #3C1F94, #FF7A00)'
                    : 'linear-gradient(90deg, #CBB5FF, #FFB347)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                }}
              >
                Uppliance Form Studio</span>
              <span className="sm:hidden">upliance</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <motion.div 
              className="flex items-center gap-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={item.path}>
                    <Button
                      variant={location.pathname === item.path ? 'contained' : 'text'}
                      className={location.pathname === item.path ? 'gradient-button dark:text-[#CBB5FF]' : ' dark:text-[#CBB5FF]'}
                      sx={{
                        fontWeight: 500,
                        borderRadius: 2,
                        px: 3,
                      }}
                    >
                      {item.label}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Theme Toggle */}
          <motion.div
            className="ml-4"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconButton onClick={handleThemeToggle} color="primary">
              <AnimatePresence mode="wait">
                {themeMode === 'light' ? (
                  <motion.div
                    key="light"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DarkMode />
                  </motion.div>
                ) : (
                  <motion.div
                    key="dark"
                    className=' dark:text-[#CBB5FF]'
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LightMode />
                  </motion.div>
                )}
              </AnimatePresence>
            </IconButton>
          </motion.div>

          {/* Mobile Menu Button */}
          {isMobile && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ ml: 1 }}
              >
                <Menu />
              </IconButton>
            </motion.div>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            background: 'var(--gradient-background)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;