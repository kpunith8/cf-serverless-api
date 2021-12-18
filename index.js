addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': '*'
}

async function getImages(request) {
  const { query } = await request.json()
  const resp = await fetch(`https://api.unsplash.com/search/photos?query=${query}`, {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
    },
  })
  const data = await resp.json()
  const images = data.results.map(image => ({
    url: image.urls.small,
    id: image.id,
    link: image.links.html
  }))

  return new Response(JSON.stringify(images), {
    headers: {
      'Content-type': 'application/json',
      ...corsHeaders,
    }
  })
}

async function handleRequest(request) {
  // OPTIONS request was sent by browser while accessing this serverless api, could be react app
  if (request.method === 'OPTIONS') {
    return new Response('OK', { headers: corsHeaders })
  }

  if (request.method === 'POST') {
    return getImages(request)
  }
}
