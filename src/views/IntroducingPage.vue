<script setup>
import { ref } from 'vue'


const services = [
    {
        id: 1,
        title: 'Phân phối dự án',
        description: 'Cung cấp các dự án bất động sản uy tín, chất lượng',
        icon: 'https://phathung.vn/wp-content/uploads/2024/10/dong-tien-bat-dong-san-do-manh-ve-chung-cu-tai-tp-hcm-cuoi-nam-2024-1-300x200.jpg'
    },
    {
        id: 2,
        title: 'Quản lý tài sản',
        description: 'Dịch vụ quản lý tài sản chuyên nghiệp, hiệu quả',
        icon: 'https://phathung.vn/wp-content/uploads/2024/10/dong-tien-bat-dong-san-do-manh-ve-chung-cu-tai-tp-hcm-cuoi-nam-2024-1-300x200.jpg'
    },
    {
        id: 3,
        title: 'Tư vấn đầu tư',
        description: 'Tư vấn chiến lược đầu tư phù hợp với từng khách hàng',
        icon: 'https://phathung.vn/wp-content/uploads/2024/10/dong-tien-bat-dong-san-do-manh-ve-chung-cu-tai-tp-hcm-cuoi-nam-2024-1-300x200.jpg'
    }
]

const projects = [
    {
        id: 1,
        name: 'Sunshine City',
        description: 'Tư vấn chiến lược đầu tư phù hợp với từng khách hàng',
        location: 'Quận 7, TP.HCM',
        image: 'https://phathung.vn/wp-content/uploads/2024/10/dong-tien-bat-dong-san-do-manh-ve-chung-cu-tai-tp-hcm-cuoi-nam-2024-1-300x200.jpg'
    },
    {
        id: 2,
        name: 'Green Valley',
        description: 'Tư vấn chiến lược đầu tư phù hợp với từng khách hàng',
        location: 'Quận 9, TP.HCM',
        image: 'https://phathung.vn/wp-content/uploads/2024/10/dong-tien-bat-dong-san-do-manh-ve-chung-cu-tai-tp-hcm-cuoi-nam-2024-1-300x200.jpg'
    },
    {
        id: 3,
        name: 'Lake View',
        description: 'Tư vấn chiến lược đầu tư phù hợp với từng khách hàng',
        location: 'Bình Thạnh, TP.HCM',
        image: 'https://phathung.vn/wp-content/uploads/2024/10/dong-tien-bat-dong-san-do-manh-ve-chung-cu-tai-tp-hcm-cuoi-nam-2024-1-300x200.jpg'
    }
]


const contactInfo = ref({
    address: "48 Lê Thị Chợ, Phú Thuận, Quận 7, TP.HCM",
    phone: "0937 15 69 69",
    email: "info@phathung.vn"
});

const handleSubmit = () => {
    console.log('Form submitted:', formData.value)
};
</script>
<template>
    <div class="landing-page">
        <section class="hero">
            <div class="container">
                <div class="hero-content">
                    <h1>Giải Pháp Bất Động Sản Toàn Diện</h1>
                    <p>Đồng hành cùng bạn trong mọi quyết định đầu tư</p>
                </div>
            </div>
        </section>

        <section class="services">
            <div class="container">
                <h2>Dịch Vụ Của Chúng Tôi</h2>
                <div class="services-grid">
                    <div v-for="service in services" :key="service.id" class="service-card">
                        <img :src="service.icon" :alt="service.title">
                        <h3>{{ service.title }}</h3>
                        <p>{{ service.description }}</p>
                    </div>
                </div>
            </div>
        </section>
        <section class="projects">
            <div class="container">
                <h2>Dự Án Tiêu Biểu</h2>
                <div class="projects-grid">
                    <div v-for="project in projects" :key="project.id" class="project-card">
                        <img :src="project.image" :alt="project.name">
                        <div class="project-info">
                            <h3>{{ project.name }}</h3>
                            <p>{{ project.location }}</p>
                            <p class="description">{{ project.description }}</p>
                            <button class="secondary-btn">Xem chi tiết</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-info">
                        <h3>Liên Hệ Với Chúng Tôi</h3>
                        <p>Địa chỉ: {{ contactInfo.address }}</p>
                        <p>Điện thoại: {{ contactInfo.phone }}</p>
                        <p>Email: {{ contactInfo.email }}</p>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>
<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.hero {
    padding: 80px 0 80px;
    background: linear-gradient(rgba(224, 60, 49, 0.1), rgba(224, 60, 49, 0.05));
    text-align: center;
}

.hero-content h1 {
    font-size: 48px;
    color: var(--color-primary);
    margin-bottom: 20px;
}

.hero-content p {
    font-size: 20px;
    color: #666;
    margin-bottom: 20px;
}

.services {
    padding: 20px 0;
}

.services h2 {
    text-align: center;
    margin-bottom: 20px;
    color: var(--color-primary);
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.service-card {
    padding: 30px;
    text-align: center;
    border-radius: 8px;
    transition: transform 0.3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.service-card .description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
}
.service-card:hover {
    transform: translateY(-5px);
    border: 1px solid var(--color-primary);
}

.service-card img {
    width: 100%;
    height: 200px;
    object-fit: contain;
}

.service-card h3 {
    color: var(--color-primary);
    margin-bottom: 15px;
}

.projects {
    padding: 30px 0;
}

.projects h2 {
    text-align: center;
    margin-bottom: 20px;
    color: var(--color-primary);
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.project-card {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

.project-card:hover {
    transform: translateY(-5px);
    border: 1px solid var(--color-primary);
}

.project-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.project-info {
    padding: 10px;
}

.project-info h3 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
.project-info .description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
.footer {
    background: #ccc;
    color: #242424;
    padding: 20px 0;
}

.footer-content {
    text-align: center;
}

.footer-info h3,
.footer-links h3 {
    color: 242424;
    margin-bottom: 20px;
}

.footer-links ul {
    list-style: none;
}

.footer-links a {
    color: #fff;
    text-decoration: none;
    display: block;
    margin-bottom: 10px;
}

/* Buttons */
.primary-btn {
    background: var(--color-primary);
    color: white;
    padding: 12px 30px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.primary-btn:hover {
    background: var(--color-primary);
}

.secondary-btn {
    background: var(--color-primary);
    color: white;
    padding: 8px 20px;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 10px ;
}

.secondary-btn:hover {
    opacity: .8;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-links {
        display: none;
    }

    .hero-content h1 {
        font-size: 36px;
    }

    .footer-content {
        grid-template-columns: 1fr;
    }
}
</style>
