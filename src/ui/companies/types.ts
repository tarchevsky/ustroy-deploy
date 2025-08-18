export interface Company {
  id: string
  src: string
  alt: string
  width: number
  height: number
  link?: string | null
}

export interface CompaniesProps {
  companies: Company[]
}
