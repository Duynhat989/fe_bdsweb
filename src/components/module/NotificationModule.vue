<script setup>
import { ref } from 'vue'

const notifications = ref([])
let notificationId = 0

const getIcon = (type) => {
    const icons = {
        success: 'bx bxs-check-circle',
        error: 'bx bxs-x-circle',
        warning: 'bx bxs-error',
        info: 'bx bxs-info-circle'
    }
    return icons[type] || icons.info
}

const addNotification = (notification) => {
    const id = notificationId++
    const newNotification = {
        id,
        duration: 2000, 
        showActions: false,
        ...notification,  
    }
    if (newNotification.showActions) {
        newNotification.duration = 0
    }
    notifications.value.push(newNotification)
    if (newNotification.duration > 0) {
        setTimeout(() => {
            closeNotification(id)
        }, newNotification.duration)
    }
}

const closeNotification = (id) => {
    const index = notifications.value.findIndex(notification => notification.id === id)
    if (index !== -1) {
        notifications.value.splice(index, 1)
    }
}

const handleAction = (id, action) => {
    const notification = notifications.value.find(n => n.id === id);
    if (notification && typeof notification.onAction === 'function') {
        notification.onAction({ action }); 
    }
    closeNotification(id)
}

defineExpose({
    addNotification,
    closeNotification
});
</script>
<template>
    <div class="notification-overlay" v-if="notifications.length">
        <TransitionGroup name="notification" tag="div" class="notification-container">
            <div v-for="notification in notifications" :key="notification.id" :class="[
                'notification',
                `notification--${notification.type}`,
                notification.className
            ]">
                <div class="notification__content">
                    <div class="notification__icon">
                        <i :class="getIcon(notification.type)"></i>
                    </div>
                    <div class="notification__text">
                        <div class="notification__title">{{ notification.title }}</div>
                        <div class="notification__message">{{ notification.message }}</div>
                    </div>
                    <button class="notification__close" @click="closeNotification(notification.id)">
                        <i class='bx bx-x'></i>
                    </button>
                </div>

                <div class="notification__actions" v-if="notification.showActions">
                    <button v-if="notification.type === 'success'" class="btn btn--success"
                        @click="handleAction(notification.id, 'success')">
                        <i class='bx bx-check'></i>
                        Xác nhận
                    </button>

                    <button v-if="notification.type === 'error'" class="btn btn--error"
                        @click="handleAction(notification.id, 'retry')">
                        <i class='bx bx-refresh'></i>
                        Thử lại
                    </button>

                    <button v-if="notification.type === 'warning'" class="btn btn--warning"
                        @click="handleAction(notification.id, 'acknowledge')">
                        <i class='bx bx-error'></i>
                        Đã hiểu
                    </button>

                    <button v-if="notification.type === 'info'" class="btn btn--info"
                        @click="handleAction(notification.id, 'info')">
                        <i class='bx bx-info-circle'></i>
                        Chi tiết
                    </button>

                    <button class="btn btn--neutral" @click="closeNotification(notification.id)">
                        <i class='bx bx-x'></i>
                        Đóng
                    </button>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>


<style scoped>
.notification-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.notification-container {
    max-width: 500px;
    width: 90%;
    margin: auto;
}

.notification {
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin: 10px 0;
    transform-origin: center;
}

.notification__content {
    display: flex;
    align-items: flex-start;
    padding: 20px;
    gap: 15px;
}

.notification__icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.notification__icon i {
    font-size: 24px;
}

.notification__text {
    flex-grow: 1;
}

.notification__title {
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 4px;
}

.notification__message {
    font-size: 0.95rem;
    color: #666;
    line-height: 1.4;
}

.notification__close {
    flex-shrink: 0;
    border: none;
    background: none;
    cursor: pointer;
    opacity: 0.5;
    padding: 0;
    font-size: 20px;
    transition: opacity 0.2s;
}

.notification__close:hover {
    opacity: 1;
}

.notification__actions {
    display: flex;
    gap: 10px;
    padding: 15px 20px;
    background: #f8f9fa;
    border-top: 1px solid #eee;
    justify-content: flex-end;
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn i {
    font-size: 18px;
}

.btn--success {
    background: #10B981;
    color: white;
}

.btn--success:hover {
    background: #059669;
}

.btn--error {
    background: #EF4444;
    color: white;
}

.btn--error:hover {
    background: #DC2626;
}

.btn--warning {
    background: #F59E0B;
    color: white;
}

.btn--warning:hover {
    background: #D97706;
}

.btn--info {
    background: #3B82F6;
    color: white;
}

.btn--info:hover {
    background: #2563EB;
}

.btn--neutral {
    background: #6B7280;
    color: white;
}

.btn--neutral:hover {
    background: #4B5563;
}

.notification--success .notification__icon {
    background: rgba(16, 185, 129, 0.1);
    color: #10B981;
}

.notification--error .notification__icon {
    background: rgba(239, 68, 68, 0.1);
    color: #EF4444;
}

.notification--warning .notification__icon {
    background: rgba(245, 158, 11, 0.1);
    color: #F59E0B;
}

.notification--info .notification__icon {
    background: rgba(59, 130, 246, 0.1);
    color: #3B82F6;
}

/* Animation */
.notification-enter-active,
.notification-leave-active {
    transition: all 0.3s ease;
}

.notification-enter-from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
}

.notification-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
}
</style>