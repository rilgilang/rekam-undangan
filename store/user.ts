import { defineStore, ref } from "pinia"

export const useUserStore = defineStore("user", () => {
  const tokens = ref(5)
  const processedVideos = ref([])
  const processingVideos = ref([])

  const addProcessingVideo = (video) => {
    processingVideos.value.push({
      id: Date.now(),
      url: video.url,
      status: "processing",
      createdAt: new Date(),
      ...video,
    })
  }

  const updateVideoStatus = (id, status, result = null) => {
    const index = processingVideos.value.findIndex((v) => v.id === id)
    if (index !== -1) {
      if (status === "completed") {
        const video = processingVideos.value[index]
        processedVideos.value.unshift({
          ...video,
          status,
          result,
          completedAt: new Date(),
        })
        processingVideos.value.splice(index, 1)
      } else {
        processingVideos.value[index].status = status
      }
    }
  }

  const useToken = () => {
    if (tokens.value > 0) {
      tokens.value--
      return true
    }
    return false
  }

  return {
    tokens,
    processedVideos,
    processingVideos,
    addProcessingVideo,
    updateVideoStatus,
    useToken,
  }
})
