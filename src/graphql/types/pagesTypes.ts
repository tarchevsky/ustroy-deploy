export interface PageNode {
  id: string
  slug: string
  uri: string | null
  title: string
  seo: {
    title: string
    metaDesc: string
  }
  parent?: {
    node: {
      id: string
      slug: string
      uri: string | null
    }
  }
}

export interface PagesData {
  pages: {
    nodes: PageNode[]
  }
}
