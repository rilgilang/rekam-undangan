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
    selectedRoom: {
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
  }),
  actions: {
    async getRooms() {
      const config = useRuntimeConfig();

      const { data, error } = await useFetch(
        `${config.public.apiBase}/api/room`,
        {
          method: "GET",
        }
      );

      if (data.value) {
        this.rooms = data.value.data;
      }

      return this.rooms;
    },
    async setSelectedRoom(index) {
      this.selectedRoom = this.rooms[index];

      console.log("selected room --> ", this.selectedRoom);

      const config = useRuntimeConfig();

      const { data, error } = await useFetch(
        `${config.public.apiBase}/api/payments/${this.selectedRoom.id}`,
        {
          method: "GET",
        }
      );

      if (data.value) {
        this.selectedRoom.payment_history = data.value;
      }

      my_modal_2.showModal();
      return;
    },
    getSelectedRoom() {
      return this.selectedRoom;
    },
  },
});
