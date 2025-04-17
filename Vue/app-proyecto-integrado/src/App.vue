<template>
  <div class="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <RouterLink class="navbar-brand" to="/">App Integrada</RouterLink>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/tasks">Lista de Tareas</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/converter">Conversor</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/password-generator">Generador de Contraseñas</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/surveys">Encuestas</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/events">Agenda</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <RouterView />
    </div>
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
  name: 'App',
  components: {
    RouterLink,
    RouterView
  }
}
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';

.app {
  font-family: 'Arial', sans-serif;
}

.router-link-active {
  color: white !important;
  font-weight: bold;
}
</style>