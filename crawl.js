const {JSDOM}=require('jsdom')


function NormalizeURL(url){                                  //normalizing the url so that all urls are deemed to be same
    const url1=new URL(url)                                   // ex- www.GOOgle.com
    let fullurl=`${url1.host}${url1.pathname}`                //     www.google.com/
    if(fullurl.length>0 && fullurl.slice(-1)==='/'){          //     www.google.com
        fullurl=fullurl.slice(0,-1)                           // all the above urls are same 
    }
    return fullurl
}


async function pagecrawler(base_url,current_url,totalpages={}){
    

    const baseobject=new URL(base_url)
    const currentobject =new URL(current_url)
    if(currentobject.hostname!==baseobject.hostname){             
        //totalpages[previous_url].externalurls.push(currentobject.href)
        //console.log(totalpages)
        console.log("External link, exiting...")
        return totalpages
    }

    const normalizeurl=NormalizeURL(current_url)

    if (totalpages.hasOwnProperty(normalizeurl)){                              //if the page has already been traversed this implies an entry 
        totalpages[normalizeurl].count++       
        //console.log(totalpages)                         // already exists,hence updating the entry and returning the func
        return totalpages
    }

    /*if (totalpages[normalizeurl][0]>0){                              //if the page has already been traversed this implies an entry 
        totalpages[normalizeurl][0]++                                // already exists,hence updating the entry and returning the func
        return totalpages
    }*/
    /*totalpages[normalizeurl]=[]  
    totalpages[normalizeurl][0]=1   
    totalpages[normalizeurl][1]=[]
    totalpages[normalizeurl][2]=[]    */
    totalpages[normalizeurl]={count:1,brokenurls:[]}
    console.log(`Now crawling ${current_url}...`)                             // creating entry for new page
    let htmlbody=''
    try{                                                                   //extracting the html body of the page through a request
        const webpage=await fetch(current_url)
        if (webpage.status>399){
            console.log(`HTTP error- code ${webpage.status}`)
            totalpages[normalizeurl].brokenurls.push(current_url)
            //console.log(totalpages)
            return totalpages
        }
        
        const type=webpage.headers.get('content-type')
        if(!type.includes('text/html')){
            console.log("Doesn't contain text/html content" )
            //console.log(totalpages)
            return totalpages
        }
        htmlbody=await webpage.text()

    }
    catch(err){
        console.log(err.message)
    } 
    const nextpages=getHTMLURLs(htmlbody,base_url)                 //extracts all urls from the current html body of the page
    for(const page of nextpages){
        previous_url=normalizeurl
        totalpages=await pagecrawler(base_url,page,totalpages,previous_url)           //calling recursive func on all the links in all further pages
    }
    //console.log(totalpages)
  
    return totalpages
}

function getHTMLURLs(htmlbdy,base){                  //extracts all urls from the html body and pushes them into an array
    const urls=[]
    const doc=new JSDOM(htmlbdy)
    const elements=doc.window.document.querySelectorAll('a')
    for(const element of elements){
        if(element.href.slice(0,1)==='/'){
            try{
                urls.push(new URL(element.href,base).href)                   //converts relative urls to absolute urls
            }
            catch(error){
                console.log(`${error.message}:${element.href}`)
            }
        }
        else{
            try{urls.push(new URL(element.href).href)
            }
            catch(error){
                console.log(`${error.message}:${element.href}`)
            }

        }
    }
    return urls

}

module.exports={
    NormalizeURL,
    getHTMLURLs,
    pagecrawler
}