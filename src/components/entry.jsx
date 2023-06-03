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

// const REGEX_TP_CONSONANTS = [jptkmwnls]
// const REGEX_TP_VOWELS = [aeiou]
const REGEX_SYLLABLE_TOKIPONA = /^([jptkmwnls]?[aeiou](?:n(?![aeiou]))?)(.*)$/
function splitIntoSyllables(word, syllables=[]) {
  if (!word.length) return syllables
  if (word.length === 1 && word === 'n') return [...syllables, 'n'] // special-case...
  if (!REGEX_SYLLABLE_TOKIPONA.test(word)) throw new Error(`Can't split into syllables: "${word}"`)
  const [_word, nextSyllable, remainder] = REGEX_SYLLABLE_TOKIPONA.exec(word)
  return splitIntoSyllables(remainder, [...syllables, nextSyllable])
}

const EntryComponent = ({glyph, data}) => { // glyph.lasina can be punctuation or "(usage)"
  React.useEffect(() => {
    // global.setTimeout(() => // TODO add a loop...
      global?.sitelenRenderer?.init?.()
      // , 10)
  })
  if (!glyph) return false
  const syllables = splitIntoSyllables(glyph?.lasina)
  return <div className="entry">
    <div className="entry__sitelenSitelen">
      <span lang="tp">sina lukin e sitelen ni</span>
      <img className="entry__sitelenSitelen__image" src={data?.sitelen_sitelen || lasinaToGlyph(glyph)} alt={`glyph of "${glyph?.lasina}"`} />
    </div>
    <div className="entry__sitelenAnte">
      {glyph?.lasina &&
        <div className="entry__sitelenPona" lang="tp">
          <span lang="tp">sitelen ni la o sitelen kepeken sitelen pona e ni</span>
          <span className="entry__sitelenPona__nimi">
            {REGEX_NON_ALPHA.test(glyph?.lasina) || glyph?.lasina}
          </span>
        </div>
      }
      {data?.sitelen_emosi &&
        <div className="entry__sitelenEmosi">
          <span lang="tp">sitelen ni la o sitelen kepeken sitelen EMOSI e ni</span>
          <span className="emoji">
            {data?.sitelen_emosi}
          </span>
        </div>
      }
      {glyph?.lasina &&
        <div className="entry__sitelenLasina" lang="tp">
          <span lang="tp">sitelen ni la o sitelen kepeken sitelen LASINA e ni</span>
          <span className="latin">
            {REGEX_NON_ALPHA.test(glyph?.lasina) || glyph?.lasina}
          </span>
        </div>
      }
    </div>
    <div className="entry__body">
      {glyph?.lasina &&
        <span className="entry__pronunciation">
          <span lang="tp">sitelen ni la o toki uta e ni</span>
          <span data-sitelen data-sitelen-ratio="0.75" className="entry__pronunciation__glyphs">
            {glyph?.lasina.toUpperCase()}
          </span>
        </span>
      }
      {data?.def &&
        <div className="entry__definition">
          <span lang="tp">sitelen ni la o toki kepeken toki ante e</span>
          <div className="latin">
            {
              data?.def?.split?.(' | ALT ')[0]
              || glyphDefinition(glyph?.lasina)
            }
          </div>
        </div>
      }
    </div>
    <span lang="tp">sitelen ni la wan nasin li ni</span>
    <div className="entry__roots">
      {glyph?.roots?.map?.(rootCode => rootCodeToVisual(rootCode))}
    </div>
  </div>
}
export default EntryComponent
