// src/pages/CreatePage.tsx

import React, { useState, useEffect } from 'react'; // Import useEffect
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Add, 
  Save, 
  Preview,
  TextFields,
  Numbers,
  Subject,
  CheckBox,
  RadioButtonChecked,
  DateRange,
  List
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { RootState } from '../store';
// Import the new action
import { createNewForm, addField, saveForm, FormField, resetCurrentForm } from '../store/slices/formBuilderSlice'; 
import { useToast } from '../hooks/use-toast';
import SortableFormBuilder from '../components/FormBuilder/SortableFormBuilder';

interface LocationState {
  from?: 'edit' | 'preview';
}

const CreatePage: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation(); 
  const { toast } = useToast();
  const currentForm = useSelector((state: RootState) => state.formBuilder.currentForm);
  const [formName, setFormName] = useState('');
  const [showFieldTypes, setShowFieldTypes] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveFormName, setSaveFormName] = useState('');

useEffect(() => {
    // Check if we are navigating to the /create page without a form already loaded.
    // The `currentForm` state is populated by `loadForm` actions.
    // If we're coming from "My Forms" or "Preview," `currentForm` will already be set.
    // Only reset if no form is currently in the state.
    if (!currentForm && location.state?.from !== 'edit' && location.state?.from !== 'preview') {
      dispatch(resetCurrentForm());
    }
  }, [dispatch, currentForm, location.state]);


  const fieldTypes = [
    { type: 'text', label: 'Text', icon: <TextFields /> },
    { type: 'number', label: 'Number', icon: <Numbers /> },
    { type: 'textarea', label: 'Textarea', icon: <Subject /> },
    { type: 'checkbox', label: 'Checkbox', icon: <CheckBox /> },
    { type: 'radio', label: 'Radio', icon: <RadioButtonChecked /> },
    { type: 'date', label: 'Date', icon: <DateRange /> },
    { type: 'select', label: 'Select', icon: <List /> },
  ] as const;

  const handleCreateForm = () => {
    if (!formName.trim()) {
      toast({
        title: "Form name required",
        description: "Please enter a name for your form",
        variant: "destructive",
      });
      return;
    }
    dispatch(createNewForm(formName));
    setFormName('');
    toast({
      title: "Form created",
      description: `Started building "${formName}"`,
    });
  };

  const handleAddField = (type: FormField['type']) => {
    const fieldOptions = type === 'select' || type === 'radio' || type === 'checkbox' 
      ? ['Option 1', 'Option 2'] 
      : undefined;
    
    dispatch(addField({
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      options: fieldOptions,
    }));
    setShowFieldTypes(false);
    toast({
      title: "Field added",
      description: `Added ${type} field to your form`,
    });
  };

  const handleSaveForm = () => {
    if (currentForm) {
      setSaveFormName(currentForm.name);
      setSaveDialogOpen(true);
    }
  };

  const handleConfirmSave = () => {
    if (currentForm && saveFormName.trim()) {
      if (saveFormName !== currentForm.name) {
        dispatch(createNewForm(saveFormName));
        currentForm.fields.forEach(field => {
          dispatch(addField(field));
        });
      }
      dispatch(saveForm());
      setSaveDialogOpen(false);
      toast({
        title: "Form saved",
        description: "Your form has been saved successfully",
      });
    }
  };

  if (!currentForm) {
    return (
      <Container maxWidth="md" className="py-16">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="card-spotlight h-[280px] bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 h-full">
              <Typography variant="h4" className="font-bold mb-6">
                Create New Form
              </Typography>
              <Typography variant="body1" className="text-muted-foreground mb-8">
                Start building your form by giving it a name
              </Typography>
              
              <Box className="max-w-md mx-auto mt-8">
                <TextField
                  fullWidth
                  label="Form Name"
                  variant="outlined"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Contact Form, Survey, Registration"
                  className="mb-6"
                  sx={{ mb: 3 }}
                />
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleCreateForm}
                    className="gradient-button w-full py-3 text-lg font-semibold"
                    disabled={!formName.trim()}
                  >
                    Create Form
                  </Button>
                </motion.div>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="py-8">
      <div className="flex flex-col lg:flex-row gap-8 min-h-screen">
        {/* Sidebar */}
        <motion.div
          className="lg:w-80 space-y-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm sticky top-24">
            <CardContent className="p-6">
              <Typography variant="h6" className="font-semibold mb-4">
                {currentForm.name}
              </Typography>
              
              <div className="space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Add />}
                    onClick={() => setShowFieldTypes(!showFieldTypes)}
                    className="gradient-button"
                  >
                    Add Field
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Save />}
                    onClick={handleSaveForm}
                  >
                    Save Form
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/preview">
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Preview />}
                    >
                      Preview Form
                    </Button>
                  </Link>
                </motion.div>
              </div>

              {/* Field Types */}
              {showFieldTypes && (
                <motion.div
                  className="mt-6 pt-6 border-t border-border"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Typography variant="subtitle2" className="mb-3 font-medium">
                    Field Types
                  </Typography>
                  <div className="grid grid-cols-2 gap-2">
                    {fieldTypes.map((fieldType) => (
                      <div key={fieldType.type}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outlined"
                            fullWidth
                            size="small"
                            startIcon={fieldType.icon}
                            onClick={() => handleAddField(fieldType.type)}
                            className="flex-col h-16 text-xs"
                          >
                            {fieldType.label}
                          </Button>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Builder Area */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-card/30 backdrop-blur-sm min-h-96">
            <CardContent className="p-8">
              <SortableFormBuilder />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Form Name"
            value={saveFormName}
            onChange={(e) => setSaveFormName(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmSave} 
            variant="contained" 
            className="gradient-button"
            disabled={!saveFormName.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreatePage;