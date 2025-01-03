<script setup>
import { ref, watch } from 'vue';
import request from '@/utils/request';
import { END_POINT } from '@/api/api';
import useNotification from '@/composables/useNotification';
import { useRouter } from 'vue-router';
import { parseJSON } from '@/utils/helps';
const notification = useNotification();
const router = useRouter();

const InputForm = ref([]);
const link = ref(null);
const isLoading = ref(false);
const contractData = ref({
    name: '',
    description: '',
    image: '',
    input: [],
});
const props = defineProps({
    contract: {
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

watch(
    () => props.contract,
    (newContract) => {
        if (newContract) {
            contractData.value = { ...newContract };

            InputForm.value = parseJSON(contractData.value.input);
            InputForm.value.forEach((input) => {
                if (input.type === 'select' && input.value.length > 0 && !input.selectedValue) {
                    input.selectedValue = input.value[0];
                }
            });
        } else {
            contractData.value = {};
            InputForm.value = [];
        }
    },
    { immediate: true }
);

const createContract = async () => {
    isLoading.value = true;
    try {
        if (props.contract.id) {
            const replaceData = InputForm.value.reduce((acc, field) => {
                acc[field.keyword] = field.type === "select"
                    ? (field.selectedValue || "..........") 
                    : (field.value || "..........");     
                return acc;
            }, {});
            const payload = {
                id: props.contract.id,
                replaceData: replaceData
            };
            console.log(payload);

            const response = await request.post(END_POINT.CONTRACT_EXPORT, payload, {
                responseType: 'blob'
            });
            const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            link.value = window.URL.createObjectURL(blob);

            notification.success('Thành công!', 'Hợp đồng đã được tải xuống thành công!', {
                showActions: false
            });
        } else {
            router.push('/404');
        }
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        notification.error('Lỗi!', `Tạo hợp đồng không thành công! Lỗi: ${message}`, {
            showActions: false
        });
    } finally {
        isLoading.value = false;
        InputForm.value.forEach(field => {
            if (field.type === "select") {
                field.selectedValue = null; 
            } else {
                field.value = ""; 
            }
        });
    }
};

</script>
<template>
    <div v-if="visible" class="modal-overlay">
        <div class="detail-popup">
            <div class="popup-content">
                <button class="close-btn" @click="closePopup"><i class="bx bxs-x-circle"></i></button>

                <h3>{{ contract.name || 'No Name Available' }}</h3>
                <p>{{ contract.description || 'No Description Available' }}</p>

                <div class="contract-image" v-if="contract.image">
                    <img :src="contract.image" alt="Contract Image" />
                </div>

                <div v-if="contract.input">
                    <form @submit.prevent="createContract">
                        <div v-for="(input, index) in InputForm" :key="index" class="form-group">
                            <label :for="'field-' + index">{{ input.title || 'Nhập thông tin hợp đồng' }}</label>
                            <select v-if="input.type === 'select'" :id="'field-' + index" v-model="input.selectedValue"
                                :required="input.required">
                                <option v-for="(option, optIndex) in input.value" :key="optIndex" :value="option">
                                    {{ option }}
                                </option>
                            </select>
                            <input v-else type="text" :id="'field-' + index" v-model="input.value"
                                :placeholder="input.placeholder || 'Điền thông tin'" :required="input.required" />
                        </div>
                        <a class="button-link" :href="link" v-if="link" download="Hop_dong.docx">Tải file</a>
                        &nbsp;&nbsp;

                        <button type="submit" :disabled="isLoading" class="button-contract">
                            <span v-if="isLoading">
                                <svg style="margin-bottom: -3px;" xmlns="http://www.w3.org/2000/svg" width="1em"
                                    height="1em" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                        d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
                                        opacity="0.5" />
                                    <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
                                        <animateTransform attributeName="transform" dur="1s" from="0 12 12"
                                            repeatCount="indefinite" to="360 12 12" type="rotate" />
                                    </path>
                                </svg>
                                Đăng tạo hợp đồng ...</span>
                            <span v-else>Tạo hợp đồng</span>
                        </button>
                    </form>
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
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.detail-popup {
    background-color: #fff;
    border-radius: 8px;
    max-width: 900px;
    width: 90%;
    padding: 20px;
    text-align: center;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
    animation: fadeIn 0.3s ease-out;
    overflow: auto;
    height: 80vh;
}

.detail-popup::-webkit-scrollbar {
    display: none;
}

.close-btn {
    position: absolute;
    top: -15px;
    right: -15px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 24px;
    color: #333;
}

.popup-content {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

h3 {
    margin: 0;
    font-size: 1.5em;
    color: #333;
}

p {
    margin: 0;
    color: #666;
    font-size: 1em;
}

.contract-image img {
    max-width: 100%;
    width: 100%;
    object-fit: contain;
    border-radius: 4px;
    margin: 10px 0;
    height: 300px;
}

.form-group {
    display: flex;
    flex-direction: row;
    gap: 25px;
    margin-bottom: 15px;
}

.button-link {
    color: var(--color-primary);
    text-decoration: underline;
}

.form-group label {
    font-weight: bold;
    color: #333;
    flex: 1;
    text-align: left;
}

.form-group input,
.form-group select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1em;
    flex: 2;
    color: #333;
}

.button-contract {
    width: fit-content;
    padding: 10px;
    background-color: var(--color-primary);
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 1em;
    cursor: pointer;
    transition: background 0.3s ease;
}

.button-contract:hover {
    opacity: 0.8;
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
@media (max-width: 767px) {
    .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
        gap: 5px;
    }
}

</style>
