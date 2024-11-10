<script setup>
import { computed  } from 'vue';

const props = defineProps(['total','itemsPerPage','currentPage']);

const emit = defineEmits(['changePage']);

const totalPages = computed(() => Math.ceil(props.total / props.itemsPerPage));

const visiblePages = computed(() => {
  if (totalPages.value <= 10) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }

  if (props.currentPage <= 3) {
    return [1, 2, 3, 4, 5, '...', totalPages.value];
  }

  if (props.currentPage >= totalPages.value - 2) {
    return [
      1,
      '...',
      totalPages.value - 4,
      totalPages.value - 3,
      totalPages.value - 2,
      totalPages.value - 1,
      totalPages.value
    ];
  }

  return [
    1,
    '...',
    Number(props.currentPage) - 1,
    Number(props.currentPage),
    Number(props.currentPage) + 1,
    '...',
    totalPages.value
  ];
});

const handleChangePage = (page) => {
  if (typeof page === 'number' && page >= 1 && page <= totalPages.value) {
    emit('changePage', page);
  }
};

const goToPrev = () => {
  if (props.currentPage > 1) {
    emit('changePage', props.currentPage - 1);
  }
};

const goToNext = () => {
  if (props.currentPage < totalPages.value) {
    emit('changePage', props.currentPage + 1);
  }
};
</script>

<template>
  <div class="pagination" v-if="total > 0">
    <button 
      class="pagination-btn" 
      :disabled="currentPage === 1"
      @click="goToPrev"
    >
      <
    </button>
    <span
      v-for="(page, index) in visiblePages"
      :key="index"
      @click="typeof page === 'number' ? handleChangePage(page) : null"
      :class="{
        'page-number': true,
        'active': currentPage == page,
        'ellipsis': page === '...'
      }"
    >
      {{ page }}
    </span>

    <button 
      class="pagination-btn" 
      :disabled="currentPage === totalPages"
      @click="goToNext"
    >
      >
    </button>
  </div>
</template>

<style scoped>
.pagination {
    width: 100%;
    text-align: center;
    margin-top: 20px;
}

.pagination-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.pagination-btn ,
.pagination span {
  padding: 10px 15px;
  background-color: #ccc;
  color: #111;
  margin: 0px 5px;
  cursor: pointer;
}

.pagination span.active,
.pagination span:hover {
  background-color: var(--color-primary);
  color: #fff;
}

.ellipsis {
  cursor: default;
  border: none;
}
</style>