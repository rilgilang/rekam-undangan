<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'

const config = useRuntimeConfig();

// Removed useHead import - it's available globally in Nuxt 3
const invitationUrl = ref('')
const isProcessing = ref(false)
const videos = ref([]) // Changed from single video to array of videos
const socket = ref(null)
// const serverStatus = ref(null)

const generateId = () => Date.now().toString()

const getStatusClass = (status) => {
  if (status.includes('Error') || status.includes('Failed')) {
    return 'bg-red-50 border border-red-200 text-red-800'
  }
  if (status.includes('Complete') || status.includes('Ready')) {
    return 'bg-green-50 border border-green-200 text-green-800'
  }
  return 'bg-blue-50 border border-blue-200 text-blue-800'
}

const submitUrl = async () => {
  if (!invitationUrl.value) return

  const videoId = generateId()

  // Create immediate card with processing status
  const newVideo = {
    id: videoId,
    url: invitationUrl.value,
    status: 'Starting video conversion...',
    isProcessing: true,
    videoUrl: null,
    created_at: new Date().toISOString()
  }

  videos.value.unshift(newVideo)
  invitationUrl.value = ''

  try {
    const response = await fetch(`${config.public.apiBase}:8081/api/process-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        unique_id: videoId,
        url: newVideo.url
      })
    }).then(res => res.json())

    if (response.data == "ok") {
      const video = videos.value.find(v => v.id === videoId)
      if (video) {
        video.status = 'Processing video... This action will take 5-7 minute.'
      }
    } else {
      throw new Error(response.message || 'Conversion failed')
    }
  } catch (error) {
    console.error('Error:', error)
    const video = videos.value.find(v => v.id === videoId)
    if (video) {
      video.status = `Error: ${error.message}`
      video.isProcessing = false
    }
  }
}

const shareVideo = async (videoUrl) => {
  if (navigator.share && videoUrl) {
    try {
      await navigator.share({
        title: 'My E-Invitation Video',
        text: 'Check out my converted e-invitation video!',
        url: videoUrl
      })
    } catch (error) {
      console.log('Error sharing:', error)
      navigator.clipboard.writeText(videoUrl)
    }
  } else {
    navigator.clipboard.writeText(videoUrl)
  }
}

const fetchAllVideos = async () => {
  try {
    const response = await fetch(`${config.public.apiBase}:8081/api/video`).then(res => res.json())

    if (response.status) {
      videos.value = response.data
      console.log("response.data --> ", response.data)
    }
  } catch (error) {
    console.error('Failed to fetch videos:', error)
  }
}

// const fetchServerStatus = async () => {
//   try {
//     const response = await fetch('/api/server-status').then(res => res.json())
//     serverStatus.value = response
//   } catch (error) {
//     console.error('Failed to fetch server status:', error)
//     serverStatus.value = { online: false, activeJobs: 0 }
//   }
// }

const setupSocket = () => {
  socket.value = io(`${config.public.apiBase}:8082`)

  socket.value.on('video-complete', (data) => {
    console.log('Video processing complete:', data)
    const video = videos.value.find(v => v.id === data.id)
    if (video) {
      video.isProcessing = false
      video.status = 'Video conversion complete!'
      video.videoUrl = data.videoUrl
    }
  })

  socket.value.on('video-progress', (data) => {
    console.log('Video progress:', data)
    const video = videos.value.find(v => v.id === data.id)
    if (video) {
      video.status = data.message || 'Processing video...'
    }
  })

  socket.value.on('video-error', (data) => {
    console.error('Video processing error:', data)
    const video = videos.value.find(v => v.id === data.id)
    if (video) {
      video.isProcessing = false
      video.status = `Error: ${data.message || 'Processing failed'}`
    }
  })

  socket.value.on('connect', () => {
    console.log('Connected to server')
  })

  socket.value.on('disconnect', () => {
    console.log('Disconnected from server')
  })
}

const cleanupSocket = () => {
  if (socket.value) {
    socket.value.disconnect()
  }
}

onMounted(async () => {
  // await fetchServerStatus()
  await fetchAllVideos()
  setupSocket()
})

onUnmounted(() => {
  cleanupSocket()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-900 text-center mb-8">
          E-Invitation to Video
        </h1>

        <form @submit.prevent="submitUrl" class="space-y-4">
          <div>
            <label for="url" class="block text-sm font-medium text-gray-700 mb-2">
              E-Invitation URL
            </label>
            <input id="url" v-model="invitationUrl" type="url" required placeholder="https://example.com/invitation/123"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <button type="submit" :disabled="!invitationUrl"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Convert to Video
          </button>
        </form>

        <!-- <div v-if="serverStatus" class="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Server Status</h4>
          <div class="flex items-center text-sm">
            <div class="w-2 h-2 rounded-full mr-2" :class="serverStatus.online ? 'bg-green-500' : 'bg-red-500'"></div>
            <span :class="serverStatus.online ? 'text-green-600' : 'text-red-600'">
              {{ serverStatus.online ? 'Online' : 'Offline' }}
            </span>
            <span class="text-gray-500 ml-2">
              ({{ serverStatus.activeJobs || 0 }} active jobs)
            </span>
          </div>
        </div> -->
      </div>

      <div v-if="videos.length > 0" class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Your Videos</h2>

        <div v-for="video in videos" :key="video.id"
          class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div class="p-4 bg-gray-50 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ video.original_url }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ new Date(video.created_at).toLocaleString() }}
                </p>
              </div>
            </div>
          </div>

          <div class="p-4" :class="getStatusClass(video.status)">
            <div class="flex items-center justify-between">
              <div v-if="video.isProcessing" class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2">
              </div>
              <span class="text-sm font-medium">{{ video.status }}</span>
              <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
                    stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke="#1C274C" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round"></path>
                </g>
              </svg>
            </div>
          </div>

          <div v-if="video.videoUrl" class="p-4">
            <video :src="video.videoUrl" controls class="w-full rounded-md shadow-sm mb-4">
              Your browser does not support the video tag.
            </video>
            <div class="flex space-x-3">
              <a :href="video.videoUrl" download
                class="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-center font-medium">
                Download Video
              </a>
              <button @click="shareVideo(video.videoUrl)"
                class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No videos yet</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by converting your first e-invitation!</p>
      </div>
    </div>
  </div>
</template>
