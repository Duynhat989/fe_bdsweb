<script setup>
import { ref, watch } from 'vue';
import { formatCurrency, getFeatureNames } from '@/utils/helps';
import { generateVietQRUrl } from '@/utils/qrHelper';
const props = defineProps({
    package: {
        type: Object,
        default: () => ({}),
    },
    visible: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close']);
const totalPrice = ref(0);
const qrCodeUrl = ref(null);

watch(
    () => props.package,
    (newPackage) => {
        totalPrice.value = newPackage.price || 0;
    },
    { immediate: true }
);

const closePopup = () => {
    emit('close');
    qrCodeUrl.value = null;
};


const createInvoice = () => {
  const accountNumber = import.meta.env.VITE_ACCOUNT_NUMBER;
  const paymentContent = import.meta.env.VITE_PAYMENT_CONTENT;
  const bankCode = import.meta.env.VITE_BANK_CODE;
  const accountName = import.meta.env.VITE_ACCOUNT_NAME;
  const amount = totalPrice.value;

  qrCodeUrl.value = generateVietQRUrl(bankCode, accountNumber, amount, paymentContent,accountName);
};
</script>

<template>
    <div v-if="visible" class="modal-overlay">
        <div class="payment-popup">
            <div class="popup-content">
                <button class="close-btn" @click="closePopup"><i class="bx bxs-x-circle"></i></button>
                <h3>{{ package.name }}</h3>
                <p class="package-features" v-html="getFeatureNames(package.features,', ') || 'Không có tính năng bổ sung' "></p>

                <div class="payment-details">
                    <h4>Chi tiết thanh toán</h4>
                    <p>Gói đăng ký: <span> {{ package.name }}</span></p>
                    <p>Số lượt yêu cầu: <span> {{ package.ask }}</span></p>
                    <p>Giá: <span>{{ formatCurrency(package.price) }}</span></p>
                    <p>Tổng: <span>{{ formatCurrency(totalPrice) }}</span></p>
                    <button @click="createInvoice" class="invoice-btn">Tạo hóa đơn</button>
                    <div v-if="qrCodeUrl" class="payment-qr">
                        <img :src="qrCodeUrl" alt="Mã QR thanh toán" />
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
    gap: 10px;
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
    font-size: 20px;
    font-weight: bold;
    line-height: 24px;
    color: #E03C31;
}

.package-features {
    font-size: 14px;
    color: #555;
    margin-bottom: 10px;
    text-align: left;
}

.payment-details {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 10px;
    font-size: 14px;
    text-align: left;
}
.payment-details span {
    color: #E03C31;
}

.payment-details h4 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.payment-details p {
    margin: 5px 0;
}

.invoice-btn {
    background-color: #ff3f3f;
    color: white;
    border: none;
    padding: 8px 10px;
    font-size: 14px;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 10px;
    font-family: inherit;
}

.payment-qr {
    margin-top: 15px;
    text-align: center;
}

.payment-qr img {
    width: 200px;
    height: auto;
    object-fit: contain;
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

canvas {
    margin-top: 10px;
}
</style>
