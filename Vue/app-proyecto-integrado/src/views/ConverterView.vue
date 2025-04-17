<template>
    <div class="converter">
      <h1>Conversor de Unidades</h1>
      
      <div class="card mb-4">
        <div class="card-body">
          <ul class="nav nav-tabs" id="converterTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="temperature-tab" data-bs-toggle="tab" data-bs-target="#temperature" type="button" role="tab">
                Temperatura
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="length-tab" data-bs-toggle="tab" data-bs-target="#length" type="button" role="tab">
                Longitud
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="weight-tab" data-bs-toggle="tab" data-bs-target="#weight" type="button" role="tab">
                Peso
              </button>
            </li>
          </ul>
          
          <div class="tab-content p-3" id="converterTabContent">
            <!-- Conversor de Temperatura -->
            <div class="tab-pane fade show active" id="temperature" role="tabpanel">
              <div class="row g-3">
                <div class="col-md-4">
                  <label for="tempValue" class="form-label">Valor</label>
                  <input type="number" class="form-control" id="tempValue" v-model="temperature.value">
                </div>
                <div class="col-md-4">
                  <label for="tempFrom" class="form-label">De</label>
                  <select class="form-select" id="tempFrom" v-model="temperature.from">
                    <option value="celsius">Celsius (°C)</option>
                    <option value="fahrenheit">Fahrenheit (°F)</option>
                    <option value="kelvin">Kelvin (K)</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="tempTo" class="form-label">A</label>
                  <select class="form-select" id="tempTo" v-model="temperature.to">
                    <option value="celsius">Celsius (°C)</option>
                    <option value="fahrenheit">Fahrenheit (°F)</option>
                    <option value="kelvin">Kelvin (K)</option>
                  </select>
                </div>
                <div class="col-12">
                  <button type="button" class="btn btn-primary" @click="convertTemperature">Convertir</button>
                </div>
                <div class="col-12" v-if="temperature.result !== null">
                  <div class="alert alert-success">
                    Resultado: {{ temperature.value }} {{ getUnitSymbol(temperature.from, 'temperature') }} = 
                    <strong>{{ temperature.result }} {{ getUnitSymbol(temperature.to, 'temperature') }}</strong>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Conversor de Longitud -->
            <div class="tab-pane fade" id="length" role="tabpanel">
              <div class="row g-3">
                <div class="col-md-4">
                  <label for="lengthValue" class="form-label">Valor</label>
                  <input type="number" class="form-control" id="lengthValue" v-model="length.value">
                </div>
                <div class="col-md-4">
                  <label for="lengthFrom" class="form-label">De</label>
                  <select class="form-select" id="lengthFrom" v-model="length.from">
                    <option value="metros">Metros (m)</option>
                    <option value="kilometros">Kilómetros (km)</option>
                    <option value="centimetros">Centímetros (cm)</option>
                    <option value="milimetros">Milímetros (mm)</option>
                    <option value="pulgadas">Pulgadas (in)</option>
                    <option value="pies">Pies (ft)</option>
                    <option value="millas">Millas (mi)</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="lengthTo" class="form-label">A</label>
                  <select class="form-select" id="lengthTo" v-model="length.to">
                    <option value="metros">Metros (m)</option>
                    <option value="kilometros">Kilómetros (km)</option>
                    <option value="centimetros">Centímetros (cm)</option>
                    <option value="milimetros">Milímetros (mm)</option>
                    <option value="pulgadas">Pulgadas (in)</option>
                    <option value="pies">Pies (ft)</option>
                    <option value="millas">Millas (mi)</option>
                  </select>
                </div>
                <div class="col-12">
                  <button type="button" class="btn btn-primary" @click="convertLength">Convertir</button>
                </div>
                <div class="col-12" v-if="length.result !== null">
                  <div class="alert alert-success">
                    Resultado: {{ length.value }} {{ getUnitSymbol(length.from, 'length') }} = 
                    <strong>{{ length.result }} {{ getUnitSymbol(length.to, 'length') }}</strong>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Conversor de Peso -->
            <div class="tab-pane fade" id="weight" role="tabpanel">
              <div class="row g-3">
                <div class="col-md-4">
                  <label for="weightValue" class="form-label">Valor</label>
                  <input type="number" class="form-control" id="weightValue" v-model="weight.value">
                </div>
                <div class="col-md-4">
                  <label for="weightFrom" class="form-label">De</label>
                  <select class="form-select" id="weightFrom" v-model="weight.from">
                    <option value="gramos">Gramos (g)</option>
                    <option value="kilogramos">Kilogramos (kg)</option>
                    <option value="miligramos">Miligramos (mg)</option>
                    <option value="libras">Libras (lb)</option>
                    <option value="onzas">Onzas (oz)</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="weightTo" class="form-label">A</label>
                  <select class="form-select" id="weightTo" v-model="weight.to">
                    <option value="gramos">Gramos (g)</option>
                    <option value="kilogramos">Kilogramos (kg)</option>
                    <option value="miligramos">Miligramos (mg)</option>
                    <option value="libras">Libras (lb)</option>
                    <option value="onzas">Onzas (oz)</option>
                  </select>
                </div>
                <div class="col-12">
                  <button type="button" class="btn btn-primary" @click="convertWeight">Convertir</button>
                </div>
                <div class="col-12" v-if="weight.result !== null">
                  <div class="alert alert-success">
                    Resultado: {{ weight.value }} {{ getUnitSymbol(weight.from, 'weight') }} = 
                    <strong>{{ weight.result }} {{ getUnitSymbol(weight.to, 'weight') }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ConverterView',
    data() {
      return {
        temperature: {
          value: 0,
          from: 'celsius',
          to: 'fahrenheit',
          result: null
        },
        length: {
          value: 0,
          from: 'metros',
          to: 'kilometros',
          result: null
        },
        weight: {
          value: 0,
          from: 'gramos',
          to: 'kilogramos',
          result: null
        }
      };
    },
    methods: {
      async convertTemperature() {
        try {
          const response = await axios.post('http://localhost:3000/api/converter/temperature', {
            value: this.temperature.value,
            from: this.temperature.from,
            to: this.temperature.to
          });
          this.temperature.result = response.data.result;
        } catch (error) {
          console.error('Error al convertir temperatura:', error);
          alert('Error al realizar la conversión');
        }
      },
      async convertLength() {
        try {
          const response = await axios.post('http://localhost:3000/api/converter/length', {
            value: this.length.value,
            from: this.length.from,
            to: this.length.to
          });
          this.length.result = response.data.result;
        } catch (error) {
          console.error('Error al convertir longitud:', error);
          alert('Error al realizar la conversión');
        }
      },
      async convertWeight() {
        try {
          const response = await axios.post('http://localhost:3000/api/converter/weight', {
            value: this.weight.value,
            from: this.weight.from,
            to: this.weight.to
          });
          this.weight.result = response.data.result;
        } catch (error) {
          console.error('Error al convertir peso:', error);
          alert('Error al realizar la conversión');
        }
      },
      getUnitSymbol(unit, type) {
        const symbols = {
          temperature: {
            celsius: '°C',
            fahrenheit: '°F',
            kelvin: 'K'
          },
          length: {
            metros: 'm',
            kilometros: 'km',
            centimetros: 'cm',
            milimetros: 'mm',
            pulgadas: 'in',
            pies: 'ft',
            millas: 'mi'
          },
          weight: {
            gramos: 'g',
            kilogramos: 'kg',
            miligramos: 'mg',
            libras: 'lb',
            onzas: 'oz'
          }
        };
        
        return symbols[type][unit] || unit;
      }
    }
  };
  </script>