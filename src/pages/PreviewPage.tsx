
import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Container, Typography, Card, CardContent, Button } from '@mui/material';
import { Preview, ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import InteractiveFormPreview from '../components/FormBuilder/InteractiveFormPreview';

const PreviewPage: React.FC = () => {
  const currentForm = useSelector((state: RootState) => state.formBuilder.currentForm);

  if (!currentForm) {
    return (
      <Container maxWidth="md" className="py-16">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="card-spotlight bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12">
              <Preview className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <Typography variant="h4" className="font-bold mb-4">
                No Form to Preview
              </Typography>
              <Typography variant="body1" className="text-muted-foreground mb-8">
                Create a form first to see the preview
              </Typography>
              
              <motion.div className='mt-4' whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/create">
                  <Button
                    variant="contained"
                    size="large"
                    className="gradient-button px-8 py-3"
                  >
                    Create Form
                  </Button>
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='dark:text[#CBB5FF]'
      >
        <div className="mb-6">
          <motion.div className='mb-4' whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/create">
              <Button
                startIcon={<ArrowBack />}
                variant="outlined"
                className="mb-4 dark:text-[#CBB5FF]"
              >
                Back to Editor
              </Button>
            </Link>
          </motion.div>
          
          <div className="flex items-center gap-2 text-primary mb-2">
            <Preview />
            <Typography variant="body2" className="font-medium">
              Preview Mode
            </Typography>
          </div>
          
          <Typography variant="h4" className="font-bold dark:text-[#fff]">
            {currentForm.name}
          </Typography>
          <Typography variant="body2" className="text-muted-foreground">
            This is how your form will appear to users. All validation rules are active.
          </Typography>
        </div>

        <Card className="p-4 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <Typography variant="h5" className="font-semibold mb-6">
              {currentForm.name}
            </Typography>
            
            <InteractiveFormPreview />
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default PreviewPage;
