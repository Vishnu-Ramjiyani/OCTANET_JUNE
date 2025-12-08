import { useState, useEffect } from 'react';
import { X, Calendar, Tag, AlertCircle, CheckCircle } from 'lucide-react';
import type { Task, TaskPriority, TaskStatus } from '../../types/Task';

interface TaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate?: (task: any) => Promise<void>;
    onUpdate?: (id: string, updates: Partial<Task>) => Promise<void>;
    task?: Task | null;
}

export default function TaskDialog({ isOpen, onClose, onCreate, onUpdate, task }: TaskDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium' as TaskPriority,
        status: 'todo' as TaskStatus,
        tag_color: '#3b82f6',
        due_date: ''
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                priority: task.priority,
                status: task.status,
                tag_color: task.tag_color,
                due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                status: 'todo',
                tag_color: '#3b82f6',
                due_date: ''
            });
        }
    }, [task, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const taskData = {
                ...formData,
                due_date: formData.due_date ? new Date(formData.due_date).toISOString() : undefined
            };

            if (task && onUpdate) {
                await onUpdate(task.id, taskData);
            } else if (onCreate) {
                await onCreate(taskData);
            }

            onClose();
            if (!task) {
                setFormData({
                    title: '',
                    description: '',
                    priority: 'medium',
                    status: 'todo',
                    tag_color: '#3b82f6',
                    due_date: ''
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all" onClick={onClose}>
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-0 shadow-2xl overflow-hidden scale-100 transition-colors"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                        {task ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full text-lg font-semibold placeholder:text-gray-400 dark:placeholder:text-gray-500 border-none focus:ring-0 p-0 text-gray-800 dark:text-white bg-transparent"
                            placeholder="What needs to be done?"
                            autoFocus
                        />
                    </div>

                    <div>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full text-sm text-gray-600 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-none focus:ring-0 p-0 resize-none min-h-[80px] bg-transparent"
                            placeholder="Add description..."
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                        <div className="flex-1 min-w-[140px]">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                <AlertCircle className="w-3.5 h-3.5" /> Priority
                            </label>
                            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                                {(['low', 'medium', 'high'] as const).map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priority: p })}
                                        className={`flex-1 text-xs font-medium py-1.5 rounded-md capitalize transition-all ${formData.priority === p
                                            ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 min-w-[140px]">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                <CheckCircle className="w-3.5 h-3.5" /> Status
                            </label>
                            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                                {[
                                    { value: 'todo', label: 'To Do' },
                                    { value: 'in_progress', label: 'Doing' },
                                    { value: 'done', label: 'Done' }
                                ].map(s => (
                                    <button
                                        key={s.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status: s.value as TaskStatus })}
                                        className={`flex-1 text-xs font-medium py-1.5 rounded-md capitalize transition-all ${formData.status === s.value
                                            ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                            }`}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 min-w-[140px]">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                <Calendar className="w-3.5 h-3.5" /> Due Date
                            </label>
                            <input
                                type="date"
                                value={formData.due_date}
                                onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                            <Tag className="w-3.5 h-3.5" /> Color Tag
                        </label>
                        <div className="flex gap-3 flex-wrap">
                            {['#3b82f6', '#22c55e', '#ef4444', '#f97316', '#eab308', '#a855f7', '#ec4899', '#64748b'].map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, tag_color: color })}
                                    className={`w-6 h-6 rounded-full transition-all hover:scale-110 ${formData.tag_color === color
                                        ? 'ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-600 scale-110'
                                        : 'hover:ring-2 hover:ring-offset-1 hover:ring-gray-200 dark:hover:ring-gray-700'
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-50 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-200 dark:shadow-none"
                        >
                            {loading ? 'Saving...' : (task ? 'Save Changes' : 'Create Task')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
