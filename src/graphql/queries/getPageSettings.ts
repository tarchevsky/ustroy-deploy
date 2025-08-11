import { gql } from '@apollo/client'

export const GET_PAGE_SETTINGS = gql`
  query PageSettings($id: ID!) {
    page(id: $id) {
      id
      slug
      title
      content
      seo {
        title
        metaDesc
      }
      typesOfContent {
        choose {
          ... on TypesOfContentChooseHeroLayout {
            fieldGroupName
            header
            sub
            text1
            text2
          }
          ... on TypesOfContentChooseFeaturedProjectsLayout {
            fieldGroupName
            list {
              nodes {
                id
                slug
                uri
              }
            }
          }
          ... on TypesOfContentChooseAboutLayout {
            grid {
              ... on TypesOfContentChooseGridCenterLayout {
                fieldGroupName
                heading
                img {
                  node {
                    altText
                    sourceUrl
                  }
                }
                imgMiniOne {
                  node {
                    altText
                    sourceUrl
                  }
                }
                imgMiniTwo {
                  node {
                    altText
                    sourceUrl
                  }
                }
                subtitle
              }
              ... on TypesOfContentChooseGridLeftToRightLayout {
                fieldGroupName
                heading
                img {
                  node {
                    altText
                    sourceUrl
                  }
                }
                subtitle
              }
              ... on TypesOfContentChooseGridRightToLeftLayout {
                fieldGroupName
                heading
                subtitle
                img {
                  node {
                    altText
                    sourceUrl
                  }
                }
              }
            }
            fieldGroupName
          }
          ... on TypesOfContentChooseCustomersLayout {
            fieldGroupName
            repeater {
              fieldGroupName
              kartinka {
                node {
                  altText
                  sourceUrl
                }
              }
            }
          }
          ... on TypesOfContentChooseCalculateLayout {
            fieldGroupName
            text
            btnText
          }
          ... on TypesOfContentChooseProjectCarouselLayout {
            fieldGroupName
            projectcarousel
          }
          ... on TypesOfContentChooseCustomLayout {
            add
            fieldGroupName
          }
          ... on TypesOfContentChooseMiniGalleryLayout {
            fieldGroupName
            point {
              image {
                node {
                  altText
                  sourceUrl
                }
              }
            }
          }
          ... on TypesOfContentChooseListOfContentsLayout {
            add
            fieldGroupName
          }
          ... on TypesOfContentChooseProjectPicturesLayout {
            fieldGroupName
            img1 {
              node {
                altText
                sourceUrl
              }
            }
            img2 {
              node {
                altText
                sourceUrl
              }
            }
            img3 {
              node {
                altText
                sourceUrl
              }
            }
            img4 {
              node {
                altText
                sourceUrl
              }
            }
          }
        }
      }
    }
  }
`
