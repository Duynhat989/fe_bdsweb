<script setup>
defineProps({
    icon: String,
    text: String
});

</script>
<template>
    <div class="item">
        <span class="icon">{{ icon }}</span>
        <span class="text">{{ text }}</span>
    </div>
</template>

<style scoped>
.item {
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    color: #2C2C2C;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border-radius: 10px;
    font-size: 18px;
    cursor: pointer;
    width: 45%;
    height: 150px;
    flex-direction: column;
    transition: all 0.5s;
}

.item:hover {
    color: white;
    transition: all 0.5s;
    background: rgb(204, 204, 204);
    background: linear-gradient(0deg, rgba(229, 57, 53, 1) 0%, rgba(204, 204, 204, 1) 100%);
}

.icon {
    margin-right: 10px;
    font-size: 24px;
}
</style>