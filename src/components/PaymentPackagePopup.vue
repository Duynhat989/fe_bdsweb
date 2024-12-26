<script setup>
import { ref, watch, computed } from 'vue';
import { formatCurrency, getFeatureNames } from '@/utils/helps';
import { generateVietQRUrl } from '@/utils/qrHelper';
import request from '@/utils/request';
import { END_POINT } from '@/api/api';
import useNotification from '@/composables/useNotification';

const notification = useNotification();

const qrCodeUrl = ref(null);
const totalPrice = ref(0);
const accountNumber = import.meta.env.VITE_ACCOUNT_NUMBER;
const bankCode = import.meta.env.VITE_BANK_CODE;
const accountName = import.meta.env.VITE_ACCOUNT_NAME;
const paymentContent = ref('');
const paymentData = ref({});
const extensionPeriod = ref(1);
const isInvoiceCreated = ref(false);
const isQRCodeLoading = ref(false);

const isPaidLoading = ref(false);

import store from '@/store';

const user = computed(() => store.state.user);
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
const updateTotalPrice = () => {
    if (extensionPeriod.value < 1) {
        extensionPeriod.value = 1;
    }
};
const emit = defineEmits(['close']);
watch(
    () => props.package,
    (newPackage) => {
        totalPrice.value = newPackage.price || 0;
    },
    { immediate: true }
);

const closePopup = () => {
    emit('close');
    isInvoiceCreated.value = false;
    qrCodeUrl.value = null;
    isQRCodeLoading.value = false;
};
const createInvoice = async () => {
    try {
        isQRCodeLoading.value = true;
        const calculatedTotal = totalPrice.value * extensionPeriod.value;

        paymentContent.value = `APH${props.package.id}USER${user.value.id}CO${Math.floor(1000 + Math.random() * 9000)}`;
        qrCodeUrl.value = await generateVietQRUrl(
            bankCode,
            accountNumber,
            calculatedTotal,
            paymentContent.value,
            accountName
        );
        paymentData.value = {
            user_id: user.value.id,
            pay_status: 1,
            invoice_code: paymentContent.value,
            must_pay: calculatedTotal,
            package_id: props.package.id,
            extension_period: extensionPeriod,
            message_code: paymentContent.value,
        };

        const response = await request.post(END_POINT.PAYMENT_CREATE, paymentData.value);

        if (response.data && response.success) {
            notification.success('Thành công!', 'Hóa đơn đã được tạo thành công vui lòng chuyển khoản theo mã QA dưới đây!', {
                showActions: false
            });
            qrCodeUrl.value = await generateVietQRUrl(
                bankCode,
                accountNumber,
                calculatedTotal,
                paymentContent.value,
                accountName
            );
            isInvoiceCreated.value = true;
            // load invoice 
            loadInvoice(paymentContent.value)
        }
    } catch (error) {
        console.error(error);
        notification.error('Lỗi!', `Không thể tạo hóa đơn. Vui lòng thử lại sau.`, {
            showActions: false
        });
    } finally {
        isQRCodeLoading.value = false;
    }
};

const loadInvoice = async (paymentValue) => {
    isPaidLoading.value = true
    let intelval = setInterval(async () => {
        const response = await request.post(END_POINT.PAYMENT_VERIFY, {
            invoice_code: paymentValue
        });
        if (response.isPaid) {
            notification.success('Thành công!', 'Nâng cấp thành công. Chuyển tiếp vào trang chủ sau 5s!', {
                showActions: false
            });
            clearInterval(intelval)
            setTimeout(() => {
                window.location.href = './'
            }, 7000)
        }

    }, 10000)
}
</script>

