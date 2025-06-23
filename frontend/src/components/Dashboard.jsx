import { useState, useEffect } from "react";
import {
  Plus,
  Home,
  Clock,
  CheckCircle,
  BarChart3,
  Settings,
  MoreHorizontal,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/api";
import TaskModal from "./TaskModal";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      console.log("Fetching tasks..."); // Debug log
      const response = await apiService.getTasks();
      console.log("Tasks response:", response); // Debug log

      if (response.success) {
        setTasks(response.tasks || []);
        setError(null);
      } else {
        console.error("Failed to fetch tasks:", response.message);
        setTasks([]);
        setError(response.message || "Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      console.log("Creating task with data:", taskData); // Debug log
      const response = await apiService.createTask(taskData);
      console.log("Create task response:", response); // Debug log

      if (response.success && response.task) {
        setTasks([response.task, ...tasks]);
        setShowTaskModal(false);
        setError(null);
      } else {
        console.error("Failed to create task:", response.message);
        setError(response.message || "Failed to create task");
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      setError(error.message);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      console.log("Updating task:", taskId, "with data:", taskData); // Debug log
      const response = await apiService.updateTask(taskId, taskData);
      console.log("Update task response:", response); // Debug log

      if (response.success && response.task) {
        setTasks(
          tasks.map((task) => (task._id === taskId ? response.task : task))
        );
        setShowTaskModal(false);
        setSelectedTask(null);
        setError(null);
      } else {
        console.error("Failed to update task:", response.message);
        setError(response.message || "Failed to update task");
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      setError(error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      console.log("Deleting task:", taskId); // Debug log
      const response = await apiService.deleteTask(taskId);
      console.log("Delete task response:", response); // Debug log

      if (response.success) {
        setTasks(tasks.filter((task) => task._id !== taskId));
        setShowTaskModal(false);
        setSelectedTask(null);
        setError(null);
      } else {
        console.error("Failed to delete task:", response.message);
        setError(response.message || "Failed to delete task");
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      setError(error.message);
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      if (!task) return;

      const updatedTaskData = {
        ...task,
        completed: completed,
      };

      await handleUpdateTask(taskId, updatedTaskData);
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
      setError(error.message);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const lowPriority = tasks.filter((task) => task.priority === "Low").length;
    const mediumPriority = tasks.filter(
      (task) => task.priority === "Medium"
    ).length;
    const highPriority = tasks.filter(
      (task) => task.priority === "High"
    ).length;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      lowPriority,
      mediumPriority,
      highPriority,
      completionRate,
    };
  };

  const stats = getTaskStats();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "text-green-600 bg-green-100";
      case "Medium":
        return "text-orange-600 bg-orange-100";
      case "High":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Today") {
      if (!task.dueDate) return false;
      return (
        new Date(task.dueDate).toDateString() === new Date().toDateString()
      );
    }
    if (activeFilter === "Week") {
      if (!task.dueDate) return false;
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return new Date(task.dueDate) <= weekFromNow;
    }
    return task.priority === activeFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-sm border-r border-gray-200 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-800">TaskFlow</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  Hey, {user?.name}
                </p>
                <p className="text-sm text-purple-500">
                  🚀 Let's crush some tasks!
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">PRODUCTIVITY</div>
            <div className="text-2xl font-bold text-purple-500">
              {stats.completionRate}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
          </div>

          <nav className="space-y-2">
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-purple-50 text-purple-600"
            >
              <Home size={20} />
              <span>Dashboard</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <Clock size={20} />
              <span>Pending Tasks</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <CheckCircle size={20} />
              <span>Completed Tasks</span>
            </a>
          </nav>

          <div className="mt-8 p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">Pro Tip</h3>
            <p className="text-sm text-purple-600 mb-3">
              Use keyboard shortcuts to boost productivity!
            </p>
            <a href="#" className="text-sm text-purple-500 underline">
              Visit Hexagon Digital Services
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 p-4 lg:p-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-800"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-lg font-bold text-gray-800">TaskFlow</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center"
              >
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0)}
                </span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <p className="font-medium text-gray-800">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-left text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Home className="mr-2" size={24} />
                Task Overview
              </h1>
              <p className="text-gray-600">Manage your tasks efficiently</p>
            </div>
            <button
              onClick={() => setShowTaskModal(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus size={20} />
              <span>Add New Task</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl lg:text-2xl font-bold text-gray-800">
                    {stats.total}
                  </p>
                  <p className="text-sm lg:text-base text-gray-600">
                    Total Tasks
                  </p>
                </div>
                <Home className="text-purple-500" size={20} />
              </div>
            </div>
            <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl lg:text-2xl font-bold text-green-600">
                    {stats.lowPriority}
                  </p>
                  <p className="text-sm lg:text-base text-gray-600">
                    Low Priority
                  </p>
                </div>
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl lg:text-2xl font-bold text-orange-600">
                    {stats.mediumPriority}
                  </p>
                  <p className="text-sm lg:text-base text-gray-600">
                    Medium Priority
                  </p>
                </div>
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-orange-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl lg:text-2xl font-bold text-red-600">
                    {stats.highPriority}
                  </p>
                  <p className="text-sm lg:text-base text-gray-600">
                    High Priority
                  </p>
                </div>
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <span className="text-gray-600 font-medium">Filter:</span>
            <div className="flex flex-wrap gap-2">
              {["All", "Today", "Week", "High", "Medium", "Low"].map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      activeFilter === filter
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filter}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tasks found
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeFilter === "All"
                    ? "Create your first task to get started!"
                    : `No ${activeFilter.toLowerCase()} tasks found.`}
                </p>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto"
                >
                  <Plus size={20} />
                  <span>Add New Task</span>
                </button>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start sm:items-center justify-between space-x-4">
                    <div className="flex items-start sm:items-center space-x-4 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(e) =>
                          handleToggleComplete(task._id, e.target.checked)
                        }
                        className="w-5 h-5 text-purple-500 rounded focus:ring-purple-500 mt-1 sm:mt-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-medium text-sm sm:text-base ${
                            task.completed
                              ? "line-through text-gray-500"
                              : "text-gray-800"
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {task.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2 sm:hidden">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center space-x-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="text-sm text-gray-500">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowTaskModal(true);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTask(task);
                        setShowTaskModal(true);
                      }}
                      className="sm:hidden text-gray-400 hover:text-gray-600"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add New Task Button */}
          <button
            onClick={() => setShowTaskModal(true)}
            className="w-full mt-6 border-2 border-dashed border-purple-300 text-purple-500 py-4 rounded-lg hover:border-purple-400 hover:text-purple-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus size={20} />
            <span>Add New Task</span>
          </button>
        </div>

        {/* Right Sidebar - Hidden on mobile */}
        <div className="hidden xl:block w-80 bg-white border-l border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <BarChart3 className="mr-2" size={20} />
              Task Statistics
            </h2>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Settings size={20} />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <p className="font-medium text-gray-800">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-left text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-1">
                {stats.total}
              </div>
              <div className="text-gray-600">Total Tasks</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-1">
                {stats.completed}
              </div>
              <div className="text-gray-600">Completed</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-1">
                {stats.pending}
              </div>
              <div className="text-gray-600">Pending</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-1">
                {stats.completionRate}%
              </div>
              <div className="text-gray-600">Completion Rate</div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Clock className="mr-2" size={16} />
                Task Progress
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-500 h-3 rounded-full"
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
              <div className="text-right text-sm text-gray-600 mt-1">
                {stats.completed}/{stats.total}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Clock className="mr-2" size={16} />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        task.completed
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {task.completed ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => setShowTaskModal(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center z-30"
      >
        <Plus size={24} />
      </button>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          onSave={
            selectedTask
              ? (taskData) => handleUpdateTask(selectedTask._id, taskData)
              : handleCreateTask
          }
          onDelete={
            selectedTask ? () => handleDeleteTask(selectedTask._id) : null
          }
        />
      )}
    </div>
  );
};

export default Dashboard;
