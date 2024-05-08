import * as React from 'react'

export default function Analytics() {
  React.useEffect(() => {
    window.goatcounter = { path: (window.location.host + "/" + window.location.pathname) }
  });
  return <>
    <script
      data-goatcounter="https://alxndr.goatcounter.com/count"
      async
      src="//gc.zgo.at/count.js"
    ></script>
  </>
}
