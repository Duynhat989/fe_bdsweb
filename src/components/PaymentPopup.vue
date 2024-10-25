<script setup>
import { ref } from 'vue';
import { formatCurrency } from '@/utils/helps';

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

// Sự kiện emit từ component con sang component cha
const emit = defineEmits(['close']);

const totalPrice = ref(props.course.price || 0);

const closePopup = () => {
    emit('close');
};
</script>

<template>
    <div v-if="visible" class="modal-overlay">
        <div class="payment-popup">
            <div class="popup-content">
                <button class="close-btn" @click="closePopup"><i class='bx bxs-x-circle'></i></button>
                <h3>{{ course.name }}</h3>
                <p>{{ course.detail }}</p>
                <div class="payment-details">
                    <h4>Chi tiết thanh toán</h4>
                    <p>Khóa học: {{ course.name }}</p>
                    <p>Giá : {{ formatCurrency(course.price ) }}</p>
                    <p>Tổng: {{ formatCurrency(totalPrice)  }}</p>
                    <p>Nôi dung: <span class="payment-content">Nội dung</span></p>
                    <div class="payment-qr">
                        <img src="https://via.placeholder.com/150" alt="Mã QR">
                    </div>
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
    background-color: rgba(0, 0, 0, 0.6); 
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.payment-popup {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    max-width: 450px;
    width: 90%;
    padding: 20px;
    text-align: center;
    position: relative;
    animation: popupFadeIn 0.3s ease-in-out;
}

.popup-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    color: #333;
}

h3 {
    font-size: 24px;
    color:#E03C31;
}

p {
    font-size: 16px;
    color: #555;
}

.payment-details {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 15px;
    text-align: left;
}

.payment-details h4 {
    font-size: 18px;
    margin-bottom: 10px;
    color: #333;
}

.payment-details p {
    margin: 5px 0;
}

.payment-content {
    font-weight: bold;
    color: #E03C31; 
}

.payment-qr {
    margin-top: 15px;
    text-align: center;
}

.payment-qr img {
    width: 150px;
    height: 150px;
    border-radius: 8px;
}

@keyframes popupFadeIn {
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