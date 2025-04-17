<template>
    <div class="surveys">
      <h1>Encuestas Interactivas</h1>
      
      <div class="row">
        <div class="col-md-6">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Crear Nueva Encuesta</h5>
              
              <div class="mb-3">
                <label for="surveyQuestion" class="form-label">Pregunta</label>
                <input type="text" class="form-control" id="surveyQuestion" v-model="newSurvey.question">
              </div>
              
              <div class="mb-3">
                <label class="form-label">Opciones</label>
                <div v-for="(option, index) in newSurvey.options" :key="index" class="input-group mb-2">
                  <input type="text" class="form-control" v-model="newSurvey.options[index]">
                  <button class="btn btn-outline-danger" type="button" @click="removeOption(index)">X</button>
                </div>
                <button class="btn btn-outline-secondary" @click="addOption">Agregar Opción</button>
              </div>
              
              <button @click="createSurvey" class="btn btn-primary" :disabled="!canCreateSurvey">
                Crear Encuesta
              </button>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Encuestas Disponibles</h5>
              
              <div v-if="loadingSurveys" class="text-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </div>
              
              <div v-else-if="surveys.length === 0" class="alert alert-info">
                No hay encuestas disponibles. ¡Crea una!
              </div>
              
              <div v-else class="list-group">
                <div v-for="survey in surveys" :key="survey.id" class="list-group-item">
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="survey-question">{{ survey.question }}</span>
                    <div class="btn-group">
                      <button class="btn btn-primary btn-sm me-2" @click="selectSurvey(survey)">
                        Responder
                      </button>
                      <button class="btn btn-info btn-sm" @click="showResults(survey.id)">
                        Ver Resultados
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modal para responder encuesta -->
      <div class="modal fade" id="surveyModal" tabindex="-1" aria-labelledby="surveyModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="surveyModalLabel">Responder Encuesta</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <h5>{{ selectedSurvey.question }}</h5>
              
              <div class="list-group mt-3">
                <button v-for="option in selectedSurvey.options" :key="option" 
                       type="button" class="list-group-item list-group-item-action"
                       @click="selectedAnswer = option"
                       :class="{ active: selectedAnswer === option }">
                  {{ option }}
                </button>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="submitResponse" :disabled="!selectedAnswer">
                Enviar Respuesta
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modal para resultados de encuesta -->
      <div class="modal fade" id="resultsModal" tabindex="-1" aria-labelledby="resultsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="resultsModalLabel">Resultados de la Encuesta</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <h5>{{ surveyResults.question }}</h5>
              
              <div v-if="loadingResults" class="text-center mt-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </div>
              
              <div v-else>
                <canvas ref="resultsChart" width="400" height="200"></canvas>
                
                <table class="table table-striped mt-4">
                  <thead>
                    <tr>
                      <th>Opción</th>
                      <th>Votos</th>
                      <th>Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="option in surveyResults.options" :key="option">
                      <td>{{ option }}</td>
                      <td>{{ surveyResults.results[option] || 0 }}</td>
                      <td>{{ calculatePercentage(option) }}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { Modal } from 'bootstrap';
  import { Chart, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
  
  // Registrar los componentes necesarios de Chart.js
  Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
  export default {
    name: 'SurveysView',
    data() {
      return {
        newSurvey: {
          question: '',
          options: ['', '']
        },
        surveys: [],
        loadingSurveys: true,
        selectedSurvey: {
          id: null,
          question: '',
          options: []
        },
        selectedAnswer: '',
        surveyModal: null,
        resultsModal: null,
        surveyResults: {
          question: '',
          options: [],
          results: {}
        },
        loadingResults: false,
        chart: null
      }
    },
    computed: {
      canCreateSurvey() {
        return this.newSurvey.question && 
               this.newSurvey.options.length >= 2 && 
               this.newSurvey.options.every(option => option.trim() !== '');
      }
    },
    methods: {
      addOption() {
        this.newSurvey.options.push('');
      },
      removeOption(index) {
        if (this.newSurvey.options.length > 2) {
          this.newSurvey.options.splice(index, 1);
        }
      },
      async createSurvey() {
        try {
          const response = await axios.post('http://localhost:3000/api/surveys', this.newSurvey);
          this.surveys.push(response.data);
          this.newSurvey = {
            question: '',
            options: ['', '']
          };
        } catch (error) {
          console.error('Error creating survey:', error);
          alert('Error al crear la encuesta');
        }
      },
      async loadSurveys() {
        try {
          const response = await axios.get('http://localhost:3000/api/surveys');
          this.surveys = response.data;
          this.loadingSurveys = false;
        } catch (error) {
          console.error('Error loading surveys:', error);
          this.loadingSurveys = false;
        }
      },
      selectSurvey(survey) {
        this.selectedSurvey = { ...survey };
        this.selectedAnswer = '';
        this.surveyModal.show();
      },
      async submitResponse() {
        try {
          await axios.post('http://localhost:3000/api/surveys/respond', {
            surveyId: this.selectedSurvey.id,
            answer: this.selectedAnswer
          });
          this.surveyModal.hide();
          this.showResults(this.selectedSurvey.id);
        } catch (error) {
          console.error('Error submitting response:', error);
          alert('Error al enviar la respuesta');
        }
      },
      async showResults(surveyId) {
        this.loadingResults = true;
        try {
          const response = await axios.get(`http://localhost:3000/api/surveys/${surveyId}/results`);
          this.surveyResults = response.data;
          this.resultsModal.show();
          this.$nextTick(() => {
            this.createChart();
          });
        } catch (error) {
          console.error('Error loading results:', error);
        } finally {
          this.loadingResults = false;
        }
      },
      calculatePercentage(option) {
        const votes = this.surveyResults.results[option] || 0;
        const total = Object.values(this.surveyResults.results).reduce((a, b) => a + b, 0);
        return total === 0 ? 0 : Math.round((votes / total) * 100);
      },
      createChart() {
        if (this.chart) {
          this.chart.destroy();
        }

        const ctx = this.$refs.resultsChart.getContext('2d');
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.surveyResults.options,
            datasets: [{
              label: 'Votos',
              data: this.surveyResults.options.map(option => this.surveyResults.results[option] || 0),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });
      }
    },
    mounted() {
      this.loadSurveys();
      this.surveyModal = new Modal(document.getElementById('surveyModal'));
      this.resultsModal = new Modal(document.getElementById('resultsModal'));
    },
    beforeUnmount() {
      if (this.chart) {
        this.chart.destroy();
      }
    }
  }
  </script>

  <style scoped>
  .surveys {
    padding: 20px;
  }
  
  .card {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .list-group-item:hover {
    background-color: #f8f9fa;
    cursor: pointer;
  }
  </style>