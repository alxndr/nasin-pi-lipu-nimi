import * as React from 'react'
import {graphql} from 'gatsby'
import {Modal} from 'react-responsive-modal'
import cn from 'classnames'

import Analytics from '../components/analytics'
import Help from '../components/help'
import Entry from '../components/entry'

import {
  isSelectedRootsValid,
  rootCodeToVisual,
  rootDataToVisual,
  rootToRootType,
  rootsInOrder,
  sortTermsByRoots,
} from '../helpers/roots'
import {lasinaToGlyph} from '../helpers/glyphs'

import 'react-responsive-modal/styles.css'
import './index.scss'

const rootsSorted = rootsInOrder()
console.assert(rootsSorted.length === 26, 'rootsSorted should be 26 of em..')

const REGEX_WHITESPACE = /\s+/


const IndexPage = ({data: {allRootsCsv: {edges: glyphEdges}, allDefinitionsJson: {edges: definitionEdges}}}) => {
  console.assert(glyphEdges.length > 100, `should have at least a hundo glyphs here; got ${glyphEdges.length}`)
  console.assert(definitionEdges.length > 130, `should have at least 130 definitions; got ${definitionEdges.length}`)
  const allDefinitions = React.useMemo(
    () => definitionEdges.map(({node}) => node),
    [definitionEdges]
  )
  const allDefinedGlyphs = React.useMemo(
    () => glyphEdges.reduce((glyphsAccumulator, edge) => {
      const rootsString = edge.node.roots
      if (!rootsString.length) return glyphsAccumulator
      const roots = rootsString.split(REGEX_WHITESPACE)
      glyphsAccumulator.push({ lasina: edge.node.tokipona, roots, rootsAlt: edge.node.rootsAlt?.split(REGEX_WHITESPACE)})
      return glyphsAccumulator
    }, []).sort(sortTermsByRoots),
    [glyphEdges]
  )
  console.assert(allDefinedGlyphs.length > 100, 'we should have at least a hundo glyphs here')
  const [selectedRoots, setSelectedRoots] = React.useState([]) // these should use the full objects from the roots helper...
  const filteredGlyphs = React.useMemo(
    () => {
      return allDefinedGlyphs.filter(({roots, rootsAlt}) => 
        selectedRoots.reduce((boolResult, selectedRootObj) => {
          return boolResult &&
            (roots.includes(selectedRootObj.code) // the glyph's main roots includes this selected root,
            || rootsAlt.includes(selectedRootObj.code)) // ...or the glyph's alternate readings include this selected root
        }, true)
      )
    },
    [allDefinedGlyphs, selectedRoots]
  )
  const [selectedGlyph, setSelectedGlyph] = React.useState(null)
  const selectedDefinition = React.useMemo(
    () => {
      return allDefinitions.find((defEdge => defEdge.word === selectedGlyph?.lasina))
    },
    [definitionEdges, selectedGlyph]
  )
  function glyphToDictionaryEntry(glyphData) {
    return (
      <li onClick={() => setSelectedGlyph(glyphData)} className={`glyphs__glyph-${glyphData.lasina}`} key={`glyph-${glyphData.lasina}`}>
        <img src={lasinaToGlyph(glyphData)} alt={`sitelen pi nimi "${glyphData.lasina}"`} />
      </li>
    )
  }

  const clearSelectedRoots = () => setSelectedRoots([])
  const removeLastSelectedRoot = () => setSelectedRoots(selectedRoots.slice(0, selectedRoots.length - 1))

  function keyupHandler({key}) {
    switch (key) {
      case 'Backspace':
        // TODO why does this clear all of them and not just the last one...
        removeLastSelectedRoot()
        return
      case 'Escape':
        clearSelectedRoots()
        return
      default:
        return
    }
  }
  React.useEffect(() => {
    window.addEventListener('keyup', keyupHandler)
    return () => {
      window.removeEventListener('keyup', keyupHandler)
    }
  }, [])

  return <>
    <main className={filteredGlyphs.length === 0 ? 'no-glyphs-found' : ''}>

      <Help name="toplevel">
        <span className="english">
          What is this??
          <br/>
          <a href="https://alxndr.blog/2023/05/23/nasin-pi-lipu-nimi.html?src=nasin-pi-lipu-nimi" target="_blank" rel="noreferrer">read a blog post about it</a>
        </span>
        <span lang="tp">
          ilo ni li seme la
          <br/>
          o lukin e <a href="https://alxndr.blog/2023/05/23/nasin-pi-lipu-nimi.html?src=nasin-pi-lipu-nimi" target="_blank" rel="noreferrer">lipu mi</a> tan ilo ni
        </span>
      </Help>

      <h1 lang="tp" className="sp-ll">nasin sitelen tawa lipu pi(nimi&nbsp;ale)</h1>

      <Modal open={selectedGlyph} onClose={() => setSelectedGlyph(null)} center>
        <Entry glyph={selectedGlyph} data={selectedDefinition} />
      </Modal>

      <div className="rootpicker">
        <div className={cn('rootpicker__selection', {error: !isSelectedRootsValid(selectedRoots)})}>
          {selectedRoots.length === 0
            ? <Help>
                <span lang="tp">
                  o luka e ijo ni la
                  <br/>
                  o lukin e poki anpa
                  <br/>
                  o luka e sitelen sitelen
                </span>
                <span lang="en">select a root to see all glyphs below which contain the root</span>
              </Help>
            : <>
              {selectedRoots.map(rootObj => <span className="rootpicker__selection__root" key={rootObj.name}>{rootDataToVisual(rootObj)}</span>)}
              <button lang="tp" className="rootpicker__selection__button rootpicker__selection__button-del" onClick={removeLastSelectedRoot} title="remove last">weka e ijo wan</button>
              {selectedRoots.length > 1 && <button lang="tp" className="rootpicker__selection__button rootpicker__selection__button-clr" onClick={clearSelectedRoots} title="clear all">weka e ijo ale</button>}
            </>
          }
        </div>
        <ul className="rootpicker__roots">
          {rootsSorted.map(rootObj =>
            <li onClick={() => setSelectedRoots([...selectedRoots, rootObj])} key={`root-${rootObj.name}`} className={`rootpicker__roots__root-${rootToRootType(rootObj.code)} roots__root-${rootObj.name}`}>
              {rootCodeToVisual(rootObj.code)}
            </li>
          )}
        </ul>
      </div>

      {filteredGlyphs.length
        ? <Help>
            <span lang="tp">
              o luka e sitelen sitelen la
              <br/>
              o lukin e sona tan ona
            </span>
            <span lang="en">select a glyph below to see its definition</span>
          </Help>
        : <Help name="error">
            <span lang="tp">
              nimi ala la
              <br/>
              o weka e ijo
            </span>
            <span lang="en">No glyphs found — remove a root filter by clicking the <q lang="tp">weka e ijo wan</q> button above</span>
          </Help>
      }
      <ul className="glyphs">
        {filteredGlyphs.map?.(glyphToDictionaryEntry)}
      </ul>

    </main>

    <footer>
      <p><a href="https://alxndr.blog/2023/05/23/nasin-pi-lipu-nimi.html?src=nasin-pi-lipu-nimi" target="_blank" rel="noreferrer">about this tool</a></p>
      <p><a href="https://github.com/alxndr/nasin-pi-lipu-nimi">code on GitHub</a></p>
    </footer>

    <Analytics/>
  </>
}

export default IndexPage

export const Head = () => <>
  <title>nasin sitelen tawa lipu pi nimi ale</title>
  <script type="text/javascript" src="assets/sitelen-sitelen-renderer.min.js"></script>
</>

export const IndexQuery = graphql`
  query {
    allRootsCsv {
      edges {
        node {
          tokipona
          roots
          rootsAlt
        }
      }
    }
    allDefinitionsJson {
      edges {
        node {
          sitelen_sitelen
          word
          sitelen_emosi
          def
        }
      }
    }
  }
`
