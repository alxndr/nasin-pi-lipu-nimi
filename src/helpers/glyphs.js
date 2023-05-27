export function isGlyphAPlynth(lasina) {
  switch (lasina) {
    case '.':
    case '(quote)':
    case '(question)':
    case '(name)':
    case '!':
    case ',':
    case ':':
    case 'la':
    case 'mute':
      return true
    default:
      return false
  }
}

export function letterToGlyph(letterName) {
  return `https://jonathangabel.com/images/t47_tokipona/kalalili/t47_kalalili_x${letterName}.jpg`
}
function tpTermToGlyph(term) {
  switch (term) {
    case 'kokosila':
      return 'https://jonathangabel.com/images/t47_tokipona/nimi_ku_suli/kokosila_alt1.210815.josan_s.jpg'
    case 'meso':
      return 'https://jonathangabel.com/images/t47_tokipona/nimi_ku_suli/meso.210725.saki2_s.jpg';
    case 'epiku':
    case 'jasima':
    case 'kijetesantakalu':
    case 'lanpan':
    case 'leko':
    case 'misikele':
    case 'monsuta':
    case 'n':
    case 'soko':
    case 'tonsi':
      return `https://jonathangabel.com/images/t47_tokipona/nimi/t47_nimi_${term}.jpg`
    default:
      return `https://sumpygump.github.io/sitelen-sitelen/word-glyphs/${term}.svg`;
  }
}
export function tpToGlyph({lasina}) {
  switch (lasina) {
    case '.'          : return 'https://sumpygump.github.io/sitelen-sitelen/containers/point-single.svg'
    case '(quote)'    : return 'https://sumpygump.github.io/sitelen-sitelen/containers/cartouche-square.svg'
    case '(question)' : return 'https://sumpygump.github.io/sitelen-sitelen/containers/question-single.svg'
    case '(name)'     : return 'https://sumpygump.github.io/sitelen-sitelen/containers/title-single.svg'
    case '!'          : return 'https://sumpygump.github.io/sitelen-sitelen/containers/exclamation-single.svg'
    case ','          : return 'https://sumpygump.github.io/sitelen-sitelen/containers/comma-single.svg'
    case ':'          : return 'https://sumpygump.github.io/sitelen-sitelen/containers/colon-single.svg'
    default           : return tpTermToGlyph(lasina)
  }
}

