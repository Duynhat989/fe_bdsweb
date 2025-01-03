<script setup>
import DetailPopup from '@/components/DetailPopup.vue';
import { ref, computed, onMounted, watch  } from 'vue';
import { useRouter } from 'vue-router';
import { format, isBefore } from 'date-fns';
import { encodeId } from '@/utils/encoding';
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import Pagination from '@/components/Pagination.vue';
const router = useRouter();
const activeTab = ref('all');
const showPopup = ref(false);
const selectedCourse = ref({});
const searchQuery = ref('');
const searchMyQuery = ref('');
const courses = ref([]);
const license = ref({});

const myCourses = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const total = ref(0);

const isLoading = ref(false)
// Khóa học của Tôi
const fetchMyCourses = async () => {
  try {
    const response = await request.get(END_POINT.COURSE_ME);
    myCourses.value = response.data;
  } catch (error) {
    console.error('Lỗi lấy danh sách trợ lý:', error);
  }
};
const checkAvailableCoursesInLicense = async () => {
  try {
    await fetchLicense();
    const licenseDate = license.value.date;
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const isExpired = isBefore(currentDate, licenseDate);
    const licensedCourseIds = JSON.parse(license.value.pack.features).map(feature => feature.id);

    courses.value = courses.value.map(course => ({
      ...course,
      statusUse: licensedCourseIds.includes(course.id)
        ? isExpired ? "Khả dụng" : "Hết hạn gói" : 'Gói chưa cập nhật'
    }));
  } catch (error) {
    console.error('Error checking available courses in license:', error);
  }
};

const fetchCourses = async (page = currentPage.value, limit = itemsPerPage.value, search = searchQuery.value) => {
  try {
    const response = await request.get(END_POINT.COURSES_LIST, {
      params: {
        search,
        page,
        limit
      }
    });
    courses.value = response.courses;
    total.value = response?.total ?? 1;
    currentPage.value = response?.page ?? 1;
    itemsPerPage.value = response?.limit ?? 10;
    checkAvailableCoursesInLicense();
  } catch (error) {
    console.error('Lỗi lấy danh sách trợ lý:', error);
  }
};
let timeout;
watch(
  searchQuery,
  (newQuery) => {
    isLoading.value = false
    try { clearTimeout(timeout) } catch (error) { }
    timeout = setTimeout(() => {
      if (newQuery) {
        fetchCourses(currentPage.value, itemsPerPage.value, newQuery);
      }
      isLoading.value = true
    }, 1000)
  }
);
const changePage = (page) => {
  currentPage.value = page;
  if (searchQuery.value) {
      fetchCourses(currentPage.value, itemsPerPage.value, searchQuery.value);
    } else {
        fetchCourses(currentPage.value, itemsPerPage.value);
  }
};
const fetchLicense = async () => {
  try {
    const response = await request.get(END_POINT.LICENSE_GET);
    license.value = response.license;
  } catch (error) {
    console.error('Lỗi lấy thông tin gói:', error);
  }
};

const handleCourseClick = (value) => {
  const encodedId = encodeId(value.course.id);
  router.push(`/course/${encodedId}`);
};
const handlePayment = (course) => {
  selectedCourse.value = course;
  showPopup.value = true;
};

const loadCourses = async () => {
    await fetchCourses();
    await fetchMyCourses();
    isLoading.value = true
};

onMounted(() => {
  loadCourses();
});
</script>
<template>
  <div class="courses-page main-container">
    <div class="header-title">
      <h1 class="title">Khóa học bất động sản</h1>
    </div>
    <div class="tabs">
      <button @click="activeTab = 'all'" :class="{ active: activeTab === 'all' }">Tất cả khóa học</button>
      <button @click="activeTab = 'my-courses'" :class="{ active: activeTab === 'my-courses' }">Khóa học của
        tôi</button>
    </div>
    <div >
      <div v-if="activeTab === 'all'">
        <div class="search-bar">
            <div class="search-row">
                <i class='bx bx-search-alt-2 search-icon'></i>
                <input type="text" v-model="searchQuery" placeholder="Nhập từ tìm kiếm trợ lý..." class="search-input" />
            </div>
        </div>
        <h4 class="section-title">Danh sách khóa học</h4>
        <LoadingSpinner v-if="!isLoading" />
        <div class="course-list"  v-else>
          <div class="course-card" v-for="course in courses" :key="course.id">
            <img :src="course.image" alt="Course Image" class="course-image" />
            <div class="course-content">
              <label class="label-status">{{ course.statusUse }}</label>
              <h3 class="course-title">{{ course.name }}</h3>
              <p class="course-detail">{{ course.detail }}</p>
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
              <button class="register-button" @click.stop="handlePayment(course)">Xem chi tiết</button>
            </div>
          </div>
        </div>
        <Pagination
          :total="total"
          :itemsPerPage="itemsPerPage"
          :currentPage="currentPage"
          @changePage="changePage"
        />
        <div class="note" v-if="courses.length == 0">
          Không tìm thấy kết quả
        </div>
      </div>
      <div v-else>
        <h2 class="section-title">Khóa học của tôi</h2>
        <div v-if="myCourses.length > 0" class="course-list">
          <div class="course-card" v-for="value in myCourses" :key="value.course.id"
            @click="handleCourseClick(value)">
            <img :src="value.course.image" alt="Course Image" class="course-image" />
            <div class="course-content">
              <h3 class="course-title">{{ value.course.name }}</h3>
              <p class="course-detail">{{ value.course.detail }}</p>
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
    </div>
    <DetailPopup v-if="showPopup" :course="selectedCourse" :visible="showPopup" @close="showPopup = false" />
  </div>
</template>

<style scoped>
.courses-page {
  margin: 40px auto;
  max-width: 1400px;
  padding: 0px 5%;
}

.header-title {
  text-align: center;
  margin-bottom: 40px;
  margin-top: 20px;
}

.header-title .title {
  font-size: 30px;
  font-weight: bold;
  color: var(--color-primary);
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
  font-size: 16px;
  cursor: pointer;
  background-color: #f4f4f4;
  color: #333;
  border: none;
  text-align: center;
  width: fit-content;
  font-family: inherit;
}

.tabs button.active {
  background: var(--color-primary);
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary) 35%, rgba(44, 44, 44, 1) 100%);
  color: white;
}
.isloading {
    height: 50vh;
    background-color: transparent;
}
.courses-page .note {
    text-align: center;
    color: white;
}

.search-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 60%;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
}
.search-row {
    position: relative;
    width: 100%;
}
.search-icon {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
    font-size: 16px;
    color: #aaa;
    pointer-events: none;
}
.search-input {
    width: 100%;
    padding: 10px 20px 10px 40px;
    border: 2px solid #fff;
    border-radius: 25px;
    font-size: 16px;
    outline: none;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.search-input:focus {
    border-color: #4a90e2;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.search-input::placeholder {
    color: #aaa;
    font-size: 14px;
}
.section-title {
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 5px;
  color: white;
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

.label-status {
  background-color: #fff;
  background-image: none;
  background-repeat: repeat no-repeat;
  border-radius: 15px 225px 255px 15px 15px 255px 225px 15px;
  border-style: solid;
  border-width: 2px;
  box-shadow: rgba(0, 0, 0, .2) 15px 28px 25px -18px;
  box-sizing: border-box;
  color: var(--color-primary);
  cursor: pointer;
  display: inline-block;
  line-height: 16px;
  padding: 5px;
  transition: all 235ms ease-in-out;
  border-bottom-left-radius: 15px 255px;
  border-bottom-right-radius: 225px 15px;
  border-top-left-radius: 255px 15px;
  border-top-right-radius: 15px 225px;
  position: absolute;
  top: 10px;
  right: 10px;
}

.label-status:hover {
  box-shadow: rgba(0, 0, 0, .3) 2px 8px 8px -5px;
  transform: translate3d(0, 2px, 0);
}

.label-status:focus {
  box-shadow: rgba(0, 0, 0, .3) 2px 8px 4px -6px;
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
  background-color: var(--color-primary);
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
  background-color: var(--color-primary);
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
    padding: 10px 20px;
    color: 15px;
  }

  .course-card {
    width: 100%;
  }
}
</style>
