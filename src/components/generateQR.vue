<script setup>
import { ref, onMounted } from 'vue';
import { generateQR } from '@/utils/qrHelper'; // Đường dẫn tùy chỉnh

const qrCodeUrl = ref(null);

const createInvoice = async () => {
    const accountNumber = '0123456789';
    const amount = 1000000;
    const content = 'Thanh toan khoa hoc';

    qrCodeUrl.value = await generateQR(accountNumber, amount, content);
};
</script>

<template>
    <div>
        <button @click="createInvoice" class="invoice-btn">Tạo hóa đơn</button>
        
        <div v-if="qrCodeUrl" class="payment-qr">
            <img :src="qrCodeUrl" alt="Mã QR thanh toán" />
        </div>
    </div>
</template>
