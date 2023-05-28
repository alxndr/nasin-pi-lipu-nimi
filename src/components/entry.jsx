import * as React from 'react'

import {lasinaToGlyph} from '../helpers/glyphs'
import {rootCodeToVisual} from '../helpers/roots'

import './entry.scss'

function glyphDefinition(unusualGlyphCode) {
  switch (unusualGlyphCode) {
    case '.'          : return '(a sentence-separating glyph)'
    case '(quote)'    : return '(a quotation marker)'
    case '(question)' : return '(a question marker)'
    case '(name)'     : return '(a name marker)'
    case '!'          : return '(an emphatic glyph!!)'
    case ','          : return '(a thought-separating glyph)'
    case ':'          : return '(a context-separating glyph)'
    default:
      return "(sorry, we don't know this one yet...)"
  }
}

const REGEX_NON_ALPHA = /[^a-z]/

const EntryComponent = ({glyph, data}) => { // glyph.lasina can be punctuation or "(usage)"
  return <div className="entry">
    <span className="entry__sitelenSitelen">
      <img src={data?.sitelen_sitelen || lasinaToGlyph(glyph)} alt={`glyph of "${glyph?.lasina}"`} />
    </span>
    <h2>
      <span className="entry__sitelenLasina ls">{REGEX_NON_ALPHA.test(glyph?.lasina) || glyph?.lasina}</span>
      <span className="entry__sitelenEmosi">{data?.sitelen_emosi}</span>
    </h2>
    <div className="entry__definition">
      {data?.def?.split?.(' | ALT ').map((def, idx) => <p className={`entry__definition__graf entry__definition__graf-${idx}`}>{def}</p>)
      || glyphDefinition(glyph.lasina)}
    </div>
    <div className="entry__roots">
      {glyph?.roots?.map?.(rootCode => rootCodeToVisual(rootCode))}
    </div>
  </div>
}
export default EntryComponent
