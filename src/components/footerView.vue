<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-section">
                <img src="https://staticfile.batdongsan.com.vn/images/logo/standard/black/logo_gray-5.svg"
                    alt="Batdongsan Logo" class="footer-logo" />
                <p>CÔNG TY CỔ PHẦN PROPERTYGURU VIỆT NAM</p>
                <p>Tầng 31, Keangnam Hanoi Landmark, Phạm Hùng, Nam Từ Liêm, Hà Nội</p>
                <p>📞 (024) 3562 5939 - (024) 3562 5940</p>
            </div>

            <div class="footer-section">
                <h4>GIỚI THIỆU</h4>
                <p>Công ty chúng tôi là đơn vị dẫn đầu trong lĩnh vực bất động sản tại Việt Nam, cung cấp các giải pháp
                    thông minh và đa dạng về mua bán và cho thuê bất động sản.</p>
            </div>
            <div class="footer-section">
                <h4>HƯỚNG DẪN</h4>
                <ul>
                    <li><a href="#">Về chúng tôi</a></li>
                    <li><a href="#">Báo giá và hỗ trợ</a></li>
                    <li><a href="#">Câu hỏi thường gặp</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>LIÊN HỆ HOTLINE</h4>
                <div class="support">
                    <span><i class='bx bxs-phone'></i></span> &nbsp;
                    <a href="tel:1900 1881">1900 1881</a>
                </div>
                <h4>HỖ TRỢ KHÁCH HÀNG</h4>
                <div class="support">
                    <span><i class='bx bx-support'></i></span>&nbsp;
                    <a href="mailto: trogiup.batdongsan.com.vn">trogiup.batdongsan.com.vn</a>
                </div>
                <h4>CHĂM SÓC KHÁCH HÀNG</h4>
                <div class="support">
                    <span><i class='bx bx-envelope'></i></span>&nbsp;
                    <a href="mailto: hotro@batdongsan.com.vn"> hotro@batdongsan.com.vn</a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>

</script>

<style scoped>
.footer {
    background-color: #f9f9f9;
    padding: 20px 0;
}

.footer-container {
    display: flex;
    justify-content: space-between;
    max-width: 1300px;
    margin: 0 auto;
    padding: 0 20px;
}

.footer-section {
    flex: 1;
    padding: 10px;
}

.footer-logo {
    width: 150px;
}

.footer-section h4 {
    font-weight: bold;
    margin-bottom: 10px;
}

.footer-section ul {
    list-style-type: none;
    padding: 0;
}

.footer-section ul li {
    margin-bottom: 5px;
}

.footer-section ul li a {
    color: #333;
    text-decoration: none;
}

.footer-section ul li a:hover {
    text-decoration: underline;
}

.subscribe {
    display: flex;
}

.support {
    display: flex;
    align-items: center;
    font-size: 16px;
}
.support a {
    color: inherit;
}

.support a:hover {
    color: inherit;
}
.support span {
    font-size: 20px;
}

@media (max-width: 1024px) {
    .footer-container {
        flex-direction: column;
        align-items: flex-start;
    }
    .footer-section {
        width: 100%;
        margin-bottom: 20px;
    }
    .footer-logo {
        margin-bottom: 10px;
    }
}

@media (max-width: 768px) {
    .footer-section {
        text-align: center;
    }
    .support {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .footer {
        padding: 10px 0;
    }

    .footer-section {
        padding: 5px;
    }
    .footer-logo {
        width: 120px;
    }
}
</style>