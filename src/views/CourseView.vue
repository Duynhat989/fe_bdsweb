<script setup>
import PaymentPopup from '@/components/PaymentPopup.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { notify } from '@kyvg/vue3-notification';
import { encodeId } from '@/utils/encoding';
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import { formatCurrency } from '@/utils/helps';
const router = useRouter();
const activeTab = ref('all');
const showPaymentPopup = ref(false);
const selectedCourse = ref({});
const searchQuery = ref('');
const courses = ref([]);
const myCourses = ref([]);

// Khóa học của Tôi
const fetchMyCourses = async () => {
  try {
    const response = await request.get(END_POINT.COURSE_ME);
    myCourses.value = response.data;
  } catch (error) {
    console.error('Lỗi lấy danh sách trợ lý:', error);
  }
};

const fetchCourses = async () => {
  try {
    const response = await request.get(END_POINT.COURSES_LIST);
    courses.value = response.courses;
  } catch (error) {
    console.error('Lỗi lấy danh sách trợ lý:', error);
  }
};


const filteredCourses = computed(() =>
  courses.value.filter(course =>
    course.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    course.detail.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const filteredMyCourses = computed(() =>
  myCourses.value.filter(courseItem =>
    courseItem.course.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    courseItem.course.detail.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const handleCourseClick = (value) => {
  const encodedId = encodeId(value.course.id);
  router.push(`/course/${encodedId}`);
};
const handlePayment = (course) => {
  selectedCourse.value = course;
  showPaymentPopup.value = true;
};
// const handlePaymentSuccess = () => {
//   notify({
//     title: 'Thành công',
//     text: 'Khóa học đã được thanh toán thành công!',
//     type: 'success',
//   });
// };

onMounted(() => {
  fetchMyCourses();
  fetchCourses();
});
</script>
<template>
  <div class="courses-page">
    <div class="header-title">
      <h1 class="title">Khóa học bất động sản</h1>
    </div>
    <div class="tabs">
      <button @click="activeTab = 'all'" :class="{ active: activeTab === 'all' }">Tất cả khóa học</button>
      <button @click="activeTab = 'my-courses'" :class="{ active: activeTab === 'my-courses' }">Khóa học của
        tôi</button>
    </div>
    <div class="search-bar">
      <input type="text" placeholder="Tìm kiếm khóa học..." v-model="searchQuery" @input="filterCourses" />
    </div>
    <div v-if="activeTab === 'all'">
      <h2 class="section-title">Danh sách khóa học</h2>
      <div class="course-list">
        <div class="course-card" v-for="course in filteredCourses" :key="course.id">
          <img :src="course.image" alt="Course Image" class="course-image" />
          <div class="course-content">
            <h3 class="course-title">{{ course.name }}</h3>
            <p class="course-detail">{{ course.detail }}</p>
            <div class="course-pricing">
              <span class="price">{{ formatCurrency(course.price) }}</span>
            </div>
            <div class="course-status">
              <span :class="{ active: course.status === 1, inactive: course.status !== 1 }">
                {{ course.status === 1 ? 'Hoạt động' : 'Ngừng hoạt động' }}
              </span>
            </div>
            <div class="course-dates">
              <span>Ngày tạo: {{ new Date(course.createdAt).toLocaleDateString() }}</span>
            </div>
          </div>
          <div class="register-overlay">
            <button class="register-button" @click.stop="handlePayment(course)">Đăng ký ngay</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <h2 class="section-title">Khóa học của tôi</h2>
      <div v-if="filteredMyCourses.length > 0" class="course-list">
        <div class="course-card" v-for="value in filteredMyCourses" :key="value.course.id" @click="handleCourseClick(value)">
          <img :src="value.course.image" alt="Course Image" class="course-image" />
          <div class="course-content">
            <h3 class="course-title">{{ value.course.name }}</h3>
            <p class="course-detail">{{ value.course.detail }}</p>
            <div class="course-pricing">
              <span class="price">{{ formatCurrency(value.course.price) }}</span>
            </div>
            <div class="course-status">
              <span :class="{ active: value.course.status === 1, inactive: value.course.status !== 1 }">
                {{ value.course.status === 1 ? 'Hoạt động' : 'Ngừng hoạt động' }}
              </span>
            </div>
            <div class="course-dates">
              <span>Ngày tạo: {{ new Date(value.course.createdAt).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>
      </div>
      <p v-else>Hiện tại bạn chưa có khóa học nào.</p>
    </div>
    <PaymentPopup v-if="showPaymentPopup" :course="selectedCourse" :visible="showPaymentPopup"
      @close="showPaymentPopup = false" />
  </div>
</template>

<style scoped>
.courses-page {
  margin: 40px auto;
  max-width: 1200px;
  padding: 40px 5%;
}

.header-title {
  text-align: center;
  margin-bottom: 40px;
}

.header-title .title {
  font-size: 30px;
  font-weight: bold;
  color: #e03d31;
  line-height: 40px;
}

.tabs {
  display: flex;
  margin: 0 auto;
  width: fit-content;
  border-radius: 5px;
  overflow: hidden;
}

.tabs button {
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  background-color: #f4f4f4;
  color: #333;
  border: none;
  text-align: center;
  width: fit-content;
  font-family: inherit;
}

.tabs button.active {
  background: rgb(229, 57, 53);
  background: linear-gradient(90deg, rgba(229, 57, 53, 1) 0%, rgba(229, 57, 53, 1) 35%, rgba(44, 44, 44, 1) 100%);
  color: white;
}

.search-bar {
  width: 50%;
  margin: 20px auto;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-family: inherit;
}

.section-title {
  font-size: 24px;
  margin-top: 20px;
  margin-bottom: 5px;
}

.course-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.course-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: calc(33.333% - 20px);
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
}

.course-card:hover {
  transform: scale(1.05);
}

.course-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.course-content {
  padding: 10px;
}

.course-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.course-detail {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.course-pricing {
  font-size: 16px;
  font-weight: bold;
  color: #ff0000;
  margin-bottom: 5px;
}

.course-status {
  font-size: 14px;
  margin-bottom: 5px;
}

.course-status .active {
  color: #28a745;
}

.course-status .inactive {
  color: #dc3545;
}

.course-dates {
  font-size: 14px;
  color: #777;
  margin-bottom: 5px;
}

.course-card .register-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(238, 227, 227, 0.856);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.course-card:hover .register-overlay {
  opacity: 1;
}

.register-button {
  background-color: #f04a4a;
  color: #fff;
  border: none;
  padding: 6px 10px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  font-family: inherit;
  transition: background-color 0.3s ease;
}

.register-button:hover {
  background-color: #d43d3d;
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .courses-page {
    max-width: 1000px;
    padding: 0 20px;
  }
}

@media (max-width: 1024px) {
  .courses-page {
    max-width: 800px;
  }
}

@media (max-width: 768px) {
  .courses-page {
    max-width: 700px;
  }

  .course-card {
    width: calc(50% - 20px);
  }
}

@media (max-width: 576px) {
  .courses-page {
    width: 100%;
  }

  .courses-page {
    margin-top: 60px;
  }

  .course-card {
    width: 100%;
  }

  .search-bar {
    width: 100%;
  }
}

@media (max-width: 420px) {

  .tabs button {
    padding: 10px 10px;
    color: 15px;
  }

  .course-card {
    width: 100%;
  }
}
</style>
