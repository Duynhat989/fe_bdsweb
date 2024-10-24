<script setup>

const props = defineProps({
  text: String,
  imageUrl: String
});

</script>
<template>
  <div class="item-box">
      <div class="item-content">
        <img v-if="imageUrl" :src="imageUrl" :alt="text" class="item-image" />
        <p class="text">{{ text }}</p>
      </div>
  </div>
</template>
<style scoped>
.item-box {
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  padding: 20px;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  width: calc((100% - 20px)/2);
  height: 200px;
  transition: all 0.5s;
}

.item-box {
  color: #2C2C2C;
}

.item-box:hover {
  transition: all 0.5s;
  background: rgb(204, 204, 204);
  background: linear-gradient(0deg, rgba(204, 204, 204, 1) 0%, rgba(229, 57, 53, 1) 50%);
}

.item-box:hover {
  color: white;
}


.item-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
}
.item-content .text {
  text-align: center;
}
.item-image {
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  width: 100px;
  height: auto;
  border-radius: 10px;
}
</style>