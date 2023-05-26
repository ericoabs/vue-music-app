<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <UploadMusic :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <CompositionItem
              v-for="(song, index) in songs"
              :key="song.docID"
              :song="song"
              :updateSong="updateSong"
              :index="index"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import UploadMusic from '@/components/UploadMusic.vue'
import { songsCollections, auth } from '@/includes/firebase'
import type { Song } from '@/types/songsTypes'
import CompositionItem from '@/components/CompositionItem.vue'

export default {
  name: 'Manage',
  components: {
    UploadMusic,
    CompositionItem
  },
  data() {
    return {
      songs: [] as Song[],
      unsavedFlag: false
    }
  },
  async created() {
    //@ts-ignore
    const snapshot = await songsCollections.where('uid', '==', auth.currentUser.uid).get()

    snapshot.forEach(this.addSong)
  },
  methods: {
    updateSong(index: number, values: Song) {
      this.songs[index].modified_name = values.modified_name
      this.songs[index].genre = values.genre
    },
    removeSong(index: number) {
      this.songs.splice(index, 1)
    },
    addSong(document: any) {
      const song = {
        ...document.data(),
        docID: document.id
      }

      this.songs.push(song)
    },
    updateUnsavedFlag(value: boolean) {
      this.unsavedFlag = value
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next()
      return
    }

    const leave = confirm('You have unsaved changes. Are you sure you want to leave?')
    next(leave)
  }
}
</script>
