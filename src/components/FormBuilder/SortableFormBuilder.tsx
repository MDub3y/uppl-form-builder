
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { RootState } from '../../store';
import { reorderFields, setEditingField } from '../../store/slices/formBuilderSlice';
import DraggableFieldItem from './DraggableFieldItem';

const SortableFormBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const { currentForm, editingFieldId } = useSelector((state: RootState) => state.formBuilder);
  const [activeField, setActiveField] = React.useState<any>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const field = currentForm?.fields.find(f => f.id === active.id);
    setActiveField(field);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && currentForm) {
      const oldIndex = currentForm.fields.findIndex((field) => field.id === active.id);
      const newIndex = currentForm.fields.findIndex((field) => field.id === over.id);

      dispatch(reorderFields({ oldIndex, newIndex }));
    }
    setActiveField(null);
  };

  const handleEditField = (fieldId: string) => {
    dispatch(setEditingField(editingFieldId === fieldId ? null : fieldId));
  };

  const handleStopEdit = () => {
    dispatch(setEditingField(null));
  };

  if (!currentForm) {
    return null;
  }

  if (currentForm.fields.length === 0) {
    return (
      <div className="text-center py-20">
        <Add className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <Typography variant="h6" className="text-muted-foreground mb-2">
          Start Building Your Form
        </Typography>
        <Typography variant="body2" className="text-muted-foreground">
          Add fields from the sidebar to get started
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Typography variant="h5" className="font-semibold mb-6">
        Form Preview
      </Typography>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext 
          items={currentForm.fields.map(field => field.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {currentForm.fields.map((field, index) => (
              
                <DraggableFieldItem
                  field={field}
                  index={index}
                  isEditing={editingFieldId === field.id}
                  onEdit={handleEditField}
                  onStopEdit={handleStopEdit}
                />
              
            ))}
          </AnimatePresence>
        </SortableContext>
        
        <DragOverlay>
          {activeField && (
            <motion.div
              initial={{ scale: 1.05 }}
              animate={{ scale: 1.05 }}
              className="opacity-90"
            >
              <DraggableFieldItem
                field={activeField}
                index={0}
                isEditing={false}
                onEdit={() => {}}
                onStopEdit={() => {}}
              />
            </motion.div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default SortableFormBuilder;
