import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import {
  LogOut,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Briefcase,
} from "lucide-react";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  createdBy?: {
    name: string;
    email: string;
    role: string;
  };
}

export const TaskDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search, filter, sorting, pagination state
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("-createdAt");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(5);
  const [meta, setMeta] = useState({
    totalDocs: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formTitle, setFormTitle] = useState<string>("");
  const [formDesc, setFormDesc] = useState<string>("");
  const [formStatus, setFormStatus] = useState<"Pending" | "In Progress" | "Completed">("Pending");
  const [formPriority, setFormPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [formDueDate, setFormDueDate] = useState<string>("");

  // Toast / notification state
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch tasks callback
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        page,
        limit,
        sort: sortOption,
      };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const res = await api.get("/tasks", { params });
      if (res.data && res.data.success) {
        setTasks(res.data.data);
        setMeta(res.data.meta);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to load tasks.";
      setError(errMsg);
      triggerNotification(errMsg, "error");
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortOption, search, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle CRUD tasks
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setFormTitle("");
    setFormDesc("");
    setFormStatus("Pending");
    setFormPriority("Medium");
    setFormDueDate(new Date(Date.now() + 86400000).toISOString().split("T")[0]); // tomorrow default
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDesc(task.description);
    setFormStatus(task.status);
    setFormPriority(task.priority);
    // Parse to date string YYYY-MM-DD
    const dateStr = new Date(task.dueDate).toISOString().split("T")[0];
    setFormDueDate(dateStr);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await api.delete(`/tasks/${id}`);
      if (res.data && res.data.success) {
        triggerNotification("Task deleted successfully");
        fetchTasks();
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Unauthorized to delete task.";
      triggerNotification(errMsg, "error");
    }
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDesc || !formDueDate) {
      triggerNotification("Please fill in all fields.", "error");
      return;
    }

    try {
      const isoDueDate = new Date(formDueDate).toISOString();
      const taskData = {
        title: formTitle,
        description: formDesc,
        status: formStatus,
        priority: formPriority,
        dueDate: isoDueDate,
      };

      if (editingTask) {
        // Edit Task
        const res = await api.put(`/tasks/${editingTask._id}`, taskData);
        if (res.data && res.data.success) {
          triggerNotification("Task updated successfully");
          setIsModalOpen(false);
          fetchTasks();
        }
      } else {
        // Create Task
        const res = await api.post("/tasks", taskData);
        if (res.data && res.data.success) {
          triggerNotification("Task created successfully");
          setIsModalOpen(false);
          fetchTasks();
        }
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Operation failed.";
      triggerNotification(errMsg, "error");
    }
  };

  // Role permissions
  const canModifyTasks = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  // Task count summaries
  const pendingCount = tasks.filter((t) => t.status === "Pending").length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  return (
    <div className="flex flex-col min-h-screen bg-dark text-white overflow-y-auto">
      {/* Toast Alert */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-sm transition-all duration-300 ${
            notification.type === "success"
              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-200"
              : "bg-red-500/20 border-red-500/30 text-red-200"
          }`}
        >
          {notification.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="flex items-center justify-between p-4 md:px-8 border-b border-white/10 glass-panel">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-yellow flex items-center justify-center text-dark font-black font-barlow text-xl">
            TF
          </div>
          <div>
            <h1 className="text-xl font-bold font-barlow tracking-wider text-yellow">TASKFORGE</h1>
            <p className="text-[10px] tracking-widest opacity-60 uppercase">ENTERPRISE SYSTEM</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-[10px] text-yellow font-bold uppercase tracking-wider">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold tracking-wider transition"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT</span>
          </button>
        </div>
      </header>

      {/* Main dashboard view */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* KPI Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl glass-panel border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-white/50 uppercase">Total Tasks</p>
              <h3 className="text-3xl font-black font-barlow text-yellow mt-1">{meta.totalDocs}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-yellow/15 flex items-center justify-center text-yellow">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl glass-panel border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-white/50 uppercase">Active/Pending</p>
              <h3 className="text-3xl font-black font-barlow text-sky-400 mt-1">{pendingCount}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-sky-500/15 flex items-center justify-center text-sky-400">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl glass-panel border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-white/50 uppercase">Completed</p>
              <h3 className="text-3xl font-black font-barlow text-emerald-400 mt-1">{completedCount}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search, Filter, Sort and Actions Bar */}
        <div className="p-4 rounded-xl glass-panel space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 rounded-lg glass-input text-xs"
                placeholder="Search tasks by title or description..."
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {/* Status filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="pl-3 pr-8 py-2 rounded-lg glass-input text-xs appearance-none cursor-pointer"
                >
                  <option className="bg-[#0d1220] text-white" value="">All Statuses</option>
                  <option className="bg-[#0d1220] text-white" value="Pending">Pending</option>
                  <option className="bg-[#0d1220] text-white" value="In Progress">In Progress</option>
                  <option className="bg-[#0d1220] text-white" value="Completed">Completed</option>
                </select>
                <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
              </div>

              {/* Priority filter */}
              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(e) => {
                    setPriorityFilter(e.target.value);
                    setPage(1);
                  }}
                  className="pl-3 pr-8 py-2 rounded-lg glass-input text-xs appearance-none cursor-pointer"
                >
                  <option className="bg-[#0d1220] text-white" value="">All Priorities</option>
                  <option className="bg-[#0d1220] text-white" value="Low">Low</option>
                  <option className="bg-[#0d1220] text-white" value="Medium">Medium</option>
                  <option className="bg-[#0d1220] text-white" value="High">High</option>
                </select>
                <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
              </div>

              {/* Sort Order */}
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setPage(1);
                  }}
                  className="pl-3 pr-8 py-2 rounded-lg glass-input text-xs appearance-none cursor-pointer"
                >
                  <option className="bg-[#0d1220] text-white" value="-createdAt">Newest First</option>
                  <option className="bg-[#0d1220] text-white" value="createdAt">Oldest First</option>
                  <option className="bg-[#0d1220] text-white" value="dueDate">Due Date (Asc)</option>
                  <option className="bg-[#0d1220] text-white" value="-dueDate">Due Date (Desc)</option>
                  <option className="bg-[#0d1220] text-white" value="title">Title (A-Z)</option>
                </select>
                <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
              </div>

              {/* Create Button (visible to all but shows restrictions based on role) */}
              <button
                onClick={canModifyTasks ? handleOpenCreateModal : () => triggerNotification("Only Admins and Super Admins can manage tasks.", "error")}
                className="flex items-center gap-1.5 px-4.5 py-2 rounded-lg bg-yellow hover:bg-[#ffe540] text-dark font-bold font-barlow tracking-wider text-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>NEW TASK</span>
              </button>
            </div>
          </div>
        </div>

        {/* Task Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="h-8 w-8 border-4 border-yellow border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-white/60 tracking-wider">RETRIEVING SECURE PIPELINE...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center glass-panel rounded-xl border border-red-500/20 text-red-200">
            <p className="text-sm font-semibold">{error}</p>
            <button onClick={fetchTasks} className="mt-3 px-4 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-xs">
              RETRY CONNECTION
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-xl text-white/50">
            <Briefcase className="w-12 h-12 mx-auto opacity-30 mb-3" />
            <p className="text-sm font-medium">No tasks found matching your filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="p-5 rounded-xl glass-panel border border-white/5 hover:border-white/15 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 items-center">
                    <h4 className="text-base font-bold truncate text-white">{task.title}</h4>
                    
                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        task.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                          : task.status === "In Progress"
                          ? "bg-sky-500/10 text-sky-400 border border-sky-500/25"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                      }`}
                    >
                      {task.status}
                    </span>

                    {/* Priority Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        task.priority === "High"
                          ? "bg-red-500/10 text-red-400 border border-red-500/25"
                          : task.priority === "Medium"
                          ? "bg-yellow/15 text-yellow border border-yellow/25"
                          : "bg-slate-500/10 text-slate-400 border border-slate-500/25"
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed max-w-2xl">{task.description}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-white/40 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </span>
                    <span>•</span>
                    <span>Created By: {task.createdBy?.name || "System"} ({task.createdBy?.role || "USER"})</span>
                  </div>
                </div>

                {/* Task Actions (Only for Admin/Super Admin) */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  {canModifyTasks ? (
                    <>
                      <button
                        onClick={() => handleOpenEditModal(task)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/5 transition"
                        title="Edit Task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/10 transition"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-white/30 italic">View Only</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && tasks.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <p className="text-xs text-white/40">
              Showing page {page} of {meta.totalPages} ({meta.totalDocs} total items)
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={!meta.hasPrevPage}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition text-white"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
              <button
                disabled={!meta.hasNextPage}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition text-white"
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* CRUD Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl glass-panel text-white shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold font-barlow tracking-wider text-yellow">
                {editingTask ? "EDIT TASK SCHEDULER" : "CREATE NEW TASK"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
              >
                <LogOut className="rotate-180 w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg glass-input text-sm"
                  placeholder="Task title details..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                  Description
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg glass-input text-sm h-24 resize-none"
                  placeholder="Detailed description..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-lg glass-input text-sm appearance-none cursor-pointer"
                  >
                    <option className="bg-[#0d1220] text-white" value="Pending">Pending</option>
                    <option className="bg-[#0d1220] text-white" value="In Progress">In Progress</option>
                    <option className="bg-[#0d1220] text-white" value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-lg glass-input text-sm appearance-none cursor-pointer"
                  >
                    <option className="bg-[#0d1220] text-white" value="Low">Low</option>
                    <option className="bg-[#0d1220] text-white" value="Medium">Medium</option>
                    <option className="bg-[#0d1220] text-white" value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg glass-input text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-4 rounded-lg bg-yellow hover:bg-[#ffe540] text-dark font-bold font-barlow tracking-widest text-lg transition duration-200"
              >
                {editingTask ? "UPDATE CONFIGURATION" : "GENERATE TASK"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
