import { defineStore } from "pinia";

export const useRoomStore = defineStore("rooms", {
  state: () => ({
    rooms: [
      {
        payment_history: [],
        id: "",
        room_number: 0,
        renter: "",
        already_paid_this_month: false,
        available: 0,
        first_check_in: "2025-01-02 00:00:00.0000",
        check_in: "2025-01-02 00:00:00.000",
        check_out: "2025-01-02 00:00:00.000",
        image:
          "https://images.unsplash.com/photo-1586121778101-a64f3aa8df4c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
        price: 1000000,
        status: "Booked",
      },
      {
        payment_history: [],
        id: "",
        room_number: 0,
        renter: "",
        already_paid_this_month: false,
        available: 0,
        first_check_in: "2025-01-02 00:00:00.0000",
        check_in: "2025-01-02 00:00:00.000",
        check_out: "2025-01-02 00:00:00.000",
        image:
          "https://images.unsplash.com/photo-1586121778101-a64f3aa8df4c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
        price: 1000000,
        status: "Booked",
      },
      {
        payment_history: [],
        id: "",
        room_number: 0,
        renter: "",
        already_paid_this_month: false,
        available: 0,
        first_check_in: "2025-01-02 00:00:00.0000",
        check_in: "2025-01-02 00:00:00.000",
        check_out: "2025-01-02 00:00:00.000",
        image:
          "https://images.unsplash.com/photo-1586121778101-a64f3aa8df4c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
        price: 1000000,
        status: "Booked",
      },
    ],

    selectedRoomId: "",
    roomModal: false,
  }),
  actions: {
    async getRooms() {
      const config = useRuntimeConfig();
      try {
        const response = await $fetch(`${config.public.apiBase}/api/room`);
        this.rooms = response.data;
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    },
    async getRoomDetail(id) {
      const config = useRuntimeConfig();

      try {
        const response = await $fetch(
          `${config.public.apiBase}/api/room/${id}`
        );
        return response;
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }

      return null;
    },
  },
});
