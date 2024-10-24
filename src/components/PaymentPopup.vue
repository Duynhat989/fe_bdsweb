<script setup>
import { ref, watch } from 'vue';

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
const emit = defineEmits(['close', 'paymentSuccess']);

const totalPrice = ref(props.course.price || 0);

const closePopup = () => {
    emit('close');
};

const processPayment = () => {
    emit('paymentSuccess');
    closePopup();
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
                    <p>Giá : {{ course.price }}đ</p>
                    <p>Tổng: {{ totalPrice }}đ</p>
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
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.payment-popup {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    width: 50%;
    max-width: 600px;
    position: relative;
}

.popup-content {
    position: relative;
}

.close-btn {
    position: absolute;
    top: -10px;
    right: -10px;
    background: none;
    border: none;
    font-size: 25px;
    cursor: pointer;
}

.payment-details {
    margin-top: 20px;
}

.payment-qr {
    text-align: center;
}
.payment-content {
    color: red;
    font-weight: bold;
}
.payment-details h4 {
    font-size: 18px;
    margin-bottom: 10px;
}

.payment-details p {
    margin-bottom: 5px;
}

.payment-details input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
}

.payment-details button {
    width: 100%;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 10px;
}

.payment-details button:hover {
    background: #0056b3;
}
</style>