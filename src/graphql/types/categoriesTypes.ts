export interface CategoryNode {
  slug: string
  name: string
  id: string
  seo?: {
    metaDesc: string
    title: string
  }
}

export interface CategoriesData {
  categories: {
    edges: Array<{
      node: CategoryNode
    }>
  }
}

export interface CategoryLinkProps {
  id: string
  slug: string
  name: string
}
