import { gql } from '@apollo/client'

export const GET_POSTS = gql`
  query PostsContents {
    posts {
      edges {
        node {
          id
          excerpt
          title
          slug
          date
          seo {
            metaDesc
            title
          }
          featuredImage {
            node {
              link
              altText
            }
          }
          categories {
            edges {
              node {
                slug
                name
              }
            }
          }
        }
      }
    }
  }
`
