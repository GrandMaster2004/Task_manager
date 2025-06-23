const API_BASE_URL = "https://task-manager-5e6t.onrender.com/api";

class ApiService {
  constructor() {
    this.token = localStorage.getItem("token");
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem("token");
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log(`Making request to: ${url}`, config); // Debug log
      const response = await fetch(url, config);

      // Handle different response types
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      console.log(`Response from ${url}:`, response.status, data); // Debug log

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          this.removeToken();
          throw new Error("Authentication failed. Please login again.");
        }
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    return this.request("/user/register", {
      method: "POST",
      body: userData,
    });
  }

  async login(credentials) {
    return this.request("/user/login", {
      method: "POST",
      body: credentials,
    });
  }

  async getCurrentUser() {
    return this.request("/user/me");
  }

  // Task methods - Fixed to match your exact backend routes
  async getTasks() {
    return this.request("/tasks/gp", {
      method: "GET",
    });
  }

  async createTask(taskData) {
    // Transform the data to match backend expectations
    const transformedData = {
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority || "Low",
      dueDate: taskData.dueDate || null,
      completed: taskData.completed || false,
    };

    console.log("Creating task with data:", transformedData); // Debug log

    return this.request("/tasks/gp", {
      method: "POST",
      body: transformedData,
    });
  }

  async updateTask(taskId, taskData) {
    // Transform the data to match backend expectations
    const transformedData = {
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority || "Low",
      dueDate: taskData.dueDate || null,
      completed: taskData.completed || false,
    };

    console.log("Updating task with data:", transformedData); // Debug log

    return this.request(`/tasks/${taskId}/gp`, {
      method: "POST", // Your backend uses POST for updates
      body: transformedData,
    });
  }

  async deleteTask(taskId) {
    console.log("Deleting task:", taskId); // Debug log
    return this.request(`/tasks/${taskId}/gp`, {
      method: "DELETE",
    });
  }

  async getTaskById(taskId) {
    return this.request(`/tasks/${taskId}/gp`, {
      method: "GET",
    });
  }
}

export default new ApiService();
