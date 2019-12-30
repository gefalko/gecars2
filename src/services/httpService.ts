import request from 'request'

export function post(url: string, body: string) {
  console.log('Connect to: ')
  return new Promise(function(resolve) {
    request(
      {
        url: url, //URL to hit
        method: 'POST', //Specify the method
        body: body,
        headers: {
          //We can define headers too
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
          'Content-type': 'application/x-www-form-urlencoded',
          'x-requested-with': 'XMLHttpRequest',
        },
      },
      function(error, response, body) {
        resolve(body)
      },
    )
  })
}

export function getHtml(url: string): Promise<string> {
  return get(url)
}

export function get(url: string): Promise<string> {
  return new Promise(function(resolve) {
    request(
      {
        url: url, //URL to hit
        method: 'GET', //Specify te method
        headers: {
          //We can define headers too
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
        },
      },
      function(error, response, body) {
        resolve(body)
      },
    )
  })
}
