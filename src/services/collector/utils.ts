import * as cheerio from 'cheerio'

export function toArray(elements: Cheerio, $: CheerioStatic) {
  let array: Cheerio[] = []
  elements.each(function(i, elem) {
    array.push($(elem))
  })
  return array
}

export function findElement(elements: Cheerio, fn: (element: CheerioStatic)=>boolean): CheerioStatic | null {

  let element;

  elements.each(function(i, elem) {
    const loadedElem = cheerio.load(elem)
   
    console.log('----------->------------') 	  
    console.log(loadedElem.html())	  
 
    if(fn(loadedElem)) {
      element = loadedElem
    }
  })

  if(!element) {
     return null
  }

  return element
} 
