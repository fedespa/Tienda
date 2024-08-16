const d = document, $inputSearch = d.getElementById("inputSearch"),
    fragment = d.createDocumentFragment(), template = d.querySelector("template").content,
    $containerProducts = d.querySelector(".container-products"),
    templateModal = d.querySelector(".template-modal").content, $modal = d.querySelector(".modal-product"),
    $modalContent = d.querySelector(".modal-product-content")

const displayProducts = (products) => {
    $containerProducts.innerHTML = ""
    products.forEach(p => {
        const {price,title,thumbnail,id} = p
        template.querySelector("article").setAttribute("data-id",id)
        template.querySelector("img").setAttribute("src", thumbnail)
        template.querySelector("h4").innerHTML = title
        template.querySelector("span").innerHTML = `$ ${price}`
        let $clone = d.importNode(template,true)
        fragment.appendChild($clone)
    })
    $containerProducts.appendChild(fragment)
}

const getProducts = async (product) => {
    try {
        const res = await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${product}&limit=5`)
        if (!res.ok) throw {}
        const json = await res.json()
        //console.log(json.results)
        displayProducts(json.results)
    }
    catch {
        $containerProducts.innerHTML = "Ese producto no existe"
    }
}

const showProduct = async (id,price) => {
    history.pushState(null, '', `/productos/${id}`);
    $modalContent.innerHTML = ""
    try {
        const res = await fetch(`https://api.mercadolibre.com/items/${id}`)
        if (!res.ok) throw {}
        const json = await res.json()
        console.log(json)
        $modal.classList.add("active")
        const {pictures,title,attributes} = json
        let index = 0
        for (const p of pictures){
            if (index === 8) break
            const $img = d.createElement("img"),
                $btn = d.createElement("button")
            $img.setAttribute("src",p.secure_url)
            $btn.appendChild($img)
            templateModal.querySelector(".container-imgs").appendChild($btn)
            index++
        }
        templateModal.querySelector(".principal-img").setAttribute("src",pictures[0].secure_url)
        templateModal.querySelector(".product-info-name").innerHTML = title
        templateModal.querySelector(".product-info-price").innerHTML = price
        
        index = 0
        for (const a of attributes){
            if (index === 10) break
            const {name,value_name} = a
            if (value_name.length > 20) continue
            const content = `${name}: ` + value_name
            const $li = d.createElement("li")
            $li.textContent = content
            templateModal.querySelector(".main-features-ul").appendChild($li)
            index++
        }
        let $clone = d.importNode(templateModal,true)
        $modalContent.appendChild($clone)
        cleanTemplate()
    }
    catch(err) {
        console.log(err)
    }
}

const cleanTemplate = () => {
    templateModal.querySelector(".container-imgs").innerHTML = ""
    templateModal.querySelector(".main-features-ul").innerHTML = ""
}


d.querySelector("form").addEventListener("submit",(e)=>{
    e.preventDefault()
    getProducts($inputSearch.value)
})

d.addEventListener("click", (e) => {
    if (e.target.matches(".product *")){
        const id = e.target.closest("article").getAttribute("data-id"),
            price = e.target.closest("article").querySelector(".product-price").textContent
        showProduct(id,price)
    }
    if (e.target.matches(".close-modal")) $modal.classList.remove("active")

    if (e.target.matches(".container-imgs img")){
        d.querySelector(".principal-img").setAttribute("src",e.target.getAttribute("src"))
    }
    if (e.target.matches(".modal-product")) $modal.classList.remove("active")
})

getProducts("iphone 15")