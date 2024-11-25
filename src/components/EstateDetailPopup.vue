<script setup>
import { ref, watch } from "vue";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { Line } from "vue-chartjs";
import { getLatestPrice } from "@/utils/helps";
// Đăng ký các thành phần Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

// Dữ liệu từ API
const priceData= ref ('');
// Hàm xử lý dữ liệu
const processPriceData = (data) => {
  const items = data.split(" | "); 
  const labels = []; 
  const values = []; 

  items.forEach((item) => {
    const [price, date] = item.split(":"); 
    let numericPrice = 0;

    if (price.includes("tỷ")) {
      numericPrice = parseFloat(price.replace(" tỷ", "").replace(",", "."));
    } else if (price.includes("triệu")) {
      numericPrice = parseFloat(price.replace(" triệu", "").replace(",", ".")) / 1000; 
    }

    labels.push(date);
    values.push(numericPrice);
  });

  return { labels, values };
};

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "Giá bất động sản",
      data: [],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderWidth: 2,
      tension: 0.4,
      fill: true,
    },
  ],
});

// Cấu hình biểu đồ
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: "top", 
    },
    title: {
      display: true,
      text: "Biểu đồ giá bất động sản",
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
        text: "Giá trị (tỷ đồng)",
      },
      beginAtZero: false,
    },
  },
});

// Props và Emit cho modal
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

const emit = defineEmits(["close"]);

const closePopup = () => {
  emit("close");
};
watch(
  () => props.estate,
  (newEstate) => {
    if (newEstate) {
      priceData.value = newEstate.price; 
      const { labels, values } = processPriceData(priceData.value); 
      chartData.value.labels = labels; 
      chartData.value.datasets[0].data = values; 
    }
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="estate-popup">
      <div class="popup-content">
        <button class="close-btn" @click="closePopup"><i class="bx bxs-x-circle"></i></button>
        <h3>{{ estate.title }}</h3>
        <img :src="estate.image" alt="Estate Image" class="popup-image" />
        <p><strong>Vị trí:</strong> {{ estate.location }}</p>
        <p><strong>Mô tả:</strong> {{ estate.description }}</p>
        <p><strong>Giá:</strong> <span style="color: red;">{{ getLatestPrice(estate.price) }}</span></p>
        <p><strong>Diện tích:</strong> <span style="color: red;">{{ estate.area }}</span></p>
        <p><strong>Tiện ích:</strong> {{ estate.exten }}</p>
        <a :href="estate.base_url" target="_blank" class="popup-link">
          Xem trên trang gốc
        </a>
        <div v-if="getLatestPrice(estate.price) !== 'Thỏa thuận'">
          <Line :data="chartData" :options="chartOptions" />
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
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
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
  text-align: center;
  margin:15px 0px;
}
</style>
