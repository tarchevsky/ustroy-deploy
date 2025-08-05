import { gql } from '@apollo/client'

export const GET_MENU_ITEMS = gql`
  query MenuSettings {
    menuItems(where: { location: MENU_1 }) {
      edges {
        node {
          id
          label
          uri
          childItems {
            edges {
              node {
                id
                label
                uri
                childItems {
                  edges {
                    node {
                      id
                      label
                      uri
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
