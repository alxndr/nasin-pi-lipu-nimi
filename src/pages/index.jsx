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

const IndexPage = ({data: {allRootsCsv: {edges: glyphEdges}, allDefinitionsJson: {edges: definitionEdges}}}) => {
  console.assert(glyphEdges.length > 100, `should have at least a hundo glyphs here; got ${glyphEdges.length}`)
  console.assert(definitionEdges.length > 130, `should have at least a hundo definitions; got ${definitionEdges.length}`)
  const allDefinitions = React.useMemo(
    () => definitionEdges.map(({node}) => node),
    [definitionEdges]
  )
  const allDefinedGlyphs = React.useMemo(
    () => glyphEdges.reduce((glyphsAccumulator, edge) => {
      const rootsString = edge.node.roots
      if (!rootsString.length) return glyphsAccumulator
      const roots = rootsString.split(/\s+/)
      glyphsAccumulator.push({ lasina: edge.node.tokipona, roots, })
      return glyphsAccumulator
    }, []).sort(sortTermsByRoots),
    [glyphEdges]
  )
  console.assert(allDefinedGlyphs.length > 100, 'we should have at least a hundo glyphs here')
  const [selectedRoots, setSelectedRoots] = React.useState([]) // these should use the full objects from the roots helper...
  const filteredGlyphs = React.useMemo(
    () => {
      if (!selectedRoots.length) return allDefinedGlyphs
      // TODO replace this implementation with something that'll find the roots in any order...
      const REGEX_SELECTED_ROOTS = new RegExp(selectedRoots.map(({code}) => '\\'+code).join('.*')) // escaping-backslash needed for the [ char 🫤
      return allDefinedGlyphs.filter(glyphObj => REGEX_SELECTED_ROOTS.test(glyphObj.roots.join('')))
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

  function keyupHandler({key}) {
    console.log('keyuppppp', typeof key, key)
    switch (key) {
      case 'Backspace':
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

  const clearSelectedRoots = () => setSelectedRoots([])
  const removeLastSelectedRoot = () => setSelectedRoots(selectedRoots.slice(0, selectedRoots.length - 1))

  return <>
    <main>

    <Help name="toplevel">
      <span className="ls">a, ni li seme? toki INLI la <a href="https://alxndr.blog/2023/05/23/nasin-pi-lipu-nimi.html?src=nasin-pi-lipu-nimi&campaign=help" target="_blank" rel="noreferrer">ni</a></span>
      <span className="english">What is this?? <a href="https://alxndr.blog/2023/05/23/nasin-pi-lipu-nimi.html?src=nasin-pi-lipu-nimi&campaign=help" target="_blank" rel="noreferrer">read a blog post about it</a></span>
    </Help>

      <h1 class="ls ls-large" title="nasin sitelen pi lipu nimi">nasin sitelen pi-__lipu__nimi</h1>

      <Modal open={!!selectedGlyph} onClose={() => setSelectedGlyph(null)} center>
        <Entry glyph={selectedGlyph} data={selectedDefinition} />
      </Modal>

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
            ? <p>select one or more roots above to see all glyphs below which contain it; and/or select a glyph below to see its pronunciation and definition</p>
            : <>
              <button className="rootpicker__selection__button rootpicker__selection__button-clr" onClick={clearSelectedRoots} title="clear all">clear</button>
              <ul>
                {selectedRoots.map(rootObj => <li key={rootObj.name}>{rootDataToVisual(rootObj)}</li>)}
                {selectedRoots.length > 0 && <li><button className="rootpicker__selection__button rootpicker__selection__button-del" onClick={removeLastSelectedRoot} title="remove last">⌫ delete</button></li>}
              </ul>
            </>
          }
        </div>
      </div>

      <ul className="glyphs">
        {filteredGlyphs?.map?.(glyphData =>
          <li onClick={() => setSelectedGlyph(glyphData)} className={`glyphs__glyph-${glyphData.lasina}`} key={`glyph-${glyphData.lasina}`}>
            <img src={lasinaToGlyph(glyphData)} alt={`sitelen pi nimi "${glyphData.lasina}"`} />
          </li>
        )}
      </ul>

    </main>

    <footer>
      <p><a href="https://github.com/alxndr/nasin-pi-lipu-nimi">code on GitHub</a></p>
    </footer>

    <Analytics/>
  </>
}

export default IndexPage

export const Head = () => <>
  <title>nasin sitelen pi lipu nimi</title>
</>

export const IndexQuery = graphql`
  query {
    allRootsCsv {
      edges {
        node {
          tokipona
          roots
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
