import { useState } from 'react';
import { X, Calendar, Tag, AlertCircle } from 'lucide-react';
import type { TaskPriority, TaskStatus } from '../../types/Task';

interface NewTaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (task: any) => Promise<void>;
}

export default function NewTaskDialog({ isOpen, onClose, onCreate }: NewTaskDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium' as TaskPriority,
        status: 'todo' as TaskStatus,
        tag_color: '#3b82f6',
        due_date: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onCreate({
                ...formData,
                due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null
            });
            onClose();
            // Reset form
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                status: 'todo',
                tag_color: '#3b82f6',
                due_date: ''
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-lg p-0 shadow-2xl overflow-hidden scale-100"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-800">Create New Task</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
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
                            className="w-full text-lg font-semibold placeholder:text-gray-400 border-none focus:ring-0 p-0 text-gray-800"
                            placeholder="What needs to be done?"
                            autoFocus
                        />
                    </div>

                    <div>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full text-sm text-gray-600 placeholder:text-gray-400 border-none focus:ring-0 p-0 resize-none min-h-[80px]"
                            placeholder="Add description..."
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-50">
                        <div className="flex-1 min-w-[140px]">
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                <AlertCircle className="w-3.5 h-3.5" /> Priority
                            </label>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                {(['low', 'medium', 'high'] as const).map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, priority: p })}
                                        className={`flex-1 text-xs font-medium py-1.5 rounded-md capitalize transition-all ${formData.priority === p
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 min-w-[140px]">
                            <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                                <Calendar className="w-3.5 h-3.5" /> Due Date
                            </label>
                            <input
                                type="date"
                                value={formData.due_date}
                                onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                            <Tag className="w-3.5 h-3.5" /> Color Tag
                        </label>
                        <div className="flex gap-3">
                            {['#3b82f6', '#22c55e', '#ef4444', '#f97316', '#eab308', '#a855f7', '#ec4899', '#64748b'].map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, tag_color: color })}
                                    className={`w-6 h-6 rounded-full transition-all hover:scale-110 ${formData.tag_color === color
                                        ? 'ring-2 ring-offset-2 ring-gray-300 scale-110'
                                        : 'hover:ring-2 hover:ring-offset-1 hover:ring-gray-200'
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-200"
                        >
                            {loading ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
