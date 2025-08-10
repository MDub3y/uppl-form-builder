
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  InputAdornment,
  Chip,
  IconButton
} from '@mui/material';
import { 
  Add, 
  Search, 
  Preview, 
  Edit, 
  Delete,
  AccessTime,
  Assignment
} from '@mui/icons-material';
import { RootState } from '../store';
import { loadForm, resetCurrentForm } from '../store/slices/formBuilderSlice';
import { useToast } from '../hooks/use-toast';

const MyFormsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const savedForms = useSelector((state: RootState) => state.formBuilder.savedForms);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredForms = savedForms.filter(form =>
    form.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadForm = (formId: string) => {
    dispatch(loadForm(formId));
    toast({
      title: "Form loaded",
      description: "Form loaded into the editor",
    });
  };

  const handlePreviewForm = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/preview');
  };

  const handleNewFormClick = () => {
    dispatch(resetCurrentForm());
    navigate('/create');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Assignment className="text-primary" />
              <Typography variant="h4" className="font-bold dark:text-slate-50">
                My Forms
              </Typography>
            </div>
            <Typography variant="body1" className="text-muted-foreground">
              Manage and organize all your created forms
            </Typography>
          </div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/create">
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={handleNewFormClick}
                className="gradient-button px-6 py-3"
              >
                New Form
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TextField
            fullWidth
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ 
              maxWidth: 400,
              '& .MuiInputBase-input': {
                color: themeMode === 'dark' ? '#fff' : 'inherit',
              },
              '& .MuiSvgIcon-root': {
                color: themeMode === 'dark' ? '#fff' : 'rgba(0,0,0,0.54)',
              },
              '& .MuiInputBase-input::placeholder': {
                color: themeMode === 'dark' ? '#bbb' : '#777',
                opacity: 1,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: themeMode === 'dark' ? '#fff' : 'rgba(0,0,0,0.23)',
              },
              // Optional: border color on hover/focus
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: themeMode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: themeMode === 'dark' ? '#fff' : '#1976d2', // primary color on focus
              },
            }}
          />
        </motion.div>

        {/* Forms Grid */}
        {filteredForms.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="card-spotlight bg-card/50 backdrop-blur-sm max-w-md mx-auto">
              <CardContent className="p-12">
                <Assignment className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <Typography variant="h6" className="font-semibold mb-2">
                  {searchQuery ? 'No forms found' : 'No forms yet'}
                </Typography>
                <Typography variant="body2" className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? 'Try adjusting your search query'
                    : 'Create your first form to get started'
                  }
                </Typography>
                
                {!searchQuery && (
                  <motion.div className='mt-4' whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link to="/create">
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Add />}
                        className="gradient-button"
                      >
                        Create First Form
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form, index) => (
              <div key={form.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <Card 
                    className="card-spotlight h-full bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-card cursor-pointer"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
                      e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
                    }}
                  >
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex-1">
                        <Typography variant="h6" className="font-semibold mb-2 line-clamp-2">
                          {form.name}
                        </Typography>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Chip 
                            label={`${form.fields.length} fields`} 
                            size="small" 
                            variant="outlined"
                            color="primary"
                          />
                        </div>
                        
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                          <AccessTime fontSize="small" />
                          <span>Updated {formatDate(form.updatedAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-4 border-t border-border">
                        <motion.div 
                          className="flex-1"
                          whileHover={{ scale: 1.02 }} 
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Preview />}
                            fullWidth
                            onClick={() => handlePreviewForm(form.id)}
                          >
                            Preview
                          </Button>
                        </motion.div>
                        
                        <motion.div 
                          className="flex-1"
                          whileHover={{ scale: 1.02 }} 
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link to="/create">
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<Edit />}
                              fullWidth
                              className="gradient-button"
                              onClick={() => handleLoadForm(form.id)}
                            >
                              Edit
                            </Button>
                          </Link>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </Container>
  );
};

export default MyFormsPage;
