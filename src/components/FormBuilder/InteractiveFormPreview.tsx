
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { z } from 'zod';
import { RootState } from '../../store';
import { FormField } from '../../store/slices/formBuilderSlice';

const InteractiveFormPreview: React.FC = () => {
  const currentForm = useSelector((state: RootState) => state.formBuilder.currentForm);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [derivedValues, setDerivedValues] = useState<Record<string, any>>({});

  // Initialize form data with default values
  useEffect(() => {
    if (currentForm) {
      const initialData: Record<string, any> = {};
      currentForm.fields.forEach(field => {
        if (field.defaultValue) {
          initialData[field.id] = field.defaultValue;
        } else if (field.type === 'checkbox') {
          initialData[field.id] = [];
        }
      });
      setFormData(initialData);
    }
  }, [currentForm]);

  // Calculate derived field values
  useEffect(() => {
    if (currentForm) {
      const newDerivedValues: Record<string, any> = {};
      
      currentForm.fields.forEach(field => {
        if (field.isDerived && field.derivedConfig) {
          try {
            // Simple formula evaluation (for demo purposes)
            const formula = field.derivedConfig.formula;
            const parentValues = field.derivedConfig.parentFields.map(
              parentId => formData[parentId] || 0
            );
            
            // Basic arithmetic operations
            if (formula.includes('+')) {
              newDerivedValues[field.id] = parentValues.reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
            } else if (formula.includes('-')) {
              newDerivedValues[field.id] = parentValues.reduce((a, b) => (Number(a) || 0) - (Number(b) || 0));
            } else if (formula.includes('*')) {
              newDerivedValues[field.id] = parentValues.reduce((a, b) => (Number(a) || 0) * (Number(b) || 0), 1);
            } else if (formula.includes('/')) {
              newDerivedValues[field.id] = parentValues.reduce((a, b) => (Number(a) || 0) / (Number(b) || 1));
            } else {
              // Fallback - use first parent value
              newDerivedValues[field.id] = parentValues[0] || '';
            }
          } catch (error) {
            newDerivedValues[field.id] = 'Error';
          }
        }
      });
      
      setDerivedValues(newDerivedValues);
    }
  }, [currentForm, formData]);

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return `${field.label} is required`;
    }

    if (field.validation && value) {
      const validation = field.validation;
      
      if (validation.email && !/\S+@\S+\.\S+/.test(value)) {
        return 'Please enter a valid email address';
      }
      
      if (validation.minLength && value.length < validation.minLength) {
        return `${field.label} must be at least ${validation.minLength} characters`;
      }
      
      if (validation.maxLength && value.length > validation.maxLength) {
        return `${field.label} must be no more than ${validation.maxLength} characters`;
      }
    }

    return null;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentForm) return;

    // Validate all fields
    const newErrors: Record<string, string> = {};
    
    currentForm.fields.forEach(field => {
      if (!field.isDerived) {
        const error = validateField(field, formData[field.id]);
        if (error) {
          newErrors[field.id] = error;
        }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!');
      console.log('Form Data:', formData);
      console.log('Derived Values:', derivedValues);
    }
  };

  const renderField = (field: FormField) => {
    const hasError = !!errors[field.id];
    const value = field.isDerived ? derivedValues[field.id] : formData[field.id];

    switch (field.type) {
      case 'textarea':
        return (
          <TextField
            multiline
            rows={4}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            error={hasError}
            helperText={errors[field.id]}
            fullWidth
            disabled={field.isDerived}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth error={hasError}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || ''}
              label={field.label}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={field.isDerived}
            >
              {field.options?.map((option, i) => (
                <MenuItem key={i} value={option}>{option}</MenuItem>
              ))}
            </Select>
            {hasError && (
              <Typography variant="caption" color="error" className="mt-1">
                {errors[field.id]}
              </Typography>
            )}
          </FormControl>
        );

      case 'radio':
        return (
          <div>
            <Typography variant="body2" className="mb-2 font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Typography>
            <FormControl error={hasError}>
              <RadioGroup
                value={value || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
              >
                {field.options?.map((option, i) => (
                  <FormControlLabel
                    key={i}
                    value={option}
                    control={<Radio disabled={field.isDerived} />}
                    label={option}
                  />
                ))}
              </RadioGroup>
              {hasError && (
                <Typography variant="caption" color="error">
                  {errors[field.id]}
                </Typography>
              )}
            </FormControl>
          </div>
        );

      case 'checkbox':
        return (
          <div>
            <Typography variant="body2" className="mb-2 font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Typography>
            <FormGroup>
              {field.options?.map((option, i) => (
                <FormControlLabel
                  key={i}
                  control={
                    <Checkbox
                      checked={(value || []).includes(option)}
                      onChange={(e) => {
                        const currentValues = value || [];
                        const newValues = e.target.checked
                          ? [...currentValues, option]
                          : currentValues.filter((v: string) => v !== option);
                        handleFieldChange(field.id, newValues);
                      }}
                      disabled={field.isDerived}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
            {hasError && (
              <Typography variant="caption" color="error">
                {errors[field.id]}
              </Typography>
            )}
          </div>
        );

      default:
        return (
          <TextField
            type={field.type}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            error={hasError}
            helperText={errors[field.id]}
            fullWidth
            disabled={field.isDerived}
          />
        );
    }
  };

  if (!currentForm) {
    return (
      <Alert severity="info">
        No form selected. Please create or select a form first.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {currentForm.fields.map((field, index) => (
        <motion.div
          key={field.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="space-y-2"
        >
          <Typography variant="body1" className="font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
            {field.isDerived && (
              <span className="text-blue-500 ml-2 text-sm">(Calculated)</span>
            )}
          </Typography>
          
          {renderField(field)}
        </motion.div>
      ))}
      
      <motion.div 
        className="pt-6 border-t border-border"
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
      >
        <Button
          type="submit"
          variant="contained"
          size="large"
          className="gradient-button px-8 py-3"
          fullWidth
        >
          Submit Form
        </Button>
      </motion.div>
    </form>
  );
};

export default InteractiveFormPreview;
