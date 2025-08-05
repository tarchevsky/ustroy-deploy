import { PostsData } from '@/graphql/types/postTypes'
import { CategoryData } from './categoryTypes'

export interface Seo {
  metaDesc: string
  title: string
}

export interface Company {
  height: number
  name: string
  width: number
  src: {
    node: {
      link: string
      sourceUrl?: string
    }
  }
}

export interface Content {
  seo: Seo
  title: string
  content?: string
  pagecontent: {
    hero: {
      heroBtn?: string
      heroText?: string
      heroImage: {
        node: {
          altText: string
          link: string
        }
      }
    }
    address?: string
    email?: string
    companies?: Company[]
  }
}

export interface PageData {
  page: Content
}

export type CombinedData = PostsData & PageData & CategoryData
