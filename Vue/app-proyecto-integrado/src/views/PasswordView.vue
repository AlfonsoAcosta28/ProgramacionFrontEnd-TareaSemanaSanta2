<template>
    <div class="password-generator">
      <h1>Generador de Contraseñas</h1>
      
      <div class="row">
        <div class="col-md-6">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Opciones de Generación</h5>
              
              <div class="mb-3">
                <label for="passwordLength" class="form-label">Longitud</label>
                <div class="d-flex align-items-center">
                  <input type="range" class="form-range" min="4" max="32" step="1" id="passwordLength" v-model="options.length">
                  <span class="ms-2">{{ options.length }}</span>
                </div>
              </div>
              
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="useUppercase" v-model="options.hasUppercase">
                  <label class="form-check-label" for="useUppercase">
                    Incluir mayúsculas (A-Z)
                  </label>
                </div>
              </div>
              
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="useLowercase" v-model="options.hasLowercase">
                  <label class="form-check-label" for="useLowercase">
                    Incluir minúsculas (a-z)
                  </label>
                </div>
              </div>
              
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="useNumbers" v-model="options.hasNumbers">
                  <label class="form-check-label" for="useNumbers">
                    Incluir números (0-9)
                  </label>
                </div>
              </div>
              
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="useSymbols" v-model="options.hasSymbols">
                  <label class="form-check-label" for="useSymbols">
                    Incluir símbolos (!@#$%^&*...)
                  </label>
                </div>
              </div>
              
              <button @click="generatePassword" class="btn btn-primary">Generar Contraseña</button>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Contraseña Generada</h5>
              
              <div v-if="generatedPassword" class="mb-3">
                <div class="input-group">
                  <input type="text" class="form-control" readonly v-model="generatedPassword">
                  <button class="btn btn-outline-secondary" type="button" @click="copyToClipboard">
                    Copiar
                  </button>
                </div>
                <div class="mt-3 d-flex">
                  <div class="progress flex-grow-1">
                    <div class="progress-bar" :class="passwordStrengthClass" role="progressbar" 
                         :style="{width: passwordStrengthPercent + '%'}" 
                         :aria-valuenow="passwordStrengthPercent" aria-valuemin="0" aria-valuemax="100">
                    </div>
                  </div>
                  <span class="ms-2">{{ passwordStrengthText }}</span>
                </div>
              </div>
              
              <div v-else class="alert alert-info">
                Haz clic en "Generar Contraseña" para crear una nueva contraseña.
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Historial de Contraseñas</h5>
              
              <div v-if="loading" class="text-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </div>
              
              <div v-else-if="passwordHistory.length === 0" class="alert alert-info">
                No hay historial de contraseñas generadas.
              </div>
              
              <ul v-else class="list-group">
                <li v-for="(password, index) in passwordHistory" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <code>{{ revealedPasswordIndex === index ? password.value : maskPassword(password.value) }}</code>
                    <small class="d-block text-muted">
                      {{ new Date(password.createdAt).toLocaleString() }}
                    </small>
                  </div>
                  <button @click="revealPassword(index)" class="btn btn-sm btn-outline-secondary">
                    {{ revealedPasswordIndex === index ? 'Ocultar' : 'Mostrar' }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'PasswordView',
    data() {
      return {
        options: {
          length: 12,
          hasUppercase: true,
          hasLowercase: true,
          hasNumbers: true,
          hasSymbols: true
        },
        generatedPassword: '',
        passwordHistory: [],
        loading: true,
        revealedPasswordIndex: null
      };
    },
    computed: {
      passwordStrengthPercent() {
        if (!this.generatedPassword) return 0;
        
        let score = 0;
        
        // Longitud
        if (this.options.length >= 8) score += 20;
        if (this.options.length >= 12) score += 10;
        if (this.options.length >= 16) score += 10;
        
        // Caracteres utilizados
        if (this.options.hasUppercase) score += 15;
        if (this.options.hasLowercase) score += 15;
        if (this.options.hasNumbers) score += 15;
        if (this.options.hasSymbols) score += 15;
        
        return Math.min(score, 100);
      },
      passwordStrengthText() {
        const score = this.passwordStrengthPercent;
        if (score >= 80) return 'Muy Fuerte';
        if (score >= 60) return 'Fuerte';
        if (score >= 40) return 'Media';
        if (score >= 20) return 'Débil';
        return 'Muy Débil';
      },
      passwordStrengthClass() {
        const score = this.passwordStrengthPercent;
        if (score >= 80) return 'bg-success';
        if (score >= 60) return 'bg-info';
        if (score >= 40) return 'bg-warning';
        return 'bg-danger';
      }
    },
    mounted() {
      this.fetchPasswordHistory();
    },
    methods: {
      async generatePassword() {
        if (!this.options.hasUppercase && !this.options.hasLowercase && 
            !this.options.hasNumbers && !this.options.hasSymbols) {
          alert('Debes seleccionar al menos un tipo de carácter');
          return;
        }
        
        try {
          const response = await axios.post('http://localhost:3000/api/passwords/generate', this.options);
          this.generatedPassword = response.data.password;
          this.fetchPasswordHistory();
        } catch (error) {
          console.error('Error al generar contraseña:', error);
          alert('No se pudo generar la contraseña. Intenta de nuevo.');
        }
      },
      async fetchPasswordHistory() {
        try {
          this.loading = true;
          const response = await axios.get('http://localhost:3000/api/passwords/history');
          this.passwordHistory = response.data;
        } catch (error) {
          console.error('Error al cargar historial de contraseñas:', error);
        } finally {
          this.loading = false;
        }
      },
      copyToClipboard() {
        navigator.clipboard.writeText(this.generatedPassword)
          .then(() => {
            alert('Contraseña copiada al portapapeles');
          })
          .catch(err => {
            console.error('Error al copiar al portapapeles:', err);
            alert('No se pudo copiar la contraseña. Inténtalo manualmente.');
          });
      },
      maskPassword(password) {
        return password.replace(/./g, '•');
      },
      revealPassword(index) {
        if (this.revealedPasswordIndex === index) {
          this.revealedPasswordIndex = null;
        } else {
          this.revealedPasswordIndex = index;
        }
      }
    }
  };
  </script>