export interface MenuItemNode {
  id: string
  label: string
  uri: string
  childItems?: {
    edges: Array<{
      node: MenuItemNode
    }>
  }
}

export interface MenuItemsData {
  menuItems: {
    edges: Array<{
      node: MenuItemNode
    }>
  }
}
