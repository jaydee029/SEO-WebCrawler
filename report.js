// printReport takes a dictionary of pages and prints them
// to the console in a human-friendly way
function printpages(pages,exturls){
  console.log('==========')
  console.log('REPORT')
  console.log('==========')
  const sortedPages = sortPages(pages)
  for (const sortedPage of sortedPages){
    const url = sortedPage[0]
    const count = sortedPage[1]
    console.log(`Found ${count} internal links to ${url}`)
  }
  if(exturls.length>0){
    console.log("External links are:-")
    for(const url of exturls){
      console.log(url)
    }
  }
  else{
    console.log("No external links")
  }
}

// sortPages sorts a dictionary of pages
// into a list of tuples (url, count)
// with the highest counts first in the list
function sortPages(pages){
  // 2D array where the
  // inner array: [ url, count ]
  const pagesArr = Object.entries(pages)
  pagesArr.sort((pageA, pageB) => {
    return pageB[1] - pageA[1]
  })
  return pagesArr
}


module.exports = {
  printpages,
  sortPages
}