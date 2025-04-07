<template>
  <div
    class="min-h-screen w-full flex flex-col items-center justify-center gap-6 p-6"
    data-theme="dim"
  >
    <h1 class="text-3xl font-bold text-center">🏠 S1GMA Kost Rooms 🤫🧏🏿</h1>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center"
    >
      <div
        v-if="loading"
        v-for="i in 6"
        :key="i"
        class="card bg-neutral w-3xs max-w-sm shadow-lg hover:shadow-2xl transition-transform hover:scale-105 duration-300 cursor-pointer rounded-2xl overflow-hidden"
      >
        <div class="relative">
          <div class="w-full h-48 object-cover skeleton"></div>
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          ></div>
          <span
            class="absolute bottom-2 left-3 px-3 py-1 rounded-full shadow skeleton h-6 w-24"
          ></span>
        </div>
        <div class="p-4 flex flex-col gap-3">
          <div class="flex justify-between items-center">
            <span
              class="left-3 px-3 py-1 rounded-full shadow skeleton h-6 w-16"
            ></span
            ><span class="skeleton px-2 py-1 rounded-full h-6 w-16"> </span>
          </div>
          <button
            class="skeleton mt-2 w-full bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          ></button>
        </div>
      </div>

      <div
        v-if="!loading"
        v-for="(room, index) in rooms"
        :key="index"
        :class="[
          'card bg-neutral w-full max-w-sm shadow-lg hover:shadow-2xl transition-transform hover:scale-105 duration-300 cursor-pointer rounded-2xl overflow-hidden',
          index === rooms.length - 1 ? 'lg:col-start-3' : '',
        ]"
      >
        <div class="relative">
          <img
            src="https://images.unsplash.com/photo-1586121778101-a64f3aa8df4c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3"
            :alt="room.renter"
            class="w-full h-48 object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          ></div>
          <span
            class="absolute bottom-2 left-3 bg-white text-gray-800 text-sm font-medium px-3 py-1 rounded-full shadow"
          >
            {{ room.renter }}
          </span>
        </div>

        <div class="p-4 flex flex-col gap-3">
          <div class="flex justify-between items-center">
            <span
              :class="
                room.available == false
                  ? 'text-error text-sm italic'
                  : 'text-success text-sm italic'
              "
            >
              {{ room.available == false ? "Booked" : "Available" }}
            </span>
            <span
              class="bg-success text-green-700 text-xs font-semibold px-2 py-1 rounded-full"
            >
              IDR {{ room.price / 1000000 }}jt/mo
            </span>
          </div>

          <NuxtLink
            class="mt-2 w-full bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium py-2 rounded-lg transition-colors text-center"
            :to="{ name: 'room-id', params: { id: room.id } }"
            >View Detail</NuxtLink
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoomStore } from "~/store/room.store";

const store = useRoomStore();
const loading = ref(true);
const rooms = ref([]);

onMounted(async () => {
  await store.getRooms();
  loading.value = false;
  rooms.value = store.rooms;
});
</script>