<template>
    <div v-if="visible" class="modal-overlay">
        <div class="payment-popup">
            <div class="popup-content">
                <button class="close-btn" @click="closePopup"><i class="bx bxs-x-circle"></i></button>
                <h3>{{ package.name }}</h3>
                <div class="package-features feature-list"
                    v-html="getFeatureNames(package.features) || 'Không có tính năng bổ sung'"></div>
                <div class="payment-details">
                    <h4>Chi tiết thanh toán</h4>
                    <p>Gói đăng ký: <span> {{ package.name }}</span></p>
                    <p>Số lượt yêu cầu: <span> {{ package.ask }}</span></p>
                    <div class="payment-info">
                        <div class="recipient-info">
                            <h4>Thông tin người nhận</h4>
                            <p>Ngân hàng: <span>{{ bankCode }}</span></p>
                            <p>Số tài khoản: <span>{{ accountNumber }}</span></p>
                            <p>Tên tài khoản: <span>{{ accountName }}</span></p>
                            <div class="input-number">
                                <label for="extension-period">Số tháng:</label>
                                <input id="extension-period" type="number" min="1" v-model.number="extensionPeriod"
                                    @input="updateTotalPrice" :disabled="isInvoiceCreated" />
                            </div>
                            <p>Giá: <span>{{ formatCurrency(totalPrice * extensionPeriod) }}</span></p>
                            <p>Nội dung chuyển : <span>{{ paymentContent }}</span></p>
                            <button @click="createInvoice" class="invoice-btn" :disabled="isInvoiceCreated">Tạo hóa
                                đơn</button>
                                <div class="notify flex" v-if="isPaidLoading">
                                    <div class="notify_icon"><box-icon name='loader' animation='spin' ></box-icon></div>
                                    <div><label>Đang kiểm tra trạng thái hóa đơn!</label></div>
                                </div>
                        </div>

                        <div class="payment-qr">
                            <span v-if="isQRCodeLoading" class="loading-icon"></span> <!-- Hiển thị icon loading QR -->
                            <img v-else :src="qrCodeUrl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.notify{
    width: 100%;
    text-align: center;
}
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
    max-width: 700px;
    width: 90%;
    padding: 20px;
    text-align: center;
    position: relative;
    animation: popupFadeIn 0.3s ease-in-out;
    height: 70vh;
    overflow: auto;
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
    color: var(--color-primary);
}

.package-features {
    font-size: 14px;
    color: #555;
    margin-bottom: 10px;
    text-align: left;
}

.payment-details {
    border-radius: 8px;
    padding: 20px;
    font-size: 14px;
    text-align: left;
}

.payment-details span {
    color: var(--color-primary);
}

.payment-details h4 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.payment-details p {
    margin: 5px 0;
}

.payment-info {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 40px;
    padding-top: 20px;
    border-top: 1px solid #ddd;
}

.payment-qr,
.recipient-info {
    width: 50%;
}

.recipient-info h4 {
    font-weight: bold;
    margin-bottom: 10px;
}

.recipient-info p {
    margin: 5px 0;
    color: #555;
}

.invoice-btn {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 8px 10px;
    font-size: 14px;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 10px;
    font-family: inherit;
}

.invoice-btn:hover {
    background-color: #b33a3a;
    opacity: 0.8;
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

.recipient-info label {
    font-weight: bold;
    display: block;
}

.input-number {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
}

.input-number label,
.input-number .input {
    flex: 50%;
}

.recipient-info input {
    width: 100%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

input:disabled {
    background-color: #f5f5f5;
    color: #999;
    border: 1px solid #ddd;
    cursor: not-allowed;
}

button:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
    border: 1px solid #aaa;
}

@media (max-width: 768px) {

    .payment-qr,
    .recipient-info {
        width: 100%;
    }

    .payment-info {
        flex-wrap: wrap;
    }

    .payment-qr[data-v-f196ce7d] {
        width: 100%;
    }
}

.loading-icon {
    display: inline-block;
    width: 32px;
    height: 32px;
    border: 4px solid transparent;
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
<style>
.feature-list {
    margin: 20px 0;
    padding: 0;
}

.feature-list strong {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 10px;
}

.feature-list ul {
    list-style-type: disc;
    padding-left: 20px;
    margin: 0;
}

.feature-list ul li {
    margin-bottom: 5px;
    font-size: 14px;
    color: #080808;
    line-height: 1.5;
}

.feature-list ul li:last-child {
    margin-bottom: 0;
}
.flex{
    display: block;
    align-items: center;
}
</style>