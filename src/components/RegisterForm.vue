<script setup>

</script>
<template>
    <form class="form">
        <input type="text" placeholder="Tên đăng nhập" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Mật khẩu" required />
        <button type="submit">Đăng ký</button>
    </form>
</template>
<style scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    padding: 10px;
    font-size: 16px;
    background: rgb(229,57,53);
    background: linear-gradient(90deg, rgba(229,57,53,1) 0%, rgba(229,57,53,1) 35%, rgba(44,44,44,1) 100%);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    opacity: 0.8;
}
</style>