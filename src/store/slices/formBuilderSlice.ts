import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  required: boolean;
  defaultValue?: string;
  options?: string[]; // for select/radio/checkbox
  validation?: {
    minLength?: number;
    maxLength?: number;
    email?: boolean;
    pattern?: string;
  };
  isDerived?: boolean;
  derivedConfig?: {
    parentFields: string[];
    formula: string;
  };
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

interface FormBuilderState {
  currentForm: FormSchema | null;
  savedForms: FormSchema[];
  draggedField: FormField | null;
  editingFieldId: string | null;
}

const initialState: FormBuilderState = {
  currentForm: null,
  savedForms: JSON.parse(localStorage.getItem('upliance-forms') || '[]'),
  draggedField: null,
  editingFieldId: null,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    // Add the new reducer to reset the current form state
    resetCurrentForm: (state) => {
      state.currentForm = null;
    },
    
    createNewForm: (state, action: PayloadAction<string>) => {
      const newForm: FormSchema = {
        id: crypto.randomUUID(),
        name: action.payload,
        fields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.currentForm = newForm;
      // It's a good practice to ensure the savedForms array is also consistent.
      // If a form with the same ID already exists, it will be updated when saving.
      // For now, we'll keep the logic of handling saved forms within the saveForm reducer.
    },
    
    addField: (state, action: PayloadAction<Omit<FormField, 'id'>>) => {
      if (state.currentForm) {
        const newField: FormField = {
          id: crypto.randomUUID(),
          ...action.payload,
        };
        state.currentForm.fields.push(newField);
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },
    
    updateField: (state, action: PayloadAction<{ id: string; updates: Partial<FormField> }>) => {
      if (state.currentForm) {
        const fieldIndex = state.currentForm.fields.findIndex(f => f.id === action.payload.id);
        if (fieldIndex !== -1) {
          state.currentForm.fields[fieldIndex] = {
            ...state.currentForm.fields[fieldIndex],
            ...action.payload.updates,
          };
          state.currentForm.updatedAt = new Date().toISOString();
        }
      }
    },
    
    removeField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },
    
    reorderFields: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      if (state.currentForm) {
        const { oldIndex, newIndex } = action.payload;
        const [removed] = state.currentForm.fields.splice(oldIndex, 1);
        state.currentForm.fields.splice(newIndex, 0, removed);
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },
    
    saveForm: (state) => {
      if (state.currentForm) {
        const existingIndex = state.savedForms.findIndex(f => f.id === state.currentForm!.id);
        if (existingIndex !== -1) {
          state.savedForms[existingIndex] = state.currentForm;
        } else {
          state.savedForms.push(state.currentForm);
        }
        localStorage.setItem('upliance-forms', JSON.stringify(state.savedForms));
      }
    },
    
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        state.currentForm = { ...form };
      }
    },
    
    setDraggedField: (state, action: PayloadAction<FormField | null>) => {
      state.draggedField = action.payload;
    },
    
    setEditingField: (state, action: PayloadAction<string | null>) => {
      state.editingFieldId = action.payload;
    },
  },
});

export const {
  resetCurrentForm, // Export the new action
  createNewForm,
  addField,
  updateField,
  removeField,
  reorderFields,
  saveForm,
  loadForm,
  setDraggedField,
  setEditingField,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;