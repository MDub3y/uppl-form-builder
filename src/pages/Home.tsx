import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Card, CardContent } from '@mui/material';
import { Bolt, Palette, Code, AutoAwesome } from '@mui/icons-material';

const Home: React.FC = () => {
  console.log('Home component rendering');
  const features = [
    {
      icon: <Bolt />,
      title: 'Lightning Fast',
      description: 'Build forms in minutes with our intuitive drag-and-drop interface and pre-built components'
    },
    {
      icon: <Palette />,
      title: 'Beautiful Design',
      description: 'Professional themes and customization options that match your brand perfectly'
    },
    {
      icon: <Code />,
      title: 'Advanced Logic',
      description: 'Derived fields, conditional logic, real-time validation, and custom formulas, and seamless integrations'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '4.9', label: 'Rating' },
    { value: '99.9%', label: 'Uptime' }
  ];

  return (
    <Container maxWidth="lg" className="py-8 lg:py-16">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-16 lg:mb-24"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"
          whileHover={{ scale: 1.05 }}
        >
          <AutoAwesome className="w-4 h-4" />
          <Typography variant="body2" fontWeight={500}>
            Modern Form Builder
          </Typography>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography 
            variant="h1" 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight"
          >
            Build Beautiful Forms
          </Typography>
          <Typography variant="h2" className="text-2xl md:text-4xl lg:text-5xl font-bold mb-8 text-foreground/90">
            In Minutes, Not Hours
          </Typography>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto mt-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Typography variant="h6" className="text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed text-lg lg:text-xl">
            The most powerful yet simple form builder. Create, customize, and deploy 
            professional forms with our intuitive drag-and-drop interface. Advanced validation, 
            derived fields, and real-time preview make form building effortless.
          </Typography>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/create">
              <Button
                variant="contained"
                size="large"
                className="gradient-button px-8 py-3 text-lg font-semibold rounded-xl"
                sx={{ boxShadow: 'var(--shadow-glow)' }}
              >
                Start Building →
              </Button>
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/my-forms">
              <Button
                variant="outlined"
                size="large"
                className="px-8 py-3 text-lg font-semibold rounded-xl border-2"
              >
                View My Forms
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="mb-16 lg:mb-24 flex flex-col gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Typography variant="h3" className="text-3xl dark:text-white font-bold text-center mb-4">
          Why Choose <span className="text-primary">upliance</span>{' '}
          <span className="text-accent">Form Studio</span>?
        </Typography>
        <Typography variant="body1" className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          Everything you need to create professional forms with advanced features
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card 
                  className="card-spotlight h-[212px] bg-card/60 backdrop-blur-md border-border/60 hover:shadow-elegant transition-all duration-500"
                  sx={{ borderRadius: '1.5rem' }}
                >
                  <CardContent className="p-8 lg:p-10 text-center">
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center text-primary"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <Typography variant="h6" className="font-semibold mb-3">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="mb-16 lg:mb-24"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={stat.label}>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-card/40 backdrop-blur-md border-border/60 hover:shadow-card transition-all duration-300">
                  <CardContent className="py-10">
                    <Typography variant="h3" className="text-4xl font-bold text-primary mb-2">
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" className="text-muted-foreground font-medium">
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="text-center h-[200px] flex flex-col justify-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
        <Card className="h-full flex flex-col justify-center items-center bg-gradient-primary/15 border-primary/30 backdrop-blur-md hover:shadow-glow transition-all duration-500">
          <CardContent className="py-16 h-full flex flex-col justify-around lg:py-20 px-8 lg:px-12">
            <Typography variant="h4" className="font-bold mb-4">
              Ready to Get Started?
            </Typography>
            <Typography variant="body1" className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Uppliance Form Studio for their form building needs
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/create">
                <Button
                  variant="contained"
                  size="large"
                  className="gradient-button px-8 py-3 text-lg font-semibold rounded-xl"
                  startIcon={<Bolt />}
                >
                  Create Your First Form
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Home;