import { Droppable } from '@hello-pangea/dnd';
import type { Task, TaskStatus } from '../../types/Task';
import TaskCard from './TaskCard';
import clsx from 'clsx';

interface TaskColumnProps {
    status: TaskStatus;
    tasks: Task[];
    title: string;
    onDeleteTask: (id: string) => void;
}

const statusColors = {
    todo: 'bg-gray-100/50 border-gray-200',
    in_progress: 'bg-blue-50/50 border-blue-100',
    done: 'bg-green-50/50 border-green-100'
};

const headerColors = {
    todo: 'text-gray-700',
    in_progress: 'text-blue-700',
    done: 'text-green-700'
};

export default function TaskColumn({ status, tasks, title, onDeleteTask }: TaskColumnProps) {
    return (
        <div className={clsx("flex flex-col rounded-2xl p-4 min-w-[300px] w-full border h-full backdrop-blur-sm", statusColors[status])}>
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className={clsx("font-bold text-sm uppercase tracking-wider", headerColors[status])}>{title}</h2>
                <span className="bg-white/60 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm border border-gray-100">
                    {tasks.length}
                </span>
            </div>

            <Droppable droppableId={status}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto scrollbar-hide min-h-[150px] transition-colors rounded-xl -mx-2 px-2 ${snapshot.isDraggingOver ? 'bg-white/50' : ''
                            }`}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                index={index}
                                onDelete={onDeleteTask}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
