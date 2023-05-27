import * as React from 'react'
import {graphql} from 'gatsby'

import Analytics from '../components/analytics'
import {findRootData, sortTermsByRoots, rootCodeToVisual, rootToRootType, sortRoots} from '../helpers/roots'
import {tpToGlyph} from '../helpers/glyphs'
import './index.scss'

const ROOTS_COLUMN_NAME = 'wanpiSS' // gonna change this at some point ... don't forget the one in the graphQL query

/* reducer function for initial ETL of roots data from CSV
 *  — accumulator param is object with props `terms` and `roots`
 *  — element param is GraphQL-output `edge` object with prop `node`
 * ...must always return accumulator in reducer functions
 */
function reduceIt(acc, edge) {
  const rootsString = edge.node[ROOTS_COLUMN_NAME]
  if (!rootsString.length) return console.log('!rootsString:',edge.node)|| acc
  const roots = rootsString.split(/\s+/)
  roots.forEach(root => acc.rootsSet.add(root))
  acc.terms.push({ lasina: edge.node.tokipona, roots, })
  return acc
}

const IndexPage = (props) => {
  const data = React.useMemo(
    () => {
      const {terms, rootsSet} = props.data.allDictCsv.edges.reduce(reduceIt, {terms:[], rootsSet:new Set() })
      const termsSorted = terms.sort(sortTermsByRoots)
      console.assert(rootsSet.length === 26, 'rootsSet length should be 26')
      const rootsSorted = [...rootsSet].sort(sortRoots)
      return {termsSorted, rootsSorted}
    },
    [props.data.allDictCsv.edges]
  )
  const [selectedRoots, setSelectedRoots] = React.useState([])
  const terms = React.useMemo(
    () => {
      if (!selectedRoots.length)
        return data.termsSorted
      return data.termsSorted.filter(termObj => termObj.roots.join(',').includes(selectedRoots.join(',')))
    },
    [data.termsSorted, selectedRoots]
  )
  console.assert(data.rootsSorted.length === 26, 'rootsSorted should be 26 of em..')

  return <>
    <main className={selectedRoots.length > 3 ? 'error' : ''}>

      <p className="help">Help what is this?? <a href="https://alxndr.blog/2023/05/23/nasin-pi-lipu-nimi.html" target="_blank">read a blog post about it</a></p>

      <h1>nasin pi lipu nimi</h1>

      <p>To identify a glyph, first select a root:
        <span className="help">(<a href="https://alxndr.blog/2023/05/23/nasin-pi-lipu-nimi.html#roots" target="_blank">what kind of order is this??</a>)</span>
        TODO Where did S go??
      </p>
      <ul className="roots">
        {data.rootsSorted.map(root =>
          <li key={`root-${root}`} className={`roots__root-${rootToRootType(root)}`}>
            <button onClick={() => setSelectedRoots([...selectedRoots, root])}>
              {rootCodeToVisual(root)}
            </button>
          </li>
        )}
      </ul>
      <p>Selected: TODO change to glyphs... {selectedRoots.join(', ')} ... <button onClick={() => setSelectedRoots([])}>clear</button></p>
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
