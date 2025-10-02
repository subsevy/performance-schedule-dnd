import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: string;
  names: string[];
  type: string;
  onNameChange: (id: string, index: number, value: string) => void;
  onTypeChange: (id: string, value: string) => void;
  warningNames: boolean[];
  warningType: boolean;
  teamName: string;
}

export function SortableItem({
  id,
  names,
  type,
  onNameChange,
  onTypeChange,
  warningNames,
  warningType,
  teamName,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        padding: 10,
        marginBottom: 8,
        border: "1px solid #ccc",
        backgroundColor: "white",
        display: "flex",
        gap: 10,
        alignItems: "center",
        justifyContent: "flex-start",
      }}
      {...attributes}
    >
      <div {...listeners} style={{ cursor: "grab", paddingRight: 8 }}>
        ≡
      </div>
      <span style={{ width: 150, backgroundColor: "black", color: "white" }}>
        {teamName}
      </span>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <input
          type="text"
          placeholder="타입"
          value={type}
          onChange={(e) => onTypeChange(id, e.target.value)}
          style={{
            width: 100,
            backgroundColor: warningType ? "red" : "gray",
            color: "white",
          }}
          onPointerDown={(e) => e.stopPropagation()}
        />
        {names.map((name, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`이름${idx + 1}`}
            value={name}
            onChange={(e) => onNameChange(id, idx, e.target.value)}
            style={{
              borderColor: warningNames[idx] ? "red" : "#ccc",
              width: 60,
            }}
            onPointerDown={(e) => e.stopPropagation()}
          />
        ))}
      </div>
    </div>
  );
}
