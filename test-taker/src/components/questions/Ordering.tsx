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
import { ChoiceLabel } from '../ChoiceLabel';

interface SortableItemProps {
  id: string;
  label: string;
  index: number;
}

function SortableItem({ id, label, index }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.875rem 0',
        borderBottom: '1px solid var(--border-color)',
        cursor: 'grab',
        background: isDragging ? 'var(--bg-secondary)' : 'transparent',
      }}
      {...attributes}
      {...listeners}
    >
      <span className="utility-text" style={{ minWidth: '1.5rem' }}>
        {index + 1}.
      </span>
      <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} aria-hidden>
        ⠿
      </span>
      <ChoiceLabel content={label} />
    </div>
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
