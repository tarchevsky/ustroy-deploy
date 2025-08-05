import { PageNode } from '@/graphql/types/pagesTypes'
import React from 'react'
import WorkshopPagesGrid from './WorkshopPagesGrid'

interface WorkshopsChildrenListProps {
  pages: PageNode[]
}

const WorkshopsChildrenList: React.FC<WorkshopsChildrenListProps> = ({
  pages,
}) => {
  if (!pages.length) return null

  return (
    <section className="my-12">
      <div className="cont">
        <WorkshopPagesGrid pages={pages} />
      </div>
    </section>
  )
}

export default WorkshopsChildrenList
