<script>

</script>
<template>
    <div class="not-found-container">
        <div class="not-found-content">
            <img src="../assets/error-404.svg"  alt="404 Error" class="error-image">
            <h1 class="error-title">Oops! Trang không tồn tại.</h1>
            <p class="error-message">
                Có vẻ như bạn đã lạc vào một nơi không tồn tại. Trang mà bạn đang tìm kiếm không có sẵn hoặc đã bị xóa.
            </p>
            <router-link to="/" class="back-home-link">Quay lại trang chủ</router-link>
        </div>
    </div>
</template>


<style scoped>
.not-found-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f9f9f9;
    text-align: center;
    padding: 20px;
}

.not-found-content {
    max-width: 1200px;
    width: 100%;
    background-color: #ffffff;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.error-image {
    width: 100%;
    max-width: 400px;
    margin-bottom: 20px;
}

.error-title {
    font-size: 36px;
    font-weight: bold;
    color: var(--color-primary);
    margin-bottom: 20px;
}

.error-message {
    font-size: 18px;
    color: #666666;
    margin-bottom: 30px;
}

.back-home-link {
    display: inline-block;
    background-color: var(--color-primary);
    color: #ffffff;
    padding: 12px 24px;
    border-radius: 5px;
    text-decoration: none;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.back-home-link:hover {
    background-color: #c12b28;
}
</style>
