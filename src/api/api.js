export const END_POINT = {
    // Auth APIs
    LOGIN: '/api/auth/login', // Đăng nhập
    REGISTER: '/api/auth/register', // Đăng ký
    FORGOT_PASSWORD: '/api/auth/forgot_password', // Quên mật khẩu

    // Assistants APIs
    ASSISTANTS_LIST: '/api/assistants', // Danh sách trợ lý
    ASSISTANT_FIND: '/api/assistant/find', // Tìm trợ lý
    ASSISTANT_CREATE: '/api/assistant/create', // Thêm trợ lý
    ASSISTANT_UPDATE: '/api/assistant/update', // Cập nhật trợ lý
    ASSISTANT_DELETE: '/api/assistant/delete', // Xóa trợ lý

    // Conversation APIs
    CONVERSATION_THREAD: '/api/conversation/thread', // Tạo phiên tin nhắn mới
    CONVERSATION_STREAM: '/api/conversation/stream', // Gửi luồng tin nhắn
    CONVERSATION_LIST: '/api/conversation', // Danh sách tin nhắn
    // Courses APIs
    COURSES_LIST: '/api/courses', // Danh sách khóa học
    COURSE_FIND: '/api/course/find', // Tìm khóa học
    COURSE_CREATE: '/api/course/create', // Tạo mới khóa học
    COURSE_UPDATE: '/api/course/update', // Cập nhật khóa học
    COURSE_DELETE: '/api/course/delete', // Xóa khóa học
    COURSE_ME: '/api/course/me', // Khóa học cá nhân

    // Lessons APIs
    LESSONS_LIST: '/api/lessons', // Danh sách bài giảng
    LESSON_FIND: '/api/lesson/find', // Tìm bài giảng
    LESSON_CREATE: '/api/lesson/create', // Tạo bài giảng
    LESSON_UPDATE: '/api/lesson/update', // Cập nhật bài giảng
    LESSON_DELETE: '/api/lesson/delete', // Xóa bài giảng

    // Users APIs
    USERS_LIST: '/api/users', // Danh sách người dùng
    USER_FIND: '/api/user/find', // Tìm người dùng
    USER_UPDATE: '/api/user/update', // Cập nhật người dùng
    USER_DELETE: '/api/user/delete', // Xóa người dùng

    // Files APIs
    FILE_UPLOAD: '/api/file/upload', // Upload file
    FILE_DELETE: '/api/file/file-ZSNH47eGFS5wvCrvh12NtxzS', // Xóa file

    // Setup APIs
    SETUP: '/api/setup', // Tải cài đặt
};
