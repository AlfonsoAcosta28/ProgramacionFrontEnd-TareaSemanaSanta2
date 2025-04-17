<template>
    <div class="home">
      <div class="jumbotron">
        <h1 class="display-4">Bienvenido a la Aplicación Integral</h1>
        <p class="lead">Esta aplicación contiene 5 proyectos integrados en uno solo:</p>
        <hr class="my-4">
        <div class="list-group">
          <RouterLink to="/tasks" class="list-group-item list-group-item-action">
            <h5>1. Lista de Tareas Interactiva</h5>
            <p>Gestiona tus tareas: crear, editar y eliminar.</p>
          </RouterLink>
          <RouterLink to="/converter" class="list-group-item list-group-item-action">
            <h5>2. Conversor de Unidades</h5>
            <p>Convierte entre distintas unidades de medida.</p>
          </RouterLink>
          <RouterLink to="/password-generator" class="list-group-item list-group-item-action">
            <h5>3. Generador de Contraseñas</h5>
            <p>Crea contraseñas seguras personalizadas.</p>
          </RouterLink>
          <RouterLink to="/surveys" class="list-group-item list-group-item-action">
            <h5>4. Encuesta Interactiva con Gráficos</h5>
            <p>Crea y responde encuestas, visualiza resultados.</p>
          </RouterLink>
          <RouterLink to="/events" class="list-group-item list-group-item-action">
            <h5>5. Agenda de Eventos</h5>
            <p>Programa y visualiza tus eventos en un calendario.</p>
          </RouterLink>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomeView'
  }
  </script>
  
  <style scoped>
  .jumbotron {
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 0.3rem;
  }
  </style>