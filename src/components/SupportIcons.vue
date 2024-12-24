<script setup>
    import { ref } from 'vue';
    import zalo from '@/assets/images/Icon_of_Zalo.svg';
    import message from '@/assets/images/message.svg';
    import robot_phone from '@/assets/images/robot_phone.jpg';
    const showSupportModal = ref(false);

    const openSupportModal = () => {
        showSupportModal.value = true;
    };

    const closeSupportModal = () => {
        showSupportModal.value = false;
    };
</script>
<template>
    <div class="floating-icons">
        <a href="https://zalo.me/3855735057178174662" target="_blank" class="icon">
            <img :src="zalo" alt="Logo zalo" width="50">
        </a>
        <a href=" https://messenger.com/t/535785202944836?ref=appaph" target="_blank" class="icon">
            <img :src="message" alt="Logo Messenger" width="50">
        </a>
        <div class="icon icon-robot">
            <img :src="robot_phone" alt="Logo Messenger" width="50"  @click="openSupportModal" >
        </div>
        <div v-if="showSupportModal" class="modal">
            <div class="modal-content">
                <span class="close-btn" @click="closeSupportModal">&times;</span>
                <h3>Hướng dẫn sử dụng</h3>
                <p>Vui lòng làm theo các bước sau để được hỗ trợ...</p>
            </div>
        </div>
    </div>
</template>
<style scoped>
.floating-icons {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    z-index: 1000;
}

.floating-icons .icon {
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    border-radius: 50%;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}
.floating-icons .icon-robot {
    overflow: hidden;
}
.floating-icons .icon img {
    width: 80%;
    height: 80%;
    object-fit: contain;
}

.floating-icons .icon:hover {
    transform: scale(1.1);
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.2);
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1100;
}

.modal-content {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    width: 800px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    text-align: center;
    position: relative;
}

.modal-content .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    color: #555;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    font-size: 16px;
    background-color: #f44336;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>