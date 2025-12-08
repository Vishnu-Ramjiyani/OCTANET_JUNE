import { Draggable } from '@hello-pangea/dnd';
import type { Task } from '../../types/Task';
import { Calendar, Trash2, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

interface TaskCardProps {
    task: Task;
    index: number;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
}

const priorityColors = {
    low: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    medium: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
    high: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
};

export default function TaskCard({ task, index, onDelete, onEdit }: TaskCardProps) {
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={clsx(
                        'bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-3 hover:shadow-md transition-all group relative',
                        snapshot.isDragging ? 'shadow-xl ring-2 ring-indigo-500/20 rotate-1 scale-105 z-50' : ''
                    )}
                    style={{ ...provided.draggableProps.style }}
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className={clsx('text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border', priorityColors[task.priority])}>
                            {task.priority}
                        </div>
                        {task.tag_color && (
                            <div className="w-2.5 h-2.5 rounded-full ring-1 ring-gray-100 dark:ring-gray-600" style={{ backgroundColor: task.tag_color }} />
                        )}
                    </div>

                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1.5 leading-tight">{task.title}</h3>
                    {task.description && <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">{task.description}</p>}

                    <div className="flex justify-between items-center text-gray-400 text-xs mt-2">
                        <div className="flex items-center gap-1.5 font-medium">
                            {task.due_date && (
                                <>
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className={clsx(new Date(task.due_date) < new Date() ? 'text-red-500 dark:text-red-400' : '')}>
                                        {format(new Date(task.due_date), 'MMM d')}
                                    </span>
                                </>
                            )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onEdit(task);
                                }}
                                className="text-gray-300 hover:text-indigo-500 transition-colors p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (confirm('Delete this task?')) onDelete(task.id);
                                }}
                                className="text-gray-300 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
