import * as React from 'react'
import {graphql} from 'gatsby'

import './index.scss'

const ROOTS = [
  {code: 'U' , type: 'phoneme' , name: 'u'      , },
  {code: 'O' , type: 'phoneme' , name: 'o'      , },
  {code: 'A' , type: 'phoneme' , name: 'a'      , },
  {code: 'E' , type: 'phoneme' , name: 'e'      , },
  {code: 'I' , type: 'phoneme' , name: 'i'      , },
  {code: 'J' , type: 'phoneme' , name: 'j'      , },
  {code: 'P' , type: 'phoneme' , name: 'p'      , },
  {code: 'T' , type: 'phoneme' , name: 't'      , },
  {code: 'K' , type: 'phoneme' , name: 'k'      , },
  {code: 'M' , type: 'phoneme' , name: 'm'      , },
  {code: 'W' , type: 'phoneme' , name: 'w'      , },
  {code: 'N' , type: 'phoneme' , name: 'n'      , },
  {code: 'L' , type: 'phoneme' , name: 'l'      , },
  {code: 'S' , type: 'phoneme' , name: 's'      , },
  {code: '~' , type:   'shape' , name: 'linja'  , },
  {code: 'ᴤ' , type:   'shape' , name: 'seme'   , },
  {code:'＝' , type:   'shape' , name: 'sama'   , },
  {code: '⊹' , type:   'shape' , name: 'weka'   , },
  {code: '⩍' , type:   'shape' , name: 'nena'   , },
  {code: '□' , type:   'shape' , name: 'leko'   , },
  {code: '⊿' , type:   'shape' , name: 'monsuta', },
  {code: '◎' , type:   'shape' , name: 'lupa'   , },
  {code: '☻' , type:   'shape' , name: 'uta'    , },
  {code: '☞' , type:   'shape' , name: 'luka'   , },
  {code: '[' , type:   'meta'  , name: 'poki'   , },
  {code: '_' , type:   'meta'  , name: 'anpa'   , },
]
const STRING_SORT_ORDER = ROOTS.map(r => r.code)
function sortRoots(a, b) {
  if (!STRING_SORT_ORDER.includes(a)) throw new Error(`sortRoots first param not a root: ${a}`)
  if (!STRING_SORT_ORDER.includes(b)) throw new Error(`sortRoots second param not a root: ${b}`)
  return STRING_SORT_ORDER.indexOf(a) - STRING_SORT_ORDER.indexOf(b)
}
function reduceIt(acc, edge) {
  const rootsString = edge.node.wanpiSS
  if (!rootsString.length) return acc
  const roots = rootsString.split(/\s+/)
  if (!roots.length) return acc
  const term = {
    lasina: edge.node.tokipona,
    roots,
  }
  acc.terms.push(term)
  roots.forEach(root => acc.rootsSet.add(root))
  return acc
}

function letterToGlyph(letterName) {
  return `https://jonathangabel.com/images/t47_tokipona/kalalili/t47_kalalili_x${letterName}.jpg`
}
function tpTermToGlyph(term) {
  return `https://jonathangabel.com/images/t47_tokipona/nimi/t47_nimi_${term}.jpg`
}
function tpMetaToGlyph(term) {
  if (term === '[')
    return `https://jonathangabel.com/images/t47_tokipona/nimi/t47_nmpi_cartouche.jpg`
  if (term === '!')
    return `https://jonathangabel.com/images/t47_tokipona/nimi/t47_nmpi_cartouche.jpg`
}
function tpToGlyph(termObj) {
  if (termObj.type === 'meta')
    return tpMetaToGlyph(termObj.lasina)
  return tpTermToGlyph(termObj.lasina)
}

function findRootData(root) {
  return ROOTS.find(r => r.code === root)
}
function rootToName(root) {
  return findRootData(root).name
}
function rootToImage(root) {
  const rootData = findRootData(root)
  if (rootData.type === 'phoneme')
    return <img src={letterToGlyph(rootData.name)} />
  return rootData.code
}
function rootToRootType(root) {
  return findRootData(root).type
}

const IndexPage = (props) => {
  const data = React.useMemo( // {terms, rootsSet}
    () => props.data.allDictCsv.edges.reduce(reduceIt, {terms:[], rootsSet:new Set()}),
    [props.data.allDictCsv.edges]
  )
  const sortedRoots = React.useMemo(() => [...data.rootsSet].sort(sortRoots), [data.rootsSet])
  const [selectedRoots, setSelectedRoots] = React.useState([])
  const terms = React.useMemo(
    () => {
      if (!selectedRoots.length)
        return data.terms
      return data.terms.filter(termObj => termObj.roots.join(',').includes(selectedRoots.join(',')))
    },
    [data.terms, selectedRoots]
  )

  return <>
    <main>
      <h1>nasin pi lipu nimi</h1>
      <p>To identify a glyph, first select a root:</p>
      <ul className="roots">
        {sortedRoots.map(root =>
          <li key={`root-${root}`} className={`roots__root-${rootToRootType(root)}`}>
            <button onClick={() => setSelectedRoots([...selectedRoots, root])}>{rootToImage(root)}</button>
          </li>
        )}
      </ul>
      <p>Selected: {selectedRoots.join(', ')} ... <button onClick={() => setSelectedRoots([])}>clear</button></p>
      <p>(TODO) Click a glyph to see the definition...</p>
      <ul className="glyphs">
        {terms.map?.(termData => // TODO fix the punctuation/etc
          <li key={`glyph-${termData.lasina}`} className={`glyphs__glyph-${termData.lasina}`}>
            <button><img src={tpToGlyph(termData)} /></button>
          </li>
        )}
      </ul>
    </main>
    <footer>
      <p><a href="https://github.com/alxndr/nasin-pi-lipu-nimi">code</a></p>
    </footer>
  </>
}

export default IndexPage

export const Head = () => <title>Home Page</title>

export const IndexQuery = graphql`
  query {
    allDictCsv {
      edges {
        node {
          tokipona
          wanpiSS
        }
      }
    }
  }
`
