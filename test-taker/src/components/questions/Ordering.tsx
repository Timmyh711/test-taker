import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Typography } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { ChoiceLabel } from '../ChoiceLabel';

interface SortableItemProps {
  id: string;
  label: string;
  index: number;
}

function SortableItem({ id, label, index }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 2,
        mb: 1,
        border: '1px solid',
        borderColor: isDragging ? 'primary.main' : 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
        cursor: 'grab',
      }}
      {...attributes}
      {...listeners}
    >
      <DragIndicatorIcon color="action" aria-hidden />
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 24 }}>
        {index + 1}.
      </Typography>
      <ChoiceLabel content={label} />
    </Box>
  );
}

interface Props {
  items: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function Ordering({ items, value, onChange }: Props) {
  const order = value.length === items.length ? value : items;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(String(active.id));
    const newIndex = order.indexOf(String(over.id));
    onChange(arrayMove(order, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        {order.map((item, i) => (
          <SortableItem key={item} id={item} label={item} index={i} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
