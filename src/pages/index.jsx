import * as React from 'react'
import {graphql} from 'gatsby'
import cn from 'classnames'

import Analytics from '../components/analytics'
import {
  isSelectedRootsValid,
  rootCodeToVisual,
  rootDataToVisual,
  rootToRootType,
  rootsInOrder,
  sortTermsByRoots,
} from '../helpers/roots'
import {isGlyphAPlynth, tpToGlyph} from '../helpers/glyphs'
import './index.scss'

const ROOTS_COLUMN_NAME = 'wanpiSS' // gonna change this at some point ... don't forget the one in the graphQL query

/* reducer function for initial ETL of roots data from CSV
 *  — accumulator param is allDefinedGlyphs
 *  — element param is GraphQL-output `edge` object with prop `node`
 * ...must always return accumulator in reducer functions
 */
function reduceIt(acc, edge) {
  const rootsString = edge.node[ROOTS_COLUMN_NAME]
  if (!rootsString.length) return acc
  const roots = rootsString.split(/\s+/)
  acc.push({ lasina: edge.node.tokipona, roots, })
  return acc
}

const IndexPage = ({data: {allDictCsv: {edges}}}) => {
  const allDefinedGlyphs = React.useMemo(
    () => edges.reduce(reduceIt, []).sort(sortTermsByRoots),
    [edges]
  )
  const [selectedRoots, setSelectedRoots] = React.useState([]) // these should use the full objects from the roots helper...
  const selection = React.useMemo(
    () => {
      global.console.log('selection...', selectedRoots, allDefinedGlyphs)
      if (!selectedRoots.length)
        return allDefinedGlyphs
      return allDefinedGlyphs.filter(termObj =>
        global.console.log('hmmmm',termObj.roots,selectedRoots.map(rO=>rO.code))||
        // selectedRoots.reduce((boolVal, selectedRootObj) => {}, false)
        termObj.roots.join(',').includes(selectedRoots.map(rO=>rO.code).join(','))
      )
    },
    [allDefinedGlyphs, selectedRoots]
  )
  React.useEffect(() => {
    window.location.hash = isSelectedRootsValid(selectedRoots)
      ? selectedRoots.map(rootObj => rootObj.name).join('+')
      : ''
  }, [selectedRoots]);
  const rootsSorted = rootsInOrder()
  console.assert(rootsSorted.length === 26, 'rootsSorted should be 26 of em..')

  return <>
    <main>

      <p className="help">Help what is this?? <a href="https://alxndr.blog/2023/05/23/nasin-pi-lipu-nimi.html" target="_blank" rel="noreferrer">read a blog post about it</a></p>

      <h1>nasin pi lipu nimi</h1>

      <div className="rootpicker">
        <p>To identify a glyph, first select a root:
          <span className="help">(<a href="https://alxndr.blog/2023/05/23/nasin-pi-lipu-nimi.html#roots" target="_blank" rel="noreferrer">what kind of order is this??</a>)</span>
        </p>
        <ul className="rootpicker__roots">
          {rootsSorted.map(rootObj =>
            <li key={`root-${rootObj.name}`} className={`roots__root-${rootToRootType(rootObj.code)} roots__root-${rootObj.name}`}>
              <button onClick={() => setSelectedRoots([...selectedRoots, rootObj])}>
                {rootCodeToVisual(rootObj.code)}
              </button>
            </li>
          )}
        </ul>
        <p className={cn('rootpicker__selection', {error: !isSelectedRootsValid(selectedRoots)})}>
          <ul>
            {selectedRoots.map(rootObj => <li key={rootObj.name}>{rootDataToVisual(rootObj)}</li>)}
            <li><button className="rootpicker__selection__button rootpicker__selection__button-del" onClick={() => setSelectedRoots(selectedRoots.slice(0, selectedRoots.length - 1))} title="remove last">⌫</button></li>
          </ul>
          <button className="rootpicker__selection__button rootpicker__selection__button-clr" onClick={() => setSelectedRoots([])} title="clear all">∅</button>
        </p>
      </div>
      
      <ul className="glyphs">
        {selection?.map?.(termData =>
          <li key={`glyph-${termData.lasina}`} className={`glyphs__glyph-${termData.lasina}`}>
            <button className={cn({plinth: isGlyphAPlynth(termData.lasina)})}><img src={tpToGlyph(termData)} alt={`sitelen pi nimi "${termData.lasina}"`} /></button>
          </li>
        )}
      </ul>

    </main>

    <footer>
      <p><a href="https://github.com/alxndr/nasin-pi-lipu-nimi">code</a></p>
    </footer>

    <Analytics/>
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
