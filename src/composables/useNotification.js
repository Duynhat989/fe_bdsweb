import { ref } from 'vue'

const notificationComponent = ref(null)

export const useNotification = () => {
    const setNotificationComponent = (component) => {
        notificationComponent.value = component
    }

    const notify = (options) => {
        if (notificationComponent.value) {
            notificationComponent.value.addNotification({
                type: 'info',
                duration: 2000,
                ...options
            })
        }
    }

    const success = (title, message, options = {}) => {
        notify({ title, message, type: 'success', ...options })
    }

    const error = (title, message, options = {}) => {
        notify({ title, message, type: 'error', ...options })
    }

    const warning = (title, message, options = {}) => {
        notify({ title, message, type: 'warning', ...options })
    }

    const info = (title, message, options = {}) => {
        notify({ title, message, type: 'info', ...options })
    }

    return {
        setNotificationComponent,
        notify,
        success,
        error,
        warning,
        info
    }
}

export default useNotification