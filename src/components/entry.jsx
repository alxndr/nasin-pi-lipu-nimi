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
  if (!glyph) return false
  return <div className="entry">
    <div className="entry__sitelenSitelen">
      <span className="sp" lang="tp">sina lukin e sitelen ni</span>
      <img src={data?.sitelen_sitelen || lasinaToGlyph(glyph)} alt={`glyph of "${glyph?.lasina}"`} />
    </div>
    <div className="entry__sitelenAnte">
      <div className="entry__sitelenLasina" lang="tp">
        <span className="sp" lang="tp">sitelen la nimi ni li</span>
        <span className="latin">
          {REGEX_NON_ALPHA.test(glyph?.lasina) || glyph?.lasina}
        </span>
      </div>
      {data?.sitelen_emosi &&
        <div className="entry__sitelenEmosi">
          <span className="sp" lang="tp">sitelen EMOSI la nimi ni li</span>
          <span className="emoji">
            {data?.sitelen_emosi}
          </span>
        </div>
      }
    </div>
    {data?.def &&
      <div className="entry__definition">
        <span className="sp" lang="tp">sitelen ni la kepeken toki ante e</span>
        <span className="latin">
          {
            data?.def?.split?.(' | ALT ').map((def, idx) => <p className={`entry__definition__graf entry__definition__graf-${idx}`}>{def}</p>)
            || glyphDefinition(glyph?.lasina)
          }
        </span>
      </div>
    }
    <span className="sp" lang="tp">wan-nasin pi sitelen ni li lon</span>
    <div className="entry__roots">
      {glyph?.roots?.map?.(rootCode => rootCodeToVisual(rootCode))}
    </div>
  </div>
}
export default EntryComponent
