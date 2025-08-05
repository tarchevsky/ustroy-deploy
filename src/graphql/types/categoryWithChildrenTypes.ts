export interface ChildCategory {
  id: string
  name: string
  slug: string
  description: string
  count: number
}

export interface CategoryPost {
  id: string
  title: string
  slug: string
  excerpt: string
  date: string
  featuredImage?: {
    node: {
      link: string
      altText: string
    }
  }
}

export interface TypesOfContentChooseProjectCarouselLayout {
  fieldGroupName: 'TypesOfContentChooseProjectCarouselLayout'
  projectcarousel: boolean
}

export interface TypesOfContentChooseCustomLayout {
  add: boolean
  fieldGroupName: 'TypesOfContentChooseCustomLayout'
}

export interface TypesOfContentChooseMiniGalleryLayout {
  fieldGroupName: 'TypesOfContentChooseMiniGalleryLayout'
  point: {
    image: {
      node: {
        altText: string
        sourceUrl: string
      }
    }
  }[]
}

export interface TypesOfContentChooseListOfContentsLayout {
  fieldGroupName: 'TypesOfContentChooseListOfContentsLayout'
  add: boolean
}

export type TypesOfContentChoose =
  | TypesOfContentChooseProjectCarouselLayout
  | TypesOfContentChooseCustomLayout
  | TypesOfContentChooseMiniGalleryLayout
  | TypesOfContentChooseListOfContentsLayout // добавлен список контента

export interface TypesOfContent {
  choose: TypesOfContentChoose[]
}

export interface CategoryWithChildren {
  id: string
  name: string
  slug: string
  description: string
  seo: {
    title: string
    metaDesc: string
  }
  children: {
    nodes: ChildCategory[]
  }
  posts: {
    edges: Array<{
      node: CategoryPost
    }>
  }
  typesOfContent?: TypesOfContent
}

export interface CategoryWithChildrenData {
  category: CategoryWithChildren
}
