<template>
  <div class="group bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg shadow-slate-900/5 border border-white/20 overflow-hidden hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1">
    <!-- Video Thumbnail / Skeleton -->
    <div class="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
      <!-- Processing State -->
      <div v-if="video.status === 'processing'" class="absolute inset-0 flex flex-col items-center justify-center p-6">
        <!-- Animated Background -->
        <div class="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-purple-500/10"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-violet-400/5 to-indigo-400/5 animate-pulse"></div>
        
        <div class="relative text-center space-y-4">
          <!-- Processing Animation -->
          <div class="relative">
            <div class="w-16 h-16 border-4 border-violet-200 rounded-full animate-spin">
              <div class="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-violet-600 rounded-full animate-spin"></div>
            </div>
            <div class="absolute inset-0 flex items-center justify-center">
              <svg class="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <div>
            <p class="font-semibold text-slate-900 mb-1">Creating Magic</p>
            <p class="text-sm text-slate-600">We're working on your video...</p>
          </div>
          
          <!-- Progress Bar -->
          <!-- <div class="w-full max-w-xs">
            <div class="flex justify-between text-xs text-slate-600 mb-2">
              <span>Progress</span>
              <span>{{ Math.round(video.progress) }}%</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                class="bg-gradient-to-r from-violet-600 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                :style="{ width: `${video.progress}%` }"
              ></div>
            </div>
          </div> -->
        </div>
      </div>
      
      <!-- Completed Video -->
      <div v-else-if="video.status === 'completed'" class="relative group/video cursor-pointer h-full">
        <img 
          :src="video.thumbnail" 
          :alt="`Video thumbnail for ${video.url}`"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/video:opacity-100 transition-all duration-300"></div>
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-all duration-300">
          <button class="bg-white/90 backdrop-blur-sm rounded-full p-4 hover:bg-white transition-colors shadow-xl">
            <svg class="h-8 w-8 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
        
        <!-- Success Badge -->
        <div class="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-lg">
          <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium">Ready</span>
        </div>
      </div>
      
      <!-- Failed State -->
      <div v-else-if="video.status === 'failed'" class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-rose-50 p-6">
        <div class="text-center space-y-4">
          <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <p class="font-semibold text-slate-900 mb-1">Processing Failed</p>
            <p class="text-sm text-slate-600">Something went wrong</p>
          </div>
        </div>
        
        <!-- Error Badge -->
        <div class="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
          Error
        </div>
      </div>
    </div>
    
    <!-- Card Content -->
    <div class="p-6 space-y-4">
      <!-- URL -->
      <div class="flex items-start space-x-3">
        <div class="w-8 h-8 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg class="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-900 truncate">{{ getDomainFromUrl(video.url) }}</p>
          <p class="text-xs text-slate-500 truncate">{{ video.url }}</p>
        </div>
      </div>
      
      <!-- Settings & Date -->
      <div class="flex items-center justify-between text-xs">
        <div class="flex items-center space-x-3 text-slate-600">
          <span class="bg-slate-100 px-2 py-1 rounded-lg font-medium">{{ video.settings.quality }}</span>
          <span class="bg-slate-100 px-2 py-1 rounded-lg font-medium">{{ video.settings.scrollSpeed }}</span>
        </div>
        <span class="text-slate-500">{{ formatDate(video.createdAt) }}</span>
      </div>
      
      <!-- Status & Actions -->
      <div class="flex items-center justify-between pt-2">
        <!-- Status Badge -->
        <span 
          :class="[
            'inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold',
            video.status === 'processing' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800' :
            video.status === 'completed' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' :
            video.status === 'failed' ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800' :
            'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800'
          ]"
        >
          {{ video.status.charAt(0).toUpperCase() + video.status.slice(1) }}
        </span>
        
        <!-- Action Buttons -->
        <div class="flex items-center space-x-1">
          <button 
            v-if="video.status === 'completed'"
            class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200"
            title="Download Video"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          
          <button 
            v-if="video.status === 'failed'"
            @click="retryProcessing"
            class="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all duration-200"
            title="Retry Processing"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          <button 
            class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
            title="Delete"
            @click="deleteVideo"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  video: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['retry', 'delete'])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getDomainFromUrl = (url) => {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return 'Invalid URL'
  }
}

const retryProcessing = () => {
  emit('retry', props.video.id)
}

const deleteVideo = () => {
  emit('delete', props.video.id)
}
</script>