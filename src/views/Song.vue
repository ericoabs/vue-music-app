<template>
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <button
        @click.prevent=";`${seek != '00:00' ? toggleAudio() : newSong(song)} `"
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
      >
        <i class="fas" :class="`${playing ? 'fa-pause' : 'fa-play'}`"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <div class="text-3xl font-bold">{{ song.modified_name }}</div>
        <div v-if="song.genre">{{ song.genre }}</div>
      </div>
    </div>
  </section>
  <section class="container mx-auto mt-6" id="comments">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Comments {{ song.comment_count }}</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <AlertBox
          :showAlert="show_alert"
          :alertMessage="alert_message"
          :alertVariant="alert_variant"
        />
        <VeeForm :validation-schema="commentSchema" @submit="addComment" v-if="userLoggedIn">
          <VeeField
            name="comment"
            as="textarea"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."
          ></VeeField>
          <ErrorMessage name="comment" class="text-red-600" />
          <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600 block"
            :disabled="comment_in_submission"
          >
            Submit
          </button>
        </VeeForm>
        <select
          v-model="sort"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="desc">Latest</option>
          <option value="asc">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <ul class="container mx-auto">
    <li
      v-for="comment in sortedComments"
      :key="comment.docID"
      class="p-6 bg-gray-50 border border-gray-200"
    >
      <div class="mb-5">
        <div class="font-bold">{{ comment.name }}s</div>
        <time>{{ comment.datePosted }}</time>
      </div>

      <p>
        {{ comment.content }}
      </p>
    </li>
  </ul>
</template>

<script lang="ts">
import { songsCollections, auth, commentsCollections } from '@/includes/firebase'
import { mapState, mapActions } from 'pinia'
import useUserStore from '@/stores/user'
import usePlayerStore from '@/stores/player'
import type { Song, Comment } from '@/types/songsTypes'
import { ErrorMessage } from 'vee-validate'
import AlertBox from '@/components/AlertBox.vue'

export default {
  name: 'Song',
  data() {
    return {
      song: {
        modified_name: '',
        uid: '',
        genre: '',
        orinal_name: '',
        display_name: '',
        comment_count: 0,
        url: '',
        docID: ''
      } as Song,
      commentSchema: {
        comment: 'required|min:4'
      },
      comment_in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait! Your comment is being submitted.',
      comments: [] as Comment[] | undefined,
      sort: 'asc'
    }
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    ...mapState(usePlayerStore, ['playing', 'seek']),
    sortedComments() {
      return this.comments?.slice().sort((a, b) => {
        if (this.sort === 'desc') {
          return new Date(b.datePosted) - new Date(a.datePosted)
        }

        return new Date(a.datePosted) - new Date(b.datePosted)
      })
    }
  },
  components: {
    ErrorMessage,
    AlertBox
  },
  async created() {
    const docSnapshot = await songsCollections.doc(this.$route.params.id).get()
    if (!docSnapshot.exists) {
      this.$router.push({ name: 'home' })
      return
    }

    const { sort } = this.$route.query

    this.sort = sort === 'asc' || sort === 'desc' ? sort : 'desc'

    this.song = docSnapshot.data()
    this.getComments()
  },
  methods: {
    ...mapActions(usePlayerStore, ['newSong', 'toggleAudio']),
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true
      this.show_alert = true
      this.alert_variant = 'bg-blue-500'
      this.alert_message = 'Please wait! Your comment is being submitted.'

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        songId: this.$route.params.id,
        name: auth.currentUser?.displayName,
        uid: auth.currentUser?.uid
      }

      try {
        await commentsCollections.add(comment)
      } catch (error) {
        this.comment_in_submission = false
        this.alert_variant = 'bg-red-500'
        this.alert_message = 'Error.'
      }

      this.song.comment_count += 1
      await songsCollections.doc(this.$route.params.id).update({
        comment_count: this.song.comment_count
      })

      this.getComments()

      this.comment_in_submission = false
      this.alert_variant = 'bg-green-500'
      this.alert_message = 'Comment added!'

      resetForm()
    },
    async getComments() {
      const snapshots = await commentsCollections.where('songId', '==', this.$route.params.id).get()

      this.comments = []

      snapshots.forEach((doc) => [
        this.comments.push({
          docID: doc.id,
          ...doc.data()
        })
      ])
    }
  },
  watch: {
    sort(newValue) {
      if (newValue === this.$route.query.sort) {
        return
      }

      this.$router.push({
        query: {
          sort: newValue
        }
      })
    }
  }
}
</script>
