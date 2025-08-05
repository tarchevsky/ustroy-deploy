import { gql } from '@apollo/client'

export const GET_CATEGORY = gql`
  query GetCategory($id: ID!) {
    category(id: $id) {
      name
      slug
      seo {
        metaDesc
        title
      }
      posts {
        edges {
          node {
            id
            slug
            title
            excerpt
            ... on TypesOfContentChooseProjectCarouselLayout {
              fieldGroupName
              projectcarousel
            }
            ... on TypesOfContentChooseCustomLayout {
              add
              fieldGroupName
            }
          }
        }
      }
    }
  }
`
