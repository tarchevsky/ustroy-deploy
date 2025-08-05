import { gql } from '@apollo/client'

export const GET_POSTS_BY_CATEGORIES = gql`
  query GetPostsByCategories($categoryIds: [ID!]) {
    posts(first: 10, where: { categoryIn: $categoryIds }) {
      edges {
        node {
          id
          title
          slug
          date
          excerpt
          seo {
            metaDesc
            title
          }
          featuredImage {
            node {
              sourceUrl
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
