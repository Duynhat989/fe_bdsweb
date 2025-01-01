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
            <h1 class="title">Hướng dẫn kiểm tra quy hoạch</h1>
            <p style="color: white;" class="description">Mô tả về kiểm tra quy hoạch.</p>
        </div>
        <div class="check-process-page">
            <div class="content">
                <!-- Video Column -->
                <div class="video-column">
                    <div class="video-box">
                        <iframe src="https://drive.google.com/file/d/10--aeWEnQY4IvJ2n7BGtlFThXKfUW1I9/preview" width="640" height="480" allow="autoplay"></iframe>
                    </div>
                </div>

                <div class="steps-column">
                    <div class="steps-box">
                        <h2>Các bước thực hiện</h2>
                        <div class="steps-list">
                            <div class="step-box">
                                <h3 class="step-name">Bước 1: Kiểm tra quy hoạch sơ bộ qua các ứng dụng online</h3>
                                <ul class="step-details">
                                    <li>Sử dụng các ứng dụng chuyên về thông tin bất động sản như:</li>
                                    <ul>
                                        <li>Thongtinland</li>
                                        <li>Guland</li>
                                        <li>Meeymap</li>
                                        <li>QHviet</li>
                                    </ul>
                                    <li>Các ứng dụng này giúp bạn xem bản đồ quy hoạch, vị trí, và các thông tin liên
                                        quan.</li>
                                    <li>Tuy nhiên thông tin từ các ứng dụng này chỉ mang tính tham khảo và
                                        cần xác minh lại.</li>
                                </ul>
                            </div>
                            <div class="step-box">
                                <h3 class="step-name">Bước 2: Xác minh thông tin quy hoạch tại cơ quan công quyền trước
                                    khi đặt cọc/ký hợp đồng mua bán</h3>
                                <ul class="step-details">
                                    <li>Kiểm tra trên cổng thông tin điện tử của UBND các tỉnh, thành phố nơi có bất
                                        động sản.</li>
                                    <li>Đến UBND cấp xã, phường hoặc quận, huyện nơi bất động sản tọa lạc để xin thông
                                        tin quy hoạch chi tiết.</li>
                                </ul>
                            </div>
                            <div class="step-box">
                                <h3 class="step-name">Bước 3: Yêu cầu thông tin quy hoạch có xác nhận chính thức</h3>
                                <p class="step-description">Bạn cần được cung cấp <strong>tài liệu quy hoạch có dấu xác
                                        nhận của cơ quan công quyền</strong>. Đây là bước quan trọng để đảm bảo thông
                                    tin chính xác và hợp pháp.</p>
                            </div>
                            <div class="step-box">
                                <h3 class="step-name">Bước 4: Kiểm tra thông tin quy hoạch được cung cấp</h3>
                                <ul class="step-details">
                                    <li>Đọc kỹ các tài liệu được cung cấp, kiểm tra thông tin về:</li>
                                    <ul>
                                        <li>Mục đích sử dụng đất</li>
                                        <li>Lộ giới, chỉ giới xây dựng</li>
                                        <li>Kế hoạch sử dụng đất trong tương lai</li>
                                        <li>Bất kỳ thay đổi nào có thể ảnh hưởng đến giá trị hoặc khả năng sử dụng bất
                                            động sản</li>
                                    </ul>
                                </ul>
                            </div>
                            <div class="step-box">
                                <h3 class="step-name">Bước 5: Sử dụng thông tin đó để ra quyết định đầu tư chính xác
                                    nhất</h3>
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
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin: 0 0 5px 0;
}

.step-description {
    font-size: 13px;
    color: #555;
    margin: 0;
}
.step-box ul.step-details {
    list-style: disc;
    margin: 0 0 0 20px;
    padding: 0;
    color: #333;
    font-size: 14px;
}

.step-box ul.step-details ul {
    list-style: circle;
    margin: 5px 0 0 20px;
    font-size: 13px;
    color: #555;
}

.step-box li {
    margin-bottom: 5px;
}

.step-box strong {
    font-weight: bold;
    color: #d9534f;
}

.step-box:last-child {
    border: 2px solid #0056b3;
    background-color: #e8f4ff;
}
/* Responsive Design */
@media (max-width: 1024px) {
    .content {
        flex-direction: column;
        gap: 20px;
    }

    .steps-column,
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
