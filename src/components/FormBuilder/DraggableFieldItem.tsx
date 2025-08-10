
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Button,
  Collapse
} from '@mui/material';
import {
  DragIndicator,
  Delete,
  Edit,
  Save,
  Cancel,
  Add,
  Remove
} from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField, updateField, removeField } from '../../store/slices/formBuilderSlice';

interface DraggableFieldItemProps {
  field: FormField;
  index: number;
  isEditing: boolean;
  onEdit: (id: string) => void;
  onStopEdit: () => void;
}

const DraggableFieldItem: React.FC<DraggableFieldItemProps> = ({
  field,
  index,
  isEditing,
  onEdit,
  onStopEdit
}) => {
  const dispatch = useDispatch();
  const [editForm, setEditForm] = useState(field);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  const handleSave = () => {
    dispatch(updateField({ id: field.id, updates: editForm }));
    onStopEdit();
  };

  const handleCancel = () => {
    setEditForm(field);
    onStopEdit();
  };

  const handleDelete = () => {
    dispatch(removeField(field.id));
  };

  const addOption = () => {
    const newOptions = [...(editForm.options || []), `Option ${(editForm.options?.length || 0) + 1}`];
    setEditForm({ ...editForm, options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = editForm.options?.filter((_, i) => i !== index) || [];
    setEditForm({ ...editForm, options: newOptions });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(editForm.options || [])];
    newOptions[index] = value;
    setEditForm({ ...editForm, options: newOptions });
  };

  const fieldTypeOptions = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Select' },
    { value: 'radio', label: 'Radio' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'date', label: 'Date' },
  ];

  const needsOptions = ['select', 'radio', 'checkbox'].includes(editForm.type);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="mb-4"
      whileHover={!isDragging ? { scale: 1.02, y: -2 } : {}}
    >
      <Card 
        className={`card-spotlight mx-12 border border-border/50 transition-all duration-300 ${
          isDragging 
            ? 'shadow-glow border-primary/50 bg-card/90 backdrop-blur-sm' 
            : 'hover:shadow-elegant hover:border-primary/30'
        }`}
        onMouseMove={(e) => {
          if (!isDragging) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
            e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
          }
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <motion.div 
              {...attributes} 
              {...listeners}
              className="cursor-grab active:cursor-grabbing mt-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <DragIndicator className="text-muted-foreground hover:text-primary transition-colors" />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              {!isEditing ? (
                // Display Mode
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Typography variant="subtitle1" className="font-medium">
                        {field.label}
                      </Typography>
                      <Chip 
                        label={field.type} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                      {field.required && (
                        <Chip 
                          label="Required" 
                          size="small" 
                          color="error" 
                          variant="outlined"
                        />
                      )}
                      {field.isDerived && (
                        <Chip 
                          label="Derived" 
                          size="small" 
                          color="secondary" 
                          variant="outlined"
                        />
                      )}
                    </div>
                    <div className="flex gap-1">
                      <IconButton size="small" onClick={() => onEdit(field.id)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={handleDelete}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                  
                  {/* Field Preview */}
                  <div className="mt-3">
                    {field.type === 'textarea' ? (
                      <TextField
                        multiline
                        rows={3}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        variant="outlined"
                        size="small"
                        disabled
                        fullWidth
                      />
                    ) : field.type === 'select' ? (
                      <FormControl fullWidth size="small" disabled>
                        <InputLabel>Select {field.label.toLowerCase()}</InputLabel>
                        <Select label={`Select ${field.label.toLowerCase()}`}>
                          {field.options?.map((option, i) => (
                            <MenuItem key={i} value={option}>{option}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : field.type === 'radio' || field.type === 'checkbox' ? (
                      <div className="space-y-2">
                        {field.options?.map((option, i) => (
                          <FormControlLabel
                            key={i}
                            control={
                              field.type === 'radio' ? 
                                <input type="radio" name={field.id} disabled /> :
                                <input type="checkbox" disabled />
                            }
                            label={option}
                          />
                        ))}
                      </div>
                    ) : (
                      <TextField
                        type={field.type}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        variant="outlined"
                        size="small"
                        disabled
                        fullWidth
                      />
                    )}
                  </div>
                </>
              ) : (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Typography variant="subtitle1" className="font-medium">
                      Edit Field
                    </Typography>
                    <div className="flex gap-1">
                      <IconButton size="small" color="primary" onClick={handleSave}>
                        <Save fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={handleCancel}>
                        <Cancel fontSize="small" />
                      </IconButton>
                    </div>
                  </div>

                  <TextField
                    label="Field Label"
                    value={editForm.label}
                    onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                    fullWidth
                    size="small"
                  />

                  <FormControl fullWidth size="small">
                    <InputLabel>Field Type</InputLabel>
                    <Select
                      value={editForm.type}
                      label="Field Type"
                      onChange={(e) => setEditForm({ 
                        ...editForm, 
                        type: e.target.value as FormField['type'],
                        options: needsOptions ? ['Option 1', 'Option 2'] : undefined
                      })}
                    >
                      {fieldTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={editForm.required || false}
                        onChange={(e) => setEditForm({ ...editForm, required: e.target.checked })}
                      />
                    }
                    label="Required Field"
                  />

                  <TextField
                    label="Default Value"
                    value={editForm.defaultValue || ''}
                    onChange={(e) => setEditForm({ ...editForm, defaultValue: e.target.value })}
                    fullWidth
                    size="small"
                  />

                  {/* Options for select, radio, checkbox */}
                  {needsOptions && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Typography variant="body2" className="font-medium">
                          Options
                        </Typography>
                        <Button size="small" startIcon={<Add />} onClick={addOption}>
                          Add Option
                        </Button>
                      </div>
                      {editForm.options?.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <TextField
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            size="small"
                            fullWidth
                            placeholder={`Option ${index + 1}`}
                          />
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => removeOption(index)}
                            disabled={editForm.options!.length <= 1}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Validation Rules */}
                  <Collapse in={editForm.type === 'text' || editForm.type === 'textarea'}>
                    <div className="space-y-3 pt-2 border-t border-border">
                      <Typography variant="body2" className="font-medium">
                        Validation Rules
                      </Typography>
                      <div className="grid grid-cols-2 gap-2">
                        <TextField
                          label="Min Length"
                          type="number"
                          size="small"
                          value={editForm.validation?.minLength || ''}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            validation: {
                              ...editForm.validation,
                              minLength: e.target.value ? parseInt(e.target.value) : undefined
                            }
                          })}
                        />
                        <TextField
                          label="Max Length"
                          type="number"
                          size="small"
                          value={editForm.validation?.maxLength || ''}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            validation: {
                              ...editForm.validation,
                              maxLength: e.target.value ? parseInt(e.target.value) : undefined
                            }
                          })}
                        />
                      </div>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={editForm.validation?.email || false}
                            onChange={(e) => setEditForm({
                              ...editForm,
                              validation: {
                                ...editForm.validation,
                                email: e.target.checked
                              }
                            })}
                          />
                        }
                        label="Email Validation"
                      />
                    </div>
                  </Collapse>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DraggableFieldItem;
