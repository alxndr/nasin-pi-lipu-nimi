import * as React from 'react'
import {graphql} from 'gatsby'

import './entry.scss'

const EntryComponent = ({lasina, data}) => {
  return <div className="entry">
    <p className="entry__sitelenSitelen">
      <img src={data?.sitelen_sitelen} />
    </p>
    <h2>
      <span className="entry__sitelenLasina">{lasina}</span>
      <span className="entry__sitelenEmosi">{data?.sitelen_emosi}</span>
    </h2>
    <p className="entry__definition">{data?.def}</p>
  </div>
}
export default EntryComponent
