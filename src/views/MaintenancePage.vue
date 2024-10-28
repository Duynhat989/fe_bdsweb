<script setup>
</script>

<template>
    <div class="maintenance-page">
        <div class="maintenance-content">
            <h1>Website đang bảo trì</h1>
            <p>Chúng tôi đang nâng cấp hệ thống để phục vụ bạn tốt hơn. Xin vui lòng quay lại sau.</p>
        </div>
    </div>
</template>

<style scoped>
.maintenance-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #fff;
    color: #E03C31;
    text-align: center;
}

.maintenance-content {
    max-width: 600px;
}

.maintenance-content h1 {
    font-size: 2.5em;
    margin-bottom: 20px;
}

.maintenance-content p {
    font-size: 1.2em;
}
</style>