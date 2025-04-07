<template>
  <div
    class="min-h-screen w-full flex flex-col items-center justify-center gap-6 p-6"
    data-theme="dim"
  >
    <div class="max-w-4xl w-full mx-auto">
      <!-- Room Card -->
      <div class="card bg-base-100 shadow-xl flex flex-col md:flex-row w-full">
        <figure class="md:w-1/3 w-full h-64 md:h-auto">
          <img
            :src="room.image"
            alt="Room Image"
            class="w-full h-full object-cover"
          />
        </figure>
        <div class="card-body w-full md:w-2/3">
          <div class="flex justify-between items-start flex-wrap gap-2">
            <h2 class="card-title text-2xl">Room #{{ room.room_number }}</h2>
            <span :class="statusColor(room.available)" class="badge text-white">
              {{ room.available == false ? "Booked" : "Available" }}
            </span>
          </div>
          <p><strong>Renter:</strong> {{ room.renter || "Not assigned" }}</p>
          <p><strong>Price:</strong> Rp {{ room.price.toLocaleString() }}</p>
          <p><strong>Available:</strong> {{ room.available }}</p>
          <p><strong>Check-In:</strong> {{ formatDate(room.check_in) }}</p>
          <p><strong>Check-Out:</strong> {{ formatDate(room.check_out) }}</p>

          <div
            v-if="room.already_paid_this_month"
            class="alert alert-success mt-2"
          >
            ✅ Already paid for this month
          </div>
          <div v-else class="alert alert-warning mt-2">
            ⚠️ Not paid for this month
          </div>
        </div>
      </div>

      <!-- Add Payment Button -->
      <!-- <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 mb-2 gap-2"
      >
        <h3 class="text-xl font-semibold">Payment History</h3>
        <button class="btn btn-primary" @click="openModal">
          + Add Payment
        </button>
      </div> -->

      <!-- Payment History -->
      <div class="join join-vertical w-full">
        <div
          v-for="(payment, index) in room.payment_history"
          :key="index"
          class="collapse collapse-arrow join-item border border-base-300 bg-base-100"
        >
          <input type="checkbox" />
          <div class="collapse-title text-md font-medium">
            {{ formatDate(payment.created_at) }} - Rp
            {{ payment.total.toLocaleString() }}
          </div>
          <div class="collapse-content">
            <p>
              <strong>Receipt:</strong>
              <a
                :href="payment.payment_receipt"
                target="_blank"
                class="link link-primary"
              >
                View Receipt
              </a>
            </p>
            <p>
              <strong>Updated At:</strong>
              {{ formatDate(payment.updated_at) }}
            </p>
            <p>
              <strong>Deleted At:</strong>
              {{ formatDate(payment.deleted_at) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL TOGGLE (optional if using v-model) -->
    <input type="checkbox" class="modal-toggle" v-model="showModal" />

    <!-- MODAL -->
    <div class="modal" v-if="showModal">
      <div
        class="modal-box w-full max-w-md md:max-w-lg rounded-xl shadow-lg border border-base-300 bg-base-100"
      >
        <h3 class="font-bold text-2xl text-center mb-6">💳 Add New Payment</h3>

        <form @submit.prevent="addPayment" class="space-y-4">
          <!-- Total Field -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Total (Rp)</span>
            </label>
            <label
              class="input input-bordered flex items-center gap-2 text-base"
            >
              <span>Rp</span>
              <input
                type="number"
                class="grow"
                v-model.number="newPayment.total"
                placeholder="1,000,000"
                required
              />
            </label>
          </div>

          <!-- Receipt Field -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Payment Receipt URL</span>
            </label>
            <label
              class="input input-bordered flex items-center gap-2 text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 opacity-70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <input
                type="url"
                v-model="newPayment.payment_receipt"
                placeholder="https://..."
                class="grow"
                required
              />
            </label>
          </div>

          <!-- Actions -->
          <div
            class="modal-action flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2"
          >
            <button type="submit" class="btn btn-primary w-full sm:w-auto">
              💾 Save Payment
            </button>
            <button
              type="button"
              class="btn btn-ghost w-full sm:w-auto"
              @click="closeModal"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoomStore } from "~/store/room.store";
const route = useRoute();

const store = useRoomStore();
const room = ref({
  payment_history: [
    {
      id: "",
      total: 0,
      payment_receipt: "https://drive.google.com",
      room_id: "",
      created_at: "2025-01-02 00:00:00.000",
      updated_at: "2025-01-02 00:00:00.000",
      deleted_at: "2025-01-02 00:00:00.000",
    },
  ],
  id: "",
  room_number: 0,
  renter: "John Doe",
  already_paid_this_month: false,
  available: 0,
  first_check_in: "2025-01-02 00:00:00.0000",
  check_in: "2025-01-02 00:00:00.000",
  check_out: "2025-01-02 00:00:00.000",
  image:
    "https://images.unsplash.com/photo-1586121778101-a64f3aa8df4c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
  price: 0,
  status: "Booked",
});

onMounted(async () => {
  const roomDetail = await store.getRoomDetail(route.params.id);
  room.value = roomDetail.data;
});

const showModal = ref(false);

const newPayment = ref({
  total: 0,
  payment_receipt: "",
});

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  newPayment.value = {
    total: 0,
    payment_receipt: "",
  };
};

const addPayment = () => {
  const now = new Date().toISOString();
  room.value.payment_history.push({
    id: crypto.randomUUID(),
    total: newPayment.value.total,
    payment_receipt: newPayment.value.payment_receipt,
    room_id: room.value.id,
    created_at: now,
    updated_at: now,
    deleted_at: null,
  });
  closeModal();
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const statusColor = (available) => {
  const status = available == false ? "Booked" : "Available";

  switch (status) {
    case "Booked":
      return "badge-warning";
    case "Available":
      return "badge-success";
    case "Maintenance":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};
</script>
