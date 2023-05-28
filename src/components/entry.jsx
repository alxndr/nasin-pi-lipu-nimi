import * as React from 'react'

import {rootCodeToVisual} from '../helpers/roots'

import './entry.scss'

const EntryComponent = ({glyph, data}) => {
  if (!glyph || !data)
    return false
  global.console.log(glyph)
  return <div className="entry">
    <span className="entry__sitelenSitelen">
      <img src={data?.sitelen_sitelen} alt={`glyph of "${glyph?.lasina}"`} />
    </span>
    <h2>
      <span className="entry__sitelenLasina ls">{glyph?.lasina}</span>
      <span className="entry__sitelenEmosi">{data?.sitelen_emosi}</span>
    </h2>
    <div className="entry__definition">
      {data?.def.split(' | ALT ').map((def, idx) => <p className={`entry__definition__graf entry__definition__graf-${idx}`}>{def}</p>)}
    </div>
    <div className="entry__roots">
      {glyph?.roots?.map?.(rootCode => rootCodeToVisual(rootCode))}
    </div>
  </div>
}
export default EntryComponent
