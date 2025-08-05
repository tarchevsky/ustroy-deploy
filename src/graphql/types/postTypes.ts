import { TypesOfContentChoose } from './pageSettingsTypes'

export interface PostNode {
  id: string
  excerpt: string
  title: string
  slug: string
  date: string
  seo?: {
    metaDesc: string
    title: string
  }
  featuredImage?: {
    node: {
      link: string
      altText: string
    }
  }
  categories?: {
    edges: Array<{
      node: {
        slug: string
        name: string
      }
    }>
  }
}

export interface PostEdge {
  node: PostNode
}

export interface PostsData {
  posts: {
    edges: PostEdge[]
  }
}

export interface PostProps extends PostNode {
  path: string
  // Добавьте другие поля здесь, если необходимо
}

export interface Post {
  id: string
  date: string
  content: string
  title: string
  slug: string
  featuredImage?: {
    node: {
      link: string
      altText: string
    }
  }
  seo: {
    title: string
    metaDesc: string
  }
  typesOfContent?: {
    choose?: TypesOfContentChoose[]
  }
  categories?: {
    edges: Array<{
      node: {
        slug: string
        name: string
      }
    }>
  }
}

export interface SiteSettings {
  title: string
}
