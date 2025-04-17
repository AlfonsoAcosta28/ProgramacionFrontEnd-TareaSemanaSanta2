<template>
    <div class="tasks">
      <h1>Lista de Tareas</h1>
      
      <!-- Formulario para agregar tareas -->
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Nueva Tarea</h5>
          <div class="mb-3">
            <label for="taskTitle" class="form-label">Título</label>
            <input type="text" class="form-control" id="taskTitle" v-model="newTask.title">
          </div>
          <div class="mb-3">
            <label for="taskDescription" class="form-label">Descripción</label>
            <textarea class="form-control" id="taskDescription" v-model="newTask.description"></textarea>
          </div>
          <button @click="addTask" class="btn btn-primary">Agregar Tarea</button>
        </div>
      </div>
      
      <!-- Lista de tareas -->
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Mis Tareas</h5>
          
          <div v-if="loading" class="text-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          
          <div v-else-if="tasks.length === 0" class="alert alert-info">
            No hay tareas. ¡Agrega una!
          </div>
          
          <ul v-else class="list-group">
            <li v-for="task in tasks" :key="task.id" class="list-group-item">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <input class="form-check-input me-2" type="checkbox" v-model="task.completed" @change="updateTask(task)">
                  <span :class="{ 'text-decoration-line-through': task.completed }">
                    <strong>{{ task.title }}</strong>
                  </span>
                  <p class="mb-0 text-muted">{{ task.description }}</p>
                </div>
                <div>
                  <button @click="editTask(task)" class="btn btn-sm btn-outline-primary me-1">
                    Editar
                  </button>
                  <button @click="deleteTask(task.id)" class="btn btn-sm btn-outline-danger">
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Modal para editar tarea -->
      <div class="modal fade" id="editTaskModal" tabindex="-1" aria-labelledby="editTaskModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editTaskModalLabel">Editar Tarea</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="editTaskTitle" class="form-label">Título</label>
                <input type="text" class="form-control" id="editTaskTitle" v-model="editingTask.title">
              </div>
              <div class="mb-3">
                <label for="editTaskDescription" class="form-label">Descripción</label>
                <textarea class="form-control" id="editTaskDescription" v-model="editingTask.description"></textarea>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="editTaskCompleted" v-model="editingTask.completed">
                <label class="form-check-label" for="editTaskCompleted">
                  Completada
                </label>
              </div>
            </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="saveEditedTask">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';

export default {
  name: 'TasksView',
  data() {
    return {
      tasks: [],
      loading: true,
      newTask: {
        title: '',
        description: ''
      },
      editingTask: {
        id: null,
        title: '',
        description: '',
        completed: false
      },
      editModal: null
    };
  },
  mounted() {
    this.fetchTasks();
    this.editModal = new Modal(document.getElementById('editTaskModal'));
  },
  methods: {
    async fetchTasks() {
      try {
        this.loading = true;
        const response = await axios.get('http://localhost:3000/api/tasks');
        this.tasks = response.data;
      } catch (error) {
        console.error('Error al cargar tareas:', error);
        alert('No se pudieron cargar las tareas. Intenta de nuevo.');
      } finally {
        this.loading = false;
      }
    },
    async addTask() {
      if (!this.newTask.title.trim()) {
        alert('El título de la tarea es obligatorio');
        return;
      }
      
      try {
        await axios.post('http://localhost:3000/api/tasks', this.newTask);
        this.newTask.title = '';
        this.newTask.description = '';
        this.fetchTasks();
      } catch (error) {
        console.error('Error al agregar tarea:', error);
        alert('No se pudo agregar la tarea. Intenta de nuevo.');
      }
    },
    editTask(task) {
      this.editingTask = { ...task };
      this.editModal.show();
    },
    async saveEditedTask() {
      try {
        await axios.put(`http://localhost:3000/api/tasks/${this.editingTask.id}`, this.editingTask);
        this.editModal.hide();
        this.fetchTasks();
      } catch (error) {
        console.error('Error al actualizar tarea:', error);
        alert('No se pudo actualizar la tarea. Intenta de nuevo.');
      }
    },
    async updateTask(task) {
      try {
        await axios.put(`http://localhost:3000/api/tasks/${task.id}`, task);
      } catch (error) {
        console.error('Error al actualizar tarea:', error);
        task.completed = !task.completed; // Revertir cambio en caso de error
        alert('No se pudo actualizar la tarea. Intenta de nuevo.');
      }
    },
    async deleteTask(id) {
      if (!confirm('¿Estás seguro de eliminar esta tarea?')) {
        return;
      }
      
      try {
        await axios.delete(`http://localhost:3000/api/tasks/${id}`);
        this.fetchTasks();
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
        alert('No se pudo eliminar la tarea. Intenta de nuevo.');
      }
    }
  }
};
</script>