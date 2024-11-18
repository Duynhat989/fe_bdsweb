<script setup>
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { onMounted, ref } from 'vue';

const isLoading = ref(false);

onMounted(() => {
    setTimeout(() => {
        isLoading.value = true;
    }, 500);
});
</script>

<template>
    <LoadingSpinner v-if="!isLoading" />
    <div class="main-container" v-else>
        <div class="header-title">
            <h1 class="title">Kiểm tra quy hoạch</h1>
            <p style="color: white;" class="description">Mô tả về kiểm tra quy hoạch.</p>
        </div>
        <div class="check-process-page">
            <div class="content">
                <!-- Video Column -->
                <div class="video-column">
                    <div class="video-box">
                        <iframe src="https://www.youtube.com/embed/tgbNymZ7vqY" title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>
                    </div>
                </div>

                <div class="steps-column">
                    <div class="steps-box">
                        <h2>Các bước thực hiện</h2>
                        <div class="steps-list">
                            <div class="step-box">
                                <h3 class="step-name">Bước 1</h3>
                                <p class="step-description">Tìm hiểu yêu cầu kiểm tra quy hoạch</p>
                            </div>
                            <div class="step-box">
                                <h3 class="step-name">Bước 2</h3>
                                <p class="step-description">Chuẩn bị tài liệu và thông tin cần thiết</p>
                            </div>
                            <div class="step-box">
                                <h3 class="step-name">Bước 3</h3>
                                <p class="step-description">Kiểm tra trên hệ thống quy hoạch</p>
                            </div>
                            <div class="step-box">
                                <h3 class="step-name">Bước 4</h3>
                                <p class="step-description">Đối chiếu và xác nhận thông tin</p>
                            </div>
                            <div class="step-box">
                                <h3 class="step-name">Bước 5</h3>
                                <p class="step-description">Hoàn tất và lưu kết quả kiểm tra</p>
                            </div>
                            <div class="step-box">
                                <h3 class="step-name">Bước 5</h3>
                                <p class="step-description">Hoàn tất và lưu kết quả kiểm tra</p>
                            </div>
                            <div class="step-box">
                                <h3 class="step-name">Bước 5</h3>
                                <p class="step-description">Hoàn tất và lưu kết quả kiểm tra</p>
                            </div>
                            <div class="step-box">
                                <h3 class="step-name">Bước 5</h3>
                                <p class="step-description">Hoàn tất và lưu kết quả kiểm tra</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
.main-container {
    width: 100%;
    padding: 20px 5%;
    margin: 5px auto;
    position: relative;
}

.check-process-page {
    margin-top: 30px;
    padding: 20px;
}

.header-title {
    text-align: center;
    margin-bottom: 20px;
    margin-top: 20px;
}

.title {
    font-size: 25px;
    font-weight: bold;
    color: #333;
}

.description {
    margin-top: 15px;
    font-size: 16px;
    color: #555;
}

.content {
    display: flex;
    gap: 20px;
    margin-top: 20px;
    justify-content: center;
    align-items: flex-start;
}

.video-column {
    flex: 1;
    display: flex;
    justify-content: center;
}

.video-box {
    width: 100%;
    max-width: 700px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.video-box:hover {
    transform: scale(1.02);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
}

iframe {
    width: 100%;
    height: 580px;
    border: none;
    border-radius: 10px;
}

.steps-column {
    flex: 1;
}

.steps-box {
    background-color: #f9fafc;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    overflow: auto;
    height: 580px;
}

.steps-box h2 {
    font-size: 20px;
    font-weight: bold;
    color: #007bff;
    margin-bottom: 15px;
}

.steps-list {
    display: flex;
    flex-direction: column;
    gap: 15px;

}

.step-box {
    background-color: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.step-box:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
}

.step-name {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin: 0 0 5px 0;
}

.step-description {
    font-size: 15px;
    color: #555;
    margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .content {
        flex-direction: column;
        gap: 20px;
    }
    .steps-column ,
    .video-column {
        width: 100%;
    }
    .video-box,
    .steps-box {
        max-width: 100%;
    }
    iframe {
        height: 400px;
    }

    .steps-box h2 {
        font-size: 18px;
    }

    .step-name {
        font-size: 16px;
    }

    .step-description {
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .title {
        font-size: 20px;
    }

    .description {
        font-size: 14px;
    }

    .steps-box h2 {
        font-size: 18px;
    }

    .step {
        font-size: 14px;
    }
}
</style>
