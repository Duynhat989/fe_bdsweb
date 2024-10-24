<script setup>
import { ref , onMounted } from 'vue';
const currentVideo = ref(null);
const selectedLessonIndex = ref(null);
import { END_POINT } from '@/api/api';
import request from '@/utils/request';
import { useRoute } from 'vue-router';
import { decodeId } from '@/utils/encoding';

const route = useRoute();

const encodedId = route.params.id;

const courseId = decodeId(encodedId);
const courseData = ref([]);

const fetchCourseData = async () => {
    try {
        if (courseId) {
            const response = await request.post(END_POINT.COURSE_FIND, { id: courseId });
            courseData.value = response.data; 
        } else {
            console.error('ID không hợp lệ');
        }
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu khóa học:', error);
    }
};

const playVideo = (url, index) => {
    currentVideo.value = url;
    selectedLessonIndex.value = index;
};

onMounted(fetchCourseData);
</script>
<template>
    <div class="course-detail">
        <div class="course-header">
            <div class="course-info">
                <h1 class="title">{{ courseData.name }}</h1>
                <p class="detail">{{ courseData.detail }}</p>
            </div>
        </div>

        <div class="content">
            <div class="video-section">
                <div v-if="currentVideo" class="video-player">
                    <iframe :src="currentVideo" title="Video bài giảng" frameborder="0" allowfullscreen></iframe>
                </div>
                <div v-else class="video-placeholder">
                    <p>Chọn bài giảng để xem video</p>
                </div>
            </div>
            <div class="lessons-section">
                <h2>Nội dung khóa học</h2>
                <ul class="lesson-list">
                    <li v-for="(lesson, index) in courseData.lessons" :key="index" class="lesson-item"
                        :class="{ active: selectedLessonIndex === index }" @click="playVideo(lesson.url_video, index)">
                        <div class="lesson-info">
                            <span class="lesson-index">{{ index + 1 }}</span>
                            <span>{{ lesson.name }}</span>
                            <span class="icon"><i class='bx bxs-movie-play'></i></span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.course-detail {
    max-width: 1300px;
    margin: 40px auto;
    padding: 50px 20px;
}

.course-header {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.course-image {
    width: 150px;
    height: 150px;
    object-fit: cover;
}

.course-info {
    flex: 1;
}

.course-info .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
}

.course-price {
    color: #E03C31;
    font-weight: bold;
}

.content {
    display: flex;
    gap: 20px;
}

.video-section {
    flex: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    padding: 20px;
    border-radius: 8px;
}

.video-player {
    width: 100%;
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
}

.video-player iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.video-placeholder {
    text-align: center;
    font-size: 18px;
    color: #555;
}

.lessons-section {
    flex: 2;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 600px;
    overflow-y: scroll;
}

.lesson-list {
    list-style: none;
    padding: 0;
}

.lesson-item {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
    transition: background 0.3s;
}

.lesson-item.active {
    color: #E03C31;
}

.lesson-item:hover {
    color: #E03C31;
    background: #f0f0f0;
}

.lesson-info {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
}

.lesson-info .icon {
    right: 10px;
    top: 50%;
    position: absolute;
    transform: translateY(-50%);
}

.lesson-index {
    font-weight: bold;
}

.list::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
}

::-webkit-scrollbar {
    width: 12px;
    background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: #D62929;
}

/* Responsive Styles */
@media (max-width: 1200px) {
    .course-detail {
        max-width: 1000px;
        padding: 0 20px;
    }
}

@media (max-width: 1024px) {
    .course-detail {
        max-width: 800px;
    }
}

@media (max-width: 768px) {
    .course-detail {
        max-width: 700px;
    }

}

@media (max-width: 576px) {
    .course-detail {
        width: 100%;
    }

    .content {
        flex-direction: column;
    }

    .video-section {
        flex: 1;
    }

    .lessons-section {
        flex: 1;
    }
}
</style>