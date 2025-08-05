import { GET_MENU_ITEMS } from '@/graphql/queries/getMenuItems'
import { MenuItemNode, MenuItemsData } from '@/graphql/types/menuTypes'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

// Рекурсивно преобразует структуру меню в массив MenuItemNode с вложенными childItems
function mapMenuItems(nodes: MenuItemNode[]): MenuItemNode[] {
  return nodes.map((node) => ({
    ...node,
    childItems: node.childItems?.edges?.length
      ? {
          edges: mapMenuItems(node.childItems.edges.map((e) => e.node)).map(
            (n) => ({ node: n }),
          ),
        }
      : { edges: [] },
  }))
}

export async function fetchMenuItems(
  client: ApolloClient<NormalizedCacheObject>,
) {
  const { data } = await client.query<MenuItemsData>({
    query: GET_MENU_ITEMS,
  })
  const allNodes = data.menuItems.edges.map(({ node }) => node)

  // Собираем id всех дочерних пунктов
  const childIds = new Set<string>()
  allNodes.forEach((node) => {
    node.childItems?.edges?.forEach(({ node: child }) => {
      childIds.add(child.id)
    })
  })

  // Оставляем только те, которые не являются дочерними
  const topLevel = allNodes.filter((node) => !childIds.has(node.id))
  return mapMenuItems(topLevel)
}
