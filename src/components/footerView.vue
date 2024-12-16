<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-section">
                <img src="https://hocvienamg.edu.vn/wp-content/uploads/2023/03/Logo-CED-01.png"
                    alt="Batdongsan Logo" class="footer-logo" />
                <h4>CÔNG TY CỔ PHẦN HỌC VIỆN ĐÀO TẠO AMG </h4>
                <p><i class='bx bx-map' ></i> Lô TT04-23 HD Mon, Hàm Nghi, Mỹ Đình 2, Nam Từ Liêm, Hà Nội</p>
                <p>📞 035.863.5665 - 088.699.6565</p>
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
                <h4>WEBSITE</h4>
                <div class="support">
                    <span><i class='bx bxs-phone'></i></span> &nbsp;
                    <a  href="https://hocvienamg.edu.vn/">Hocvienamg.edu.vn</a>
                </div>
                <h4>FACEBOOK</h4>
                <div class="support">
                    <span><i class='bx bxl-facebook'></i></span>&nbsp;
                    <a href="https://www.facebook.com/duongdinhchaubds?mibextid=LQQJ4d">Fanpage</a>
                </div>
            </div>
        </div>
        <div class="footer-copyright">Coppyright 2024 © <strong>AMG</strong>      </div>
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
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    gap: 30px;
}
.footer-copyright {
    text-align: center;
}
.footer-section {
    flex: 1;
    padding: 10px;
}

.footer-logo {
    max-width: 150px;
    width: 100%;
    object-fit: cover;
    margin-bottom: 20px;
}
.footer-section p {
    line-height: 24px;
    margin-bottom: 10px;
}
.footer-section h4 {
    font-weight: bold;
    margin-bottom: 20px;
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
        gap: 0px;
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