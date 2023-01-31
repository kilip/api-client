<template>
  <div>
    <button @click="findBooks()">
      Find Books
    </button>
    <template
      v-for="item in items"
      :key="item.id"
    >
      <div>
        <h1>{{ item.title }}</h1>
        <p>{{ item.description }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useBookResource } from './composable/books';

const {find, useListStore } = useBookResource
const store = useListStore()
const items = computed(() => store.items)
const page = ref(1)

const findBooks = async() => {
  await find({ itemsPerPage: 5, page: page.value })
  page.value++
}
</script>
