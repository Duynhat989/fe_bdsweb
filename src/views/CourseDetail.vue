<script setup>
import { ref, onMounted } from 'vue';

import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import { useRoute } from 'vue-router';
import { decodeId } from '@/utils/encoding';
import { getEmbedUrl } from '@/utils/helps';

const route = useRoute();

const encodedId = route.params.id;
const courseId = decodeId(encodedId);
const courseDetail = ref({});
const watched = ref([]);
const defaultImage = ref('');
const isFirstLoad = ref(true);
const currentVideo = ref(null);
const selectedLessonIndex = ref(null);
const fetchMyCourses = async () => {
    try {
        const response = await request.get(END_POINT.COURSE_ME);

        const courseData = response.data.find(courseItem => courseItem.course.id === courseId);
        if (courseData) {
            watched.value = JSON.parse(courseData.watched);
            courseDetail.value = {
                ...courseData.course,
                lessons: courseData.course.lessons.sort((a, b) => a.indexRow - b.indexRow),
            };
            defaultImage.value = courseDetail.value.image;
        }
    } catch (error) {
        console.error('Lỗi lấy danh sách trợ lý:', error);
    }
};

const playVideo = (url, index) => {
    currentVideo.value = url;
    selectedLessonIndex.value = index;
    isFirstLoad.value = false;
};
const loadConversation = async () => {
    await fetchMyCourses();

};
onMounted(() => {
    loadConversation();
});
</script>
<template>
    <div class="course-detail">
        <div class="course-header">
            <div class="course-info">
                <h1 class="title">{{ courseDetail.name }}</h1>
            </div>
        </div>

        <div class="content">
            <div class="video-section">
                <div v-if="isFirstLoad || !currentVideo" class="video-placeholder">
                    <p>Chọn bài giảng để xem video</p>
                    <img :src="defaultImage" alt="Hình ảnh khóa học">
                </div>
                <div v-else class="video-player">
                    <iframe :src="getEmbedUrl(currentVideo)" title="Video bài giảng" frameborder="0" allowfullscreen>
                    </iframe>
                </div>
            </div>

            <div class="lessons-section">
                <h2 class="section-title">Nội dung khóa học</h2>
                <ul class="lesson-list">
                    <li v-for="(lesson, index) in courseDetail.lessons" :key="index" class="lesson-item"
                        :class="{ active: selectedLessonIndex === index }" @click="playVideo(lesson.url_video, index)">
                        <div class="lesson-info">
                            <div class="lesson-thumbnail">
                                <img :src="lesson.image" :alt="lesson.name">
                                <button class="play-button">
                                    <i class='bx bx-play-circle'></i>
                                </button>
                            </div>
                            <div class="lesson-content">
                                <div class="lesson-header">
                                    <span class="watched-status" v-if="watched.includes(lesson.id)">
                                        <i class='bx bxs-check-circle'></i>
                                    </span>
                                </div>
                                <h3 class="lesson-title">{{ lesson.name }}</h3>
                                <p class="lesson-description">{{ lesson.detail }}</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div class="detail">
            <h2 class="detail-title">Nội dung mô tả</h2>
            <div class="detail-content">
                {{ courseDetail.detail }}
            </div>
        </div>
    </div>
</template>
<style scoped>
.course-detail {
  margin: 0 auto;
  margin-top: 40px;
  padding: 0 5%;
}

.course-header {
  margin-bottom: 24px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
}

.content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.video-section {
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/9;
}

.video-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.video-placeholder p {
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: bold;
  color: #E03C31;
}

.video-placeholder img {
  max-width: 100%;
  max-height: 400px;
  height: ;
  object-fit: cover;
  border-radius: 8px;
}

.video-player {
  height: 100%;
}

.video-player iframe {
  width: 100%;
  height: 100%;
}

.lessons-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1a1a1a;
}

.lesson-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 600px;
  overflow-y: auto;
}

.lesson-item {
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
  border: 1px solid #eee;
}

.lesson-item:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  border: 1px solid #E03C31;
}

.lesson-item.active {
  background: #e3f2fd;
  border-color: #90caf9;
}

.lesson-info {
  display: flex;
  gap: 16px;
}

.lesson-thumbnail {
  position: relative;
  width: 120px;
  height: 68px;
  border-radius: 8px;
  overflow: hidden;
}

.lesson-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lesson-item:hover .play-button {
  opacity: 1;
}

.play-button i {
  color: white;
  font-size: 24px;
}

.lesson-content {
  flex: 1;
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.watched-status i {
  color: #4caf50;
  font-size: 18px;
}

.lesson-title {
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.lesson-description {
  font-size: 14px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.detail {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1a1a1a;
}

.detail-content {
  color: #444;
  line-height: 1.6;
}

/* Scrollbar styles */
.lesson-list::-webkit-scrollbar {
  width: 6px;
}

.lesson-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.lesson-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.lesson-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive styles */
@media (max-width: 992px) {
  .content {
    grid-template-columns: 1fr;
  }
  
  .video-section {
    order: 1;
  }
  
  .lessons-section {
    order: 2;
  }
}

@media (max-width: 768px) {
  .course-detail {
    padding: 16px;
  }
  
  .lesson-info {
    flex-direction: column;
  }
  
  .lesson-thumbnail {
    width: 100%;
    height: 120px;
  }
}
</style>