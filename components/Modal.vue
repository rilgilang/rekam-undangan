<template>
  <dialog id="my_modal_2" class="modal">
    <div class="modal-box max-w-2xl">
      <h3 class="text-2xl font-bold mb-4">Room & Payment Details</h3>

      <!-- ROOM DETAILS -->
      <div class="space-y-2 mb-6">
        <h4 class="text-lg font-semibold">🏠 Room Information</h4>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span class="font-medium">Room Number:</span>
            {{ room.room_number }}
          </div>
          <div><span class="font-medium">Renter:</span> {{ room.renter }}</div>
          <div><span class="font-medium">Price:</span> {{ room.price }}</div>
          <div>
            <span class="font-medium">Already Paid:</span>
            {{ room.already_paid_this_month ? "Yes" : "No" }}
          </div>
          <div>
            <span class="font-medium">Available:</span>
            {{ room.available ? "Yes" : "No" }}
          </div>
          <div>
            <span class="font-medium">Last Check-in:</span>
            {{ formatDate(room.check_in) }}
          </div>
          <div>
            <span class="font-medium">First Check-in:</span>
            {{ formatDate(room.first_check_in) }}
          </div>
          <div>
            <span class="font-medium">Check-out:</span>
            {{ formatDate(room.check_out) }}
          </div>
        </div>
      </div>

      <!-- PAYMENT HISTORY -->
      <div class="space-y-2">
        <h4 class="text-lg font-semibold">💳 Payment History</h4>
        {{}}
        <div class="overflow-auto max-h-40">
          <table class="table w-full table-sm">
            <thead>
              <tr class="bg-base-200 text-sm text-left">
                <th>Date</th>
                <th>Total</th>
                <th>Receipt</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="payment in room.payment_history"
                :key="payment.id"
                class="text-sm"
              >
                <td>{{ formatDate(payment.created_at) }}</td>
                <td>Rp {{ payment.total }}</td>
                <td>{{ payment.payment_receipt }}</td>
                <td>{{ payment.payment_receipt_source }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal footer -->
      <form method="dialog" class="modal-backdrop mt-6">
        <button class="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-l">
          Close
        </button>
      </form>
    </div>
  </dialog>
</template>

<script setup>
import { useRoomStore } from "~/store/room.store";
const store = useRoomStore();
const room = computed(() => store.selectedRoom);

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
</script>
