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
import {lasinaToGlyph} from '../helpers/glyphs'
import './index.scss'

const ROOTS_COLUMN_NAME = 'wanpiSS' // gonna change this at some point ... don't forget the one in the graphQL query

const rootsSorted = rootsInOrder()
console.assert(rootsSorted.length === 26, 'rootsSorted should be 26 of em..')

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
  console.assert(edges.length > 100, 'we should have at least a hundo edges here')
  const allDefinedGlyphs = React.useMemo(
    () => edges.reduce(reduceIt, []).sort(sortTermsByRoots),
    [edges]
  )
  console.assert(allDefinedGlyphs.length > 100, 'we should have at least a hundo glyphs here')
  const [selectedRoots, setSelectedRoots] = React.useState([]) // these should use the full objects from the roots helper...
  const selection = React.useMemo(
    () => {
      if (!selectedRoots.length)
        return allDefinedGlyphs
      const REGEX_SELECTED_ROOTS = new RegExp(selectedRoots.map(({code}) => '\\'+code).join('.*'))
      return allDefinedGlyphs.filter(glyphObj => REGEX_SELECTED_ROOTS.test(glyphObj.roots.join('')))
    },
    [allDefinedGlyphs, selectedRoots]
  )
  React.useEffect(() => {
    window.history?.pushState?.(
      isSelectedRootsValid(selectedRoots)
      ? selectedRoots.map(rootObj => rootObj.name).join('+')
      : '',
      document.title,
      window.location.pathname + window.location.search
    )
  }, [selectedRoots]);

  return <>
    <main>

      <p className="help" style={{float:'right'}}>Help what is this?? <a href="https://alxndr.blog/2023/05/23/nasin-pi-lipu-nimi.html?src=nasin-pi-lipu-nimi&campaign=help" target="_blank" rel="noreferrer">read a blog post about it</a></p>

      <h1 data-sitelen>nasin pi lipu nimi</h1>

      <div className="rootpicker">
        <ul className="rootpicker__roots">
          {rootsSorted.map(rootObj =>
            <li onClick={() => setSelectedRoots([...selectedRoots, rootObj])} key={`root-${rootObj.name}`} className={`rootpicker__roots__root-${rootToRootType(rootObj.code)} roots__root-${rootObj.name}`}>
              {rootCodeToVisual(rootObj.code)}
            </li>
          )}
        </ul>
        <div className={cn('rootpicker__selection', {error: !isSelectedRootsValid(selectedRoots)})}>
          {selectedRoots.length === 0
            ? <p>select a root above to see all glyphs below which contain it; then select a glyph below to see its pronunciation and definition</p>
            : <>
              <button className="rootpicker__selection__button rootpicker__selection__button-clr" onClick={() => setSelectedRoots([])} title="clear all">∅</button>
              <ul>
                {selectedRoots.map(rootObj => <li key={rootObj.name}>{rootDataToVisual(rootObj)}</li>)}
                {selectedRoots.length > 0 && 
                  <button className="rootpicker__selection__button rootpicker__selection__button-del" onClick={() => setSelectedRoots(selectedRoots.slice(0, selectedRoots.length - 1))} title="remove last">⌫</button>
                }
              </ul>
            </>
          }
        </div>
      </div>
      
      <ul className="glyphs">
        {selection?.map?.(termData =>
          <li className={`glyphs__glyph-${termData.lasina}`} key={`glyph-${termData.lasina}`}>
            <img src={lasinaToGlyph(termData)} alt={`sitelen pi nimi "${termData.lasina}"`} />
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

export const Head = () => <>
  <script
    type="text/javascript"
    src="http://livingtokipona.smoishele.com/dist/sitelen-sitelen-renderer.min.js"
  ></script>
  <title>sitelen sitelen la, nasin pi lipu nimi</title>
</>

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
