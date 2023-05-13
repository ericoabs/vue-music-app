export interface Song {
  modified_name: string
  uid: string
  genre: string
  orinal_name: string
  display_name: string
  comment_count: number
  url: string
  docID: string
}

export interface Comment {
  docID: string
  content: string
  datePosted: Date | string
  songId: string
  name: string
  uid: string
}
