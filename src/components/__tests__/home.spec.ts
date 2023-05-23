import { it, expect, describe } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import Home from '@/views/Home.vue'
import SongItem from '@/components/SongItem.vue'

describe('Home.vue', () => {
  it('should render a list of songs', () => {
    const songs = [{}, {}, {}]

    const component = shallowMount(Home, {
      data() {
        return {
          songs
        }
      }
    })

    const items = component.findAllComponents(SongItem)

    expect(items).toHaveLength(songs.length)

    items.forEach((wrapper, index) => {
      expect(wrapper.props().song).toStrictEqual(songs[index])
    })
  })
})
