<script setup>
import { ref, onMounted, watch } from 'vue';
import request from '@/utils/request';
import { END_POINT } from '@/api/api';
import useNotification from '@/composables/useNotification';
import { useRouter } from 'vue-router';

const notification = useNotification();
const router = useRouter();
const contract = ref({});
const formData = ref({}); // Store form data from input fields

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

// Watch for contract data and populate formData
watch(
    () => props.contract,
    (newContract) => {
        if (newContract) {
            contract.value = { ...newContract };
            let inputs;
            if (typeof contract.value.input === 'string') {
                inputs = JSON.parse(contract.value.input || '[]');
            }
            console.log(inputs);
            formData.value = inputs.reduce((acc, input) => {
                acc[input.keyword] = '';
                return acc;
            }, {});
        } else {
            contract.value = {};
            formData.value = {};
        }
    },
    { immediate: true }
);

const createContract = async () => {
    try {
        if (props.contract.id) {
            const response = await request.post(END_POINT.contract_SIGNIN, {
                contract_id: props.contract.id,
                form_data: formData.value // Send form data along with the request
            });
            if (response.success) {
                contract.value = response.data;
                notification.success('Thành công!', 'Đăng ký hợp đồng thành công!', {
                    showActions: false
                });
                closePopup();
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } else {
            router.push('/404');
        }
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        notification.error('Lỗi!', `Đăng ký hợp đồng không thành công! Lỗi: ${message}`, {
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

                <!-- Display contract name and description -->
                <h3>{{ contract.name || 'No Name Available' }}</h3>
                <p>{{ contract.description || 'No Description Available' }}</p>

                <!-- Display contract image if available -->
                <div class="contract-image" v-if="contract.image">
                    <img :src="contract.image" alt="Contract Image" />
                </div>

                <!-- Dynamic form fields based on input data -->
                <div v-if="contract.input">
                    <form @submit.prevent="createContract">
                        <div v-for="(input, index) in JSON.parse(contract.input)" :key="index" class="form-group">
                            <label :for="input.keyword">{{ input.title }}</label>

                            <!-- Render a select dropdown if type is "select" -->
                            <select v-if="input.type === 'select'" :id="input.keyword"
                                v-model="formData[input.keyword]">
                                <option v-for="(option, optIndex) in input.value" :key="optIndex" :value="option">
                                    {{ option }}
                                </option>
                            </select>

                            <!-- Render a text input if type is not "select" -->
                            <input v-else type="text" :id="input.keyword" :placeholder="input.placeholder"
                                v-model="formData[input.keyword]" />
                        </div>

                        <button type="submit" class="button-contract">Đăng ký</button>
                    </form>
                </div>


                <!-- Template contract download link -->
                <div v-if="contract.template_contract">
                    <a :href="contract.template_contract" target="_blank" class="button-contract">
                        Tải mẫu hợp đồng
                    </a>
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

.contract-image {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.contract-image img {
    width: 100%;
    max-width: 400px;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.button-contract {
    background-color: #ff3f3f;
    color: white;
    border: none;
    padding: 10px 15px;
    font-size: 18px;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 10px;
    font-family: inherit;
    position: absolute;
    top: 10px;
    left: 20px;
}

.button-contract:hover {
    opacity: 0.8;
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
