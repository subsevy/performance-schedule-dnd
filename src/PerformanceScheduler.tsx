import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import teamList from "./data.json";

interface Item {
  id: string;
  names: string[];
  type: string;
  teamName: string;
}

interface WarningStatus {
  warningNames: boolean[];
  warningType: boolean;
}

export default function PerformanceScheduler() {
  const [items, setItems] = useState<Item[]>(teamList);

  const [warnings, setWarnings] = useState<Record<string, WarningStatus>>({});

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      setItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleNameChange = (id: string, index: number, value: string) => {
    setItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              names: item.names.map((n, i) => (i === index ? value : n)),
            }
          : item
      )
    );
  };

  const handleTypeChange = (id: string, value: string) => {
    setItems((items) =>
      items.map((item) => (item.id === id ? { ...item, type: value } : item))
    );
  };

  useEffect(() => {
    const newWarnings: Record<string, WarningStatus> = {};

    const nameToRowsMap: Record<string, number[]> = {};

    items.forEach((item, idx) => {
      item.names.forEach((name) => {
        if (name !== "") {
          if (!nameToRowsMap[name]) nameToRowsMap[name] = [];
          nameToRowsMap[name].push(idx);
        }
      });
    });

    items.forEach((item) => {
      newWarnings[item.id] = {
        warningNames: item.names.map(() => false),
        warningType: false,
      };
    });

    Object.entries(nameToRowsMap).forEach(([name, indices]) => {
      indices.sort((a, b) => a - b);
      for (let i = 0; i < indices.length; i++) {
        for (let j = i + 1; j < indices.length; j++) {
          if (indices[j] - indices[i] <= 3) {
            [indices[i], indices[j]].forEach((rowIdx) => {
              const item = items[rowIdx];
              item.names.forEach((n, nameIndex) => {
                if (n === name) {
                  newWarnings[item.id].warningNames[nameIndex] = true;
                }
              });
            });
          }
        }
      }
    });

    items.forEach((item, idx) => {
      if (
        idx < items.length - 1 &&
        item.type !== "" &&
        item.type === items[idx + 1].type
      ) {
        newWarnings[item.id].warningType = true;
        newWarnings[items[idx + 1].id].warningType = true;
      }
    });

    setWarnings(newWarnings);
  }, [items]);

  return (
    <div style={{ width: 1000, margin: "auto" }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map(({ id, names, type, teamName }) => (
            <SortableItem
              key={id}
              id={id}
              names={names}
              type={type}
              onNameChange={handleNameChange}
              onTypeChange={handleTypeChange}
              warningNames={warnings[id]?.warningNames ?? [false, false, false]}
              warningType={warnings[id]?.warningType ?? false}
              teamName={teamName}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
