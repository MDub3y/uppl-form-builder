import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const BackgroundGradient: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  return (
    <motion.div
      className="fixed inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      key={themeMode}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-background"
        animate={{
          background: themeMode === 'light' 
            ? 'linear-gradient(135deg, hsl(46, 100%, 96%), hsl(273, 100%, 97%))'
            : 'linear-gradient(135deg, hsl(0, 0%, 7%), hsl(261, 28%, 11%))'
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      
      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
        style={{
          background: themeMode === 'light' 
            ? 'radial-gradient(circle, hsl(261, 60%, 35%, 0.1), transparent)'
            : 'radial-gradient(circle, hsl(261, 60%, 67%, 0.1), transparent)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
        style={{
          background: themeMode === 'light' 
            ? 'radial-gradient(circle, hsl(22, 100%, 56%, 0.1), transparent)'
            : 'radial-gradient(circle, hsl(22, 100%, 56%, 0.1), transparent)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, -80, 120, 0],
          y: [0, 80, -60, 0],
          scale: [1, 0.8, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
      />
    </motion.div>
  );
};

export default BackgroundGradient;