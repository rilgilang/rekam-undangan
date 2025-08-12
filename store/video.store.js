// stores/video.js
import { defineStore } from 'pinia'

export const useVideoStore = defineStore('video', {
  state: () => ({
    videos: []
  }),

  actions: {
    setVideos(videos) {
      this.videos = videos
    },

    addVideo(video) {
      this.videos.unshift(video)
    }
  }
})
