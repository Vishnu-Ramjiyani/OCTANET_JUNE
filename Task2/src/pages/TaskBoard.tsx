import { useState, useMemo } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { Plus, Search, Filter } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import TaskColumn from '../components/tasks/TaskColumn';
import TaskDialog from '../components/tasks/TaskDialog';
import Navbar from '../components/Layout/Navbar';
import type { Task, TaskStatus } from '../types/Task';

export default function TaskBoard() {
    const { tasks, updateTask, deleteTask, createTask, loading } = useTasks();
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const handleCreateTask = () => {
        setEditingTask(null);
        setIsTaskDialogOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsTaskDialogOpen(true);
    };

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
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-gray-900 transition-colors">
            <Navbar />

            <main className="flex-1 p-4 sm:p-8 overflow-visible lg:overflow-hidden flex flex-col max-w-[1600px] mx-auto w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">Board</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Manage your team's tasks here.</p>
                    </div>

                    <button
                        onClick={handleCreateTask}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        New Task
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none transition-colors"
                        >
                            <option value="all">All Columns</option>
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Completed</option>
                        </select>
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none transition-colors"
                        >
                            <option value="all">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex-1 overflow-x-hidden overflow-y-visible lg:overflow-x-auto lg:overflow-y-hidden pb-4">
                        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 h-auto lg:h-full min-w-[320px] lg:min-w-0">
                            {columns
                                .filter(col => filterStatus === 'all' || col.id === filterStatus)
                                .map(col => (
                                    <div key={col.id} className="h-full">
                                        <TaskColumn
                                            status={col.id}
                                            title={col.title}
                                            tasks={filteredTasks.filter(t => t.status === col.id)}
                                            onDeleteTask={deleteTask}
                                            onEditTask={handleEditTask}
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                </DragDropContext>
            </main>

            <TaskDialog
                isOpen={isTaskDialogOpen}
                onClose={() => setIsTaskDialogOpen(false)}
                onCreate={createTask}
                onUpdate={updateTask}
                task={editingTask}
            />
        </div>
    );
}
