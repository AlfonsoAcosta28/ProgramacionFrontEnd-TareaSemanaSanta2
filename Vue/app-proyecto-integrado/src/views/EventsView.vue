<template>
  <div class="events-view">
    <div class="row mb-4">
      <div class="col-md-12">
        <h2>Calendario de Eventos</h2>
        <div class="card">
          <div class="card-body">
            <FullCalendar 
              :options="calendarOptions"
              ref="fullCalendarRef"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar evento -->
    <div class="modal fade" id="eventModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editMode ? 'Editar Evento' : 'Nuevo Evento' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">Título</label>
                <input type="text" class="form-control" v-model="currentEvent.title" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Fecha Inicio</label>
                <input type="datetime-local" class="form-control" v-model="currentEvent.start" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Fecha Fin</label>
                <input type="datetime-local" class="form-control" v-model="currentEvent.end" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea class="form-control" v-model="currentEvent.description" rows="3"></textarea>
              </div>
              <!-- Agregar después del campo de descripción en el modal -->
              <div class="mb-3">
                <label class="form-label">Color</label>
                <input type="color" class="form-control form-control-color" v-model="currentEvent.color" title="Elige el color del evento">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button v-if="editMode" type="button" class="btn btn-danger me-2" @click="deleteEvent">Eliminar</button>
            <button type="button" class="btn btn-primary" @click="handleSubmit">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Modal } from 'bootstrap'
import axios from 'axios'

export default {
  name: 'EventsView',
  components: {
    FullCalendar
  },
  setup() {
    const fullCalendarRef = ref(null)
    const currentEvent = ref({
      title: '',
      start: '',
      end: '',
      description: '',
      color: '#3788d8' // Color por defecto
    })
    const editMode = ref(false)
    const eventModal = ref(null)
    const events = ref([])

    const calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locale: 'es',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay'
      },
      editable: true,
      selectable: true,
      select: handleDateSelect,
      eventClick: handleEventClick,
      eventContent: renderEventContent,
      events: fetchEvents 
    }
    function renderEventContent(eventInfo) {
      return {
        html: `
          <div class="fc-event-main-content">
            <div class="fc-event-title">${eventInfo.event.title}</div>
            <div class="fc-event-description">${eventInfo.event.extendedProps.description || ''}</div>
          </div>
        `
      }
    }

    // Función async para obtener eventos
    async function fetchEvents(fetchInfo, successCallback, failureCallback) {
      try {
        const response = await axios.get('http://localhost:3000/api/events')
        const formattedEvents = response.data.map(event => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          description: event.description,
          color: event.color || '#3788d8'
        }))
        successCallback(formattedEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
        failureCallback(error)
      }
    }

    async function loadEvents() {
      try {
        const response = await axios.get('http://localhost:3000/api/events')
        events.value = response.data
        if (fullCalendarRef.value) {
          const calendarApi = fullCalendarRef.value.getApi()
          calendarApi.refetchEvents()
        }
      } catch (error) {
        console.error('Error loading events:', error)
      }
    }

    function handleDateSelect(selectInfo) {
      editMode.value = false
      // Convertir la fecha a formato datetime-local
      const startDate = new Date(selectInfo.start)
      const endDate = new Date(selectInfo.start) // Usar la misma fecha de inicio
      
      // Ajustar la hora de inicio a las 00:00
      startDate.setHours(0, 0, 0)
      // Ajustar la hora de fin a las 23:59 del mismo día
      endDate.setHours(23, 59, 0)
      
      // Formatear las fechas para el input datetime-local
      const formatDate = (date) => {
        return date.toISOString().slice(0, 16) // Formato YYYY-MM-DDTHH:mm
      }

      currentEvent.value = {
        title: '',
        start: formatDate(startDate),
        end: formatDate(endDate),
        description: '',
        color: '#3788d8' // Color por defecto
      }
      eventModal.value.show()
    }

    function handleEventClick(clickInfo) {
      editMode.value = true
      currentEvent.value = {
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        start: clickInfo.event.startStr,
        end: clickInfo.event.endStr,
        description: clickInfo.event.extendedProps.description || '',
        color: clickInfo.event.backgroundColor || '#3788d8'
      }
      eventModal.value.show()
    }

    async function handleSubmit() {
      try {
        if (editMode.value) {
          await axios.put(`http://localhost:3000/api/events/${currentEvent.value.id}`, currentEvent.value)
        } else {
          await axios.post('http://localhost:3000/api/events', currentEvent.value)
        }
        await loadEvents() // Esto ahora refrescará el calendario
        eventModal.value.hide()
      } catch (error) {
        console.error('Error guardando evento:', error)
      }
    }

    async function deleteEvent() {
      if (confirm('¿Está seguro de eliminar este evento?')) {
        try {
          await axios.delete(`http://localhost:3000/api/events/${currentEvent.value.id}`)
          await loadEvents()
          eventModal.value.hide()
        } catch (error) {
          console.error('Error eliminando evento:', error)
        }
      }
    }

    onMounted(() => {
      eventModal.value = new Modal(document.getElementById('eventModal'))
      loadEvents()
    })

    return {
      calendarOptions,
      currentEvent,
      editMode,
      handleSubmit,
      deleteEvent,
      fullCalendarRef
    }
  }
}
</script>

<style scoped>
.events-view {
  padding: 20px;
}

:deep(.fc) {
  max-width: 100%;
  background: white;
  padding: 20px;
  border-radius: 8px;
}

:deep(.fc-toolbar-title) {
  font-size: 1.5em !important;
}

:deep(.fc-event) {
  cursor: pointer;
}
</style>