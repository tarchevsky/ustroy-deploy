export interface TypesOfContentChooseHeroLayout {
  fieldGroupName: string
  header: string
  sub: string
  text1: string
  text2: string
}

export interface TypesOfContentChooseFeaturedProjectsLayout {
  fieldGroupName: string
  list: {
    nodes: Array<{
      id: string
      slug: string
      uri: string
    }>
  }
}

export interface TypesOfContentChooseGridCenterLayout {
  fieldGroupName: string
  heading: string
  img: {
    node: {
      altText: string
      sourceUrl: string
    }
  }
  imgMiniOne: {
    node: {
      altText: string
      sourceUrl: string
    }
  }
  imgMiniTwo: {
    node: {
      altText: string
      sourceUrl: string
    }
  }
  subtitle: string
}

export interface TypesOfContentChooseGridLeftToRightLayout {
  fieldGroupName: string
  heading: string
  img: {
    node: {
      altText: string
      sourceUrl: string
    }
  }
  subtitle: string
}

export interface TypesOfContentChooseGridRightToLeftLayout {
  fieldGroupName: string
  heading: string
  subtitle: string
  img: {
    node: {
      altText: string
      sourceUrl: string
    }
  }
}

export type TypesOfContentChooseGrid =
  | TypesOfContentChooseGridCenterLayout
  | TypesOfContentChooseGridLeftToRightLayout
  | TypesOfContentChooseGridRightToLeftLayout

export interface TypesOfContentChooseAboutLayout {
  fieldGroupName: string
  grid: TypesOfContentChooseGrid[]
}

export interface TypesOfContentChooseCustomersLayout {
  fieldGroupName: string
  repeater: Array<{
    fieldGroupName: string
    kartinka: {
      node: {
        altText: string
        sourceUrl: string
      }
    }
    link?: string | null
  }>
}

export interface TypesOfContentChooseCalculateLayout {
  fieldGroupName: string
  text: string
  btnText: string
}

export interface TypesOfContentChooseProjectPicturesLayout {
  fieldGroupName: string
  img1: {
    node: {
      altText: string
      sourceUrl: string
    }
  }
  img2: {
    node: {
      altText: string
      sourceUrl: string
    }
  }
  img3: {
    node: {
      altText: string
      sourceUrl: string
    }
  }
  img4: {
    node: {
      altText: string
      sourceUrl: string
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
  | TypesOfContentChooseHeroLayout
  | TypesOfContentChooseFeaturedProjectsLayout
  | TypesOfContentChooseAboutLayout
  | TypesOfContentChooseCustomersLayout
  | TypesOfContentChooseCalculateLayout
  | TypesOfContentChooseProjectPicturesLayout
  | TypesOfContentChooseProjectCarouselLayout
  | TypesOfContentChooseCustomLayout
  | TypesOfContentChooseMiniGalleryLayout
  | TypesOfContentChooseListOfContentsLayout

export interface TypesOfContent {
  choose: TypesOfContentChoose[]
}

export interface PageSettingsData {
  page: {
    id: string
    slug: string
    title: string
    content: string
    seo?: {
      title: string
      metaDesc: string
    }
    typesOfContent: TypesOfContent
  }
}

// Новые типы для полной страницы
export interface PageData {
  id: string
  slug: string
  title: string
  content: string
  seo?: {
    title: string
    metaDesc: string
  }
  typesOfContent: TypesOfContent
}

export interface PageBySlugData {
  pageBy: PageData
}
