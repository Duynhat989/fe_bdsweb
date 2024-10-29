<script setup>
import { ref,onMounted  } from 'vue';
import { formatCurrency } from '@/utils/helps';
import request from '@/utils/request';
import { END_POINT } from '@/api/api';
const course = ref([]);
const props = defineProps({
    course: {
        type: Object,
        default: () => ({}),
    },
    visible: {
        type: Boolean,
        default: false,
    },
});
console.log(props.course);
// Sự kiện emit từ component con sang component cha
const emit = defineEmits(['close']);

const totalPrice = ref(props.course.price || 0);


const closePopup = () => {
    emit('close');
};
const fetchFindCourses = async () => {
    try {
        if (props.course.id) {
            const response = await request.post(END_POINT.COURSE_FIND, { id: props.course.id });
            course.value = response.data;
        } else {
            router.push('/404');
            console.error('ID không hợp lệ');
        }
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
};
const loadCourses = async () => {
    await fetchFindCourses();
};

onMounted(() => {
    loadCourses();
});
</script>

<template>
    <div v-if="visible" class="modal-overlay">
        <div class="detail-popup">
            <div class="popup-content">
                <button class="close-btn" @click="closePopup"><i class="bx bxs-x-circle"></i></button>
                <h3>{{ course.name }}</h3>
                <p>{{ course.detail }}</p>
                
                <div class="course-image">
                    <img :src="course.image" alt="Course Image" />
                </div>

                <div class="lessons">
                    <h4>Danh sách bài giảng</h4>
                    <ul>
                        <li v-for="(lesson, index) in course.lessons" :key="index">
                            <h5>{{ lesson.name }}</h5>
                            <p>{{ lesson.detail }}</p>
                        </li>
                    </ul>
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
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.detail-popup {
    background: #ffffff;
    border-radius: 10px;
    width: 90%;
    max-width: 1000px;
    padding: 30px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    overflow-y: auto;
    max-height: 80vh;
    position: relative;
    animation: fadeIn 0.3s ease-in-out;
}
.detail-popup::-webkit-scrollbar {
  display: none;
}

.popup-content h3 {
    margin-top: 0;
    color: #333333;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: red;
}

.popup-content p {
    color: #666666;
    font-size: 16px;
    margin-bottom: 20px;
    text-align: center;
    line-height: 1.5;
}

.course-image {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.course-image img {
    width: 100%;
    max-width: 400px;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.lessons {
    margin-top: 20px;
}

.lessons h4 {
    color: #444444;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: center;
}

.lessons ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.lessons li {
    background: #f9f9f9;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
}

.lessons li:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.lessons h5 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333333;
}

.lessons p {
    margin: 5px 0 0;
    color: #666666;
    font-size: 15px;
    line-height: 1.4;
}

.close-btn {
    background: none;
    border: none;
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
    font-size: 1.5em;
    color: #888888;
    transition: color 0.2s ease;
}

.close-btn:hover {
    color: #333333;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
