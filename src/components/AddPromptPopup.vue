<script setup>
import useNotification from '@/composables/useNotification';
import { ref, watch } from 'vue';
import request from '@/utils/request';
import { END_POINT } from '@/api/api';

const promptSuccess = ref({});
const notification = useNotification();
const props = defineProps({
    assistantId: {
        type: Number,
        required: true
    },
    selectePrompt: Object,
    isEdit: Boolean,
    visible: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['close', 'promptAdded']);
const promptData = ref({
    assistant_id: props.assistantId,
    prompt_text: '',
    name: ''
});
watch(
    () => props.selectePrompt,
    async (newPrompt) => {
        if (newPrompt) {
            console.log(props.assistantId);
            promptData.value = {
                assistant_id: props.assistantId,
                ...newPrompt,
            }
        } else {
            promptData.value = {
                assistant_id: props.assistantId,
                prompt_text: '',
                name: ''
            }
        }
    },
    { immediate: true }
)
const closePopup = () => {
    emit('close');
};

const createPrompt = async () => {
    try {
        const dataToSubmit = {
            ...promptData.value,
            ...(props.isEdit && { id: props.selectePrompt.id })
        };
        let response;
        response = await request.post(props.isEdit ? END_POINT.PROMPT_UPDATE : END_POINT.PROMPT_CREATE, dataToSubmit);
        if (response.success) {
            promptSuccess.value = response.data;
            notification.success('Thành công!', props.isEdit ? 'Cập nhật prompt thành công!' : 'Thêm mới prompt thành công!', {
                showActions: false
            });
            emit('promptAdded', { prompt: promptSuccess.value })
            closePopup();
        }
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        notification.error('Lỗi!', `Tạo prompt không thành công! Lỗi: ${message}`, {
            showActions: false
        });
    }
};

</script>
<template>
    <div v-if="visible" class="modal-overlay">
        <div class="detail-popup">
            <div class="popup-content">
                <button class="close-btn" @click="closePopup"><i class="bx bxs-x-circle"></i></button>
                <form @submit.prevent="createPrompt">
                    <label>{{ isEdit ? 'Chỉnh sửa prompt' : 'Thêm prompt' }}</label>
                    <input v-model="promptData.name" placeholder="Nhập tên prompt" required />
                    <input v-model="promptData.prompt_text" placeholder="Nhập nội dung prompt" required />
                    <button type="submit" class="button-prompt">{{ isEdit ? 'Chỉnh sửa' : 'Tạo prompt' }}</button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.detail-popup {
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 1001;
    animation: fadeIn 0.3s ease;
}

.popup-content {
    display: flex;
    flex-direction: column;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    color: #888;
    cursor: pointer;
    transition: color 0.3s ease;
}

.close-btn:hover {
    color: #ff4d4f;
}

label {
    font-weight: bold;
    margin-bottom: 8px;
    color: #333;
}

input {
    margin-top: 10px;
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    color: #333;
}

.button-prompt {
    background-color: #318be0;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.button-prompt:hover {
    opacity: 0.8;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
