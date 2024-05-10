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
      console.debug('uh oh dunno this glyph code:', unusualGlyphCode)
      return "(sorry, we don't know this one yet...)"
  }
}

const REGEX_NON_ALPHA = /[^a-z]/

const EntryComponent = ({glyph, data, lang}) => { // glyph.lasina can be punctuation or "(usage)"
  React.useEffect(() => {
    glyph?.lasina && global.sitelenRenderer?.init?.()
  })
  if (!glyph)
    return false

  return <div className="entry" lang={lang}>

    <div className="entry__sitelenSitelen">
      <span lang="tp">sina lukin e sitelen</span>
      <span lang="en">you have selected the glyph:</span>
      <img className="entry__sitelenSitelen__image" src={data?.sitelen_sitelen || lasinaToGlyph(glyph)} alt={`glyph of "${glyph?.lasina}"`} />
    </div>

    {data && glyph?.lasina &&
      <span className="entry__pronunciation">
        <span lang="tp">o ken toki e nimi ona la</span>
        <span lang="en">this glyph is pronounced:</span>
        <span data-sitelen data-sitelen-ratio="0.2" className="entry__pronunciation__glyphs">
          {glyph?.lasina.toUpperCase()}
        </span>
      </span>
    }

    {glyph?.lasina &&
      <div className="entry__sitelenLasina" lang="tp">
        <span lang="tp">o ken sitelen e ona kepeken toki <span lang="tp tp-name">INLI</span> la</span>
        <span lang="en">this glyph is pronounced:</span>
        <span className="latin">
          {REGEX_NON_ALPHA.test(glyph?.lasina) || glyph?.lasina}
        </span>
      </div>
    }

    {data && glyph?.lasina &&
      <div className="entry__sitelenPona" lang="tp">
        <span lang="tp">ona li sitelen pi(nimi ni) la</span>
        <span lang="en">this glyph in Sitelen Pona:</span>
        <span className="entry__sitelenPona__nimi">
          {REGEX_NON_ALPHA.test(glyph?.lasina) || glyph?.lasina}
        </span>
      </div>
    }

    {data?.sitelen_emosi &&
      <div className="entry__sitelenEmosi">
        <span lang="tp">o ken sitelen e ona kepeken sitelen <span lang="tp tp-name">EMOSI</span> la</span>
        <span lang="en">this glyph in <a href="https://sites.google.com/view/sitelenemoji" target="_blank" rel="noreferrer">Sitelen Emoji</a>:</span>
        <span className="emoji">
          {data?.sitelen_emosi}
        </span>
      </div>
    }

    <div className="entry__definition">
      <span lang="tp">o ken sona e ona tan toki <span lang="tp tp-name">INLI</span> la</span>
      <span lang="en">the English meaning of this glyph:</span>
      <div className="latin">
        {data?.def?.split?.(' | ALT ')[0] || glyphDefinition(glyph?.lasina)}
      </div>
    </div>

    <div className="entry__rootscontainer">
      <span lang="tp">ona li wan tan ijo ni la</span>
      <span lang="en">the roots of this glyph:</span>
      <div className="entry__rootscontainer__roots">
        {glyph?.roots?.map?.(rootCode => rootCodeToVisual(rootCode))}
      </div>
    </div>

  </div>
}

export default EntryComponent
