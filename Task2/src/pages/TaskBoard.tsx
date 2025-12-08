import { useState, useMemo } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { Plus, Search, Filter } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import TaskColumn from '../components/tasks/TaskColumn';
import NewTaskDialog from '../components/tasks/NewTaskDialog';
import Navbar from '../components/Layout/Navbar';
import type { TaskStatus } from '../types/Task';

export default function TaskBoard() {
    const { tasks, updateTask, deleteTask, createTask, loading } = useTasks();
    const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState<string>('all');

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId as TaskStatus;

        // Sort logic would go here if we were persisting order, for now we just status.
        // Ideally we update the local state immediately to avoid flickers, but useTasks handles that with optimistic updates.
        await updateTask(draggableId, { status: newStatus });
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (task.description || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
            return matchesSearch && matchesPriority;
        });
    }, [tasks, searchQuery, filterPriority]);

    const columns: { id: TaskStatus; title: string }[] = [
        { id: 'todo', title: 'To Do' },
        { id: 'in_progress', title: 'In Progress' },
        { id: 'done', title: 'Completed' }
    ];

    if (loading && tasks.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc]">
            <Navbar />

            <main className="flex-1 p-4 sm:p-8 overflow-hidden flex flex-col max-w-[1600px] mx-auto w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Board</h1>
                        <p className="text-gray-500 mt-1">Manage your team's tasks here.</p>
                    </div>

                    <button
                        onClick={() => setIsNewTaskOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        New Task
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none"
                        >
                            <option value="all">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                        <div className="flex gap-6 h-full min-w-[320px] lg:min-w-0 lg:grid lg:grid-cols-3">
                            {columns.map(col => (
                                <div key={col.id} className="h-full">
                                    <TaskColumn
                                        status={col.id}
                                        title={col.title}
                                        tasks={filteredTasks.filter(t => t.status === col.id)}
                                        onDeleteTask={deleteTask}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </DragDropContext>
            </main>

            <NewTaskDialog
                isOpen={isNewTaskOpen}
                onClose={() => setIsNewTaskOpen(false)}
                onCreate={createTask}
            />
        </div>
    );
}
