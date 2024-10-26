<script setup>
import { ref, onMounted } from 'vue';
const currentVideo = ref(null);
const selectedLessonIndex = ref(null);
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
            if (courseDetail.value.lessons.length > 0) {
                defaultImage.value = courseDetail.value.lessons[0].image;
                currentVideo.value = courseDetail.value.lessons[0];
            }
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
                    <iframe :src="getEmbedUrl(currentVideo)" title="Video bài giảng" frameborder="0"
                        allowfullscreen></iframe>
                </div>
            </div>
            <div class="lessons-section">
                <h2>Nội dung khóa học</h2>
                <ul class="lesson-list">
                    <li v-for="(lesson, index) in courseDetail.lessons" :key="index" class="lesson-item"
                        :class="{ active: selectedLessonIndex === index }" @click="playVideo(lesson.url_video, index)">
                        <div class="lesson-info">
                            <span class="lesson-index">{{ index + 1 }}</span>
                            <span>{{ lesson.name }}</span>
                            <span class="icon" v-if="watched.includes(index + 1)">
                                <i class='bx bxs-movie-play'></i>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="detail">
            <p>Nội dung mô tả</p>
            <div class="detail-ct">
                {{ courseDetail.detail }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.course-detail {
    padding: 40px 5%;
    margin: 40px auto;
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
    font-size: 30px;
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

.detail {
    margin-top: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.detail p {
    color: #E03C31;
    font-size: 18px;
    font-weight: bold;
}

.detail .detail-ct {
    margin-top: 15px;
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

.video-placeholder img {
    margin-top: 20px;
    width: 100%;
    object-fit: contain;
    max-height: 400px;
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

.lessons-section h2 {
    font-size: 20px;
    font-weight: bold;
    color: #D62929;
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
    color: #E03C31;
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