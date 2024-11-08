const scroll = document.querySelector('.scroll button')
// const scrollButton = scroll.document.querySelector(',scroll button') 
const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6")

headers.forEach(header =>{
scroll.addEventListener('click', ()=>{
    const nextheader = header.nextElementSibling
    if (nextheader){

        window.scrollTo(0,nextheader.offsetTop)
    }
})})