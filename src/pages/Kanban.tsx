import { KanbanBoard } from "@/components/kanban/KanbanBoard";

export default function Kanban() {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">CRM Kanban</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie seus leads e oportunidades
        </p>
      </div>
      <KanbanBoard />
    </div>
  );
}
