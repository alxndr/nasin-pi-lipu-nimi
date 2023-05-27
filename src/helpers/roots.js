import * as React from 'react'

import {letterToGlyph} from './glyphs'

// these `code` chars need to match what's in the csv...
const ROOTS = [
  {code: 'U' , type: 'phoneme/V' , name: 'u'      },
  {code: 'O' , type: 'phoneme/V' , name: 'o'      },
  {code: 'A' , type: 'phoneme/V' , name: 'a'      },
  {code: 'E' , type: 'phoneme/V' , name: 'e'      },
  {code: 'I' , type: 'phoneme/V' , name: 'i'      },
  {code: 'J' , type: 'phoneme/Cv', name: 'j'      },
  {code: 'P' , type: 'phoneme/C' , name: 'p'      },
  {code: 'T' , type: 'phoneme/C' , name: 't'      },
  {code: 'K' , type: 'phoneme/C' , name: 'k'      },
  {code: 'M' , type: 'phoneme/C' , name: 'm'      },
  {code: 'W' , type: 'phoneme/Cv', name: 'w'      },
  {code: 'N' , type: 'phoneme/C' , name: 'n'      },
  {code: 'L' , type: 'phoneme/C' , name: 'l'      },
  {code: 'S' , type: 'phoneme/C' , name: 's'      },
  {code: '~' , type:     'shape' , name: 'linja'  , component:    <span class="spp"></span> },
  {code: 'ᴤ' , type:     'shape' , name: 'seme'   , component: <span class="juniko">Ƨ</span> },
  {code:'＝' , type:     'shape' , name: 'sama'   , component:    <span class="spp"></span> },
  {code: '⊹' , type:     'shape' , name: 'weka'   , component:    <span class="spp"></span> },
  {code: '⩍' , type:     'shape' , name: 'nena'   , component:    <span class="spp"></span> },
  {code: '□' , type:     'shape' , name: 'leko'   , component:    <span class="spp"></span> },
  {code: '⊿' , type:     'shape' , name: 'monsuta', component:    <span class="spp"></span> },
  {code: '◎' , type:     'shape' , name: 'lupa'   , component: <span class="juniko">◎</span> },
  {code: '☻' , type:     'shape' , name: 'uta'    , component:    <span class="spp"></span> },
  {code: '☞' , type:     'shape' , name: 'luka'   , component: <span class="juniko">☞</span> },
  {code: '[' , type:      'meta' , name: 'poki'   , component:    <span class="spp"></span> },
  {code: '_' , type:      'meta' , name: 'anpa'   , component: <span class="juniko">_</span> },
]
console.assert(ROOTS.length === 26)

const STRING_SORT_ORDER_CODES = ROOTS.map(r => r.code)

export function rootsInOrder() {
  return [...ROOTS];
}

/* param: array
 * returns: boolean
 */
export function isSelectedRootsValid(selectedRoots) {
  if (!selectedRoots?.length) return true
  if (selectedRoots.length > 3) return false
  return true
}

export function findRootData(root) {
  const result = ROOTS.find(r => r.code === root)
  if (!result) {
    throw new Error(`findRootData: unrecognized root code "${root}"`)
  }
  return result
}

export function rootDataToVisual(rootData) {
  return rootData.component || <img src={letterToGlyph(rootData.name)} alt={`sitelen pi nimi ${rootData.name}`} />
}
export function rootCodeToVisual(rootCode) {
  return rootDataToVisual(findRootData(rootCode))
}

export function rootToRootType(root) {
  return findRootData(root).type
}

/* params must be single-char Root codes
 * returns integer to be used in Array.prototype.sort
 */
export function sortRoots(a, b) {
  const posA = STRING_SORT_ORDER_CODES.indexOf(a)
  const posB = STRING_SORT_ORDER_CODES.indexOf(b)
  if (posA === -1)
    throw new Error(`sortRoots: first param not a root: ${a}`)
  if (posB === -1)
    throw new Error(`sortRoots: second param not a root: ${b}`)
  return posA - posB
}

/* params must be objects, with a `.roots` property containing the roots...
 * returns integer to be used in Array.prototype.sort
 */
export function sortTermsByRoots(termObjA, termObjB) {
  if (!termObjA?.roots?.length || !termObjB?.roots?.length)
    throw new Error('ruh roh')
  const [rootA1, rootA2, rootA3] = termObjA.roots
  const [rootB1, rootB2, rootB3] = termObjB.roots
  return (!rootA1 && 1) || (!rootB1 && -1) || sortRoots(rootA1, rootB1) ||
         (!rootA2 && 1) || (!rootB2 && -1) || sortRoots(rootA2, rootB2) ||
         (!rootA3 && 1) || (!rootB3 && -1) || sortRoots(rootA3, rootB3) ||
         0
}
