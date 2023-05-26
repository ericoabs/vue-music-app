import { it, expect, describe } from 'vitest'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import SongItem from '@/components/SongItem.vue'

describe('SongItem.vue', () => {
  it('should render the song.display_name', () => {
    const song = {
      display_name: 'test'
    }

    //@ts-ignore
    const wrapper = shallowMount(SongItem, {
      propsData: {
        song
      },
      global: {
        components: {
          'router-link': RouterLinkStub
        }
      }
    })

    const compositionAuthor = wrapper.find('.text-gray-500')

    expect(compositionAuthor.text()).toBe(song.display_name)
  })

  it('should render the song.docID in id attribute', () => {
    const song = {
      docID: 'abc'
    }
    //@ts-ignore
    const wrapper = shallowMount(SongItem, {
      propsData: {
        song
      },
      global: {
        components: {
          'router-link': RouterLinkStub
        }
      }
    })

    expect(wrapper.attributes().id).toBe(`song-id-${song.docID}`)
  })
})
