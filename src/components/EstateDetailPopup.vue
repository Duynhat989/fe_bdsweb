<script setup>
import {ref } from "vue";
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = ref({
  labels: ["T1", "T2", "T3", "T4", "T5", "T6"], 
  datasets: [
    {
      label: "Giá cao nhất",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
      data: [240, 230, 220, 210, 250, 260], 
    },
    {
      label: "Giá thấp nhất",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
      data: [180, 170, 160, 150, 155, 165],
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Biểu đồ giá bất động sản (Fake Data)",
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Thời gian",
      },
    },
    y: {
      title: {
        display: true,
        text: "Giá trị (triệu/m²)",
      },
      beginAtZero: false,
    },
  },
});
const props = defineProps({
    estate: {
        type: Object,
        default: () => ({}),
    },
    visible: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close']);

const closePopup = () => {
    emit('close');
};


</script>

<template>
    <div v-if="visible" class="modal-overlay">
        <div class="estate-popup">
            <div class="popup-content">
                <button class="close-btn" @click="closePopup"><i class="bx bxs-x-circle"></i></button>
                <img :src="estate.image" alt="Estate Image" class="popup-image" />
                <h3>{{ estate.title }}</h3>
                <p><strong>Vị trí:</strong> {{ estate.location }}</p>
                <p><strong>Mô tả:</strong> {{ estate.description }}</p>
                <p><strong>Giá:</strong> <span style="color: red;">{{ estate.price }}</span></p>
                <p><strong>Diện tích:</strong> <span style="color: red;">{{ estate.area }}</span></p>
                <p><strong>Tiện ích:</strong> {{ estate.exten }}</p>
                <a :href="estate.base_url" target="_blank" class="popup-link">
                    Xem trên trang gốc
                </a>
                <div>
                    <Bar :data="chartData" :options="chartOptions" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    overflow: hidden;
}

.estate-popup {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    max-width: 1000px;
    width: 90%;
    max-height: 80vh;
    padding: 20px;
    text-align: center;
    position: relative;
    animation: popupFadeIn 0.3s ease-in-out;
    overflow-y: auto;
    animation: popupFadeIn 0.3s ease-in-out;
}

.popup-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.popup-image {
  width: 60%;
  height: auto;
  border-radius: 8px;
  margin: 0 auto;
  margin-bottom: 15px;
}

.popup-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.popup-link:hover {
  text-decoration: underline;
}
.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    color: #333;
}

h3 {
    font-size: 20px;
    font-weight: bold;
    line-height: 24px;
    color: var(--color-primary);
}
</style>
