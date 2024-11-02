<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const item = ref({
  id: 1,
  name: 'Biệt thự sang trọng',
  image: 'https://hocvienamg.edu.vn/wp-content/uploads/2023/07/nguoi-dan-duong-bds.jpg',
  location: 'Quận 1, TP.HCM',
  description: 'Biệt thự với thiết kế hiện đại, đầy đủ tiện nghi, gần trung tâm thành phố. Bao gồm hồ bơi, sân vườn, và nội thất cao cấp, tạo nên không gian sống đẳng cấp.',
  price: '50 tỷ VND',
  area: '500 m²',
  bedrooms: 5,
  bathrooms: 4,
  amenities: ['Hồ bơi', 'Sân vườn', 'Nhà để xe', 'Phòng tập gym'],
});

</script>

<template>
  <div class="detail-page">
    <div class="detail-content">
      <img :src="item.image" alt="Property Image" class="detail-image" />
      <h2>{{ item.name }}</h2>
      <p><strong>Vị trí:</strong> {{ item.location }}</p>
      <p><strong>Diện tích:</strong> {{ item.area }}</p>
      <p><strong>Giá:</strong> {{ item.price }}</p>
      <p><strong>Số phòng ngủ:</strong> {{ item.bedrooms }}</p>
      <p><strong>Số phòng tắm:</strong> {{ item.bathrooms }}</p>
      <p><strong>Tiện ích:</strong> <span v-for="(amenity, index) in item.amenities" :key="index">{{ amenity }}<span v-if="index < item.amenities.length - 1">, </span></span></p>
      <p><strong>Mô tả:</strong> {{ item.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 1200px;
  padding: 40px 5%;
  margin: 0 auto;
  text-align: center;
}

.detail-content {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.detail-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

p {
  font-size: 16px;
  color: #555;
  margin-bottom: 8px;
}

p strong {
  color: var(--color-primary);
}
</style>
