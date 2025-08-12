// import { useUserStore } from "@/stores/userStore"
// import { $fetch } from "ofetch"

// export const useVideoProcessing = () => {
//   const userStore = useUserStore()

//   const processVideo = async (url: string) => {
//     const token = userStore.useToken()
//     if (!token) {
//       throw new Error("No tokens available")
//     }

//     const videoId = Date.now()

//     // Add to processing queue
//     userStore.addProcessingVideo({
//       url,
//       title: `Video from ${new URL(url).hostname}`,
//     })

//     try {
//       // Call your backend API
//       const response = await $fetch("/api/process-video", {
//         method: "POST",
//         body: { url, videoId },
//       })

//       // Start polling for status
//       pollVideoStatus(videoId)

//       return response
//     } catch (error) {
//       userStore.updateVideoStatus(videoId, "failed")
//       throw error
//     }
//   }

//   const pollVideoStatus = (videoId: number) => {
//     const interval = setInterval(async () => {
//       try {
//         const status = await $fetch(`/api/video-status/${videoId}`)

//         if (status.status === "completed") {
//           userStore.updateVideoStatus(videoId, "completed", status.result)
//           clearInterval(interval)
//         } else if (status.status === "failed") {
//           userStore.updateVideoStatus(videoId, "failed")
//           clearInterval(interval)
//         }
//       } catch (error) {
//         console.error("Error polling video status:", error)
//         clearInterval(interval)
//       }
//     }, 3000) // Poll every 3 seconds
//   }

//   return {
//     processVideo,
//   }
// }
