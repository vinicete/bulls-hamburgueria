const cartButton = document.querySelector('#cart_btn')
const menu = document.getElementById('menu')
const cartItemsContainer = document.getElementById('cart_items')
const cartTotal = document.getElementById('cart_total')
const checkoutBtn = document.getElementById('checkout_btn')
const closeModalBtn = document.getElementById('close_modal_btn')
const cartCounter = document.getElementById('cart_count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address_warn')
const cartModal = document.querySelector('#cart_modal')
const removeItemBtn = document.querySelector('#remove_item')


let cart = []

cartButton.addEventListener("click", function(){
    updateCartModal()
    cartModal.style.display = 'flex'
})


cartModal.addEventListener("click", function(event){
    
    if(event.target === cartModal){
        cartModal.style.display = 'none'
    }
    
})

closeModalBtn.addEventListener("click", ()=>{

    cartModal.style.display = 'none'
})

menu.addEventListener("click", function(event){

    let parentButton = event.target.closest('.add-to-cart-btn')

    if(parentButton){
        const name = parentButton.getAttribute('data-name')
        const price = Number(parentButton.getAttribute('data-price'))
        
       /* const box = document.querySelector('#modal_box')
        const orderItems = document.createElement('div')
        cartItemsContainer.appendChild(orderItems)
        const pName = document.createElement('p')
        const pPrice = document.createElement('p')
        pName.classList.add('font-bold')
        cartItemsContainer.appendChild(pName)
        cartItemsContainer.appendChild(pPrice)

        pName.innerHTML = `${name}`
        pPrice.innerHTML = `${price}`*/

        addToCart(name,price)
        
    }
})
    

function addToCart(name, price){

    const existingItem = cart.find(item=> item.name === name)

    if(existingItem){

        existingItem.quantity++

    }else{

        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
    updateCartCounter()

    
}

function updateCartModal(){

    cartItemsContainer.innerHTML = ''
    let total = 0;

    cart.forEach(item=>{

        const cartItemElement = document.createElement('div')
        cartItemElement.classList.add('flex','flex-row','justify-between','mb-4')

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between w-full">

            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>

            </div>

            <button id="remove_item" data-name="${item.name}">
                Remover
            </button>

        </div>
        `
        total+= item.price*item.quantity
        cartItemsContainer.appendChild(cartItemElement)
    })


    cartTotal.innerHTML =  `${total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    })}`
}

function updateCartCounter(){
    let count = 0
   
    cart.forEach(item => {

        count = count + item.quantity
    } )

   
    cartCounter.innerHTML = `(${count})`
}

cartItemsContainer.addEventListener('click', function(event){

    if(event.target.id === 'remove_item'){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)

    }
})

function removeItemCart(name){

    const index = cart.findIndex(item => item.name === name )


    if(index !== -1){

        const item = cart[index]
        if(item.quantity>1){
            item.quantity--
            updateCartModal()
            updateCartCounter()
            return
        }
    
        cart.splice(index,1)
        updateCartModal()
        updateCartCounter()
    }
}

addressInput.addEventListener('input', function(event){

    let inputValue = event.target.value

    if(inputValue!==''){
        addressWarn.classList.add('hidden')
        addressInput.classList.remove('border-red-500')
    }


})

checkoutBtn.addEventListener('click', function(){

    const isOpen = checkRestaurantOpen()

    if(!isOpen){

        Toastify({
            text: "O restaurante está fechado no momento :(",
            duration: 5000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
            onClick: function(){} // Callback after click
          }).showToast();

        return
    }

    if(cart.length === 0)
        return

    if(addressInput.value === ''){
        addressWarn.classList.remove('hidden')
        addressInput.classList.add('border-red-500')
        return
    }

    //enviar pedido pra API do whats

    const cartItems = cart.map((item)=>{

        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "18996916068"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = []
    updateCartCounter()
    updateCartModal()
})

function checkRestaurantOpen(){

    const date = new Date()
    const hora = date.getHours()

    return hora>=18 && hora<22
}

const spanItem = document.querySelector('#date_span')
const isOpen = checkRestaurantOpen()

if(isOpen){
    spanItem.classList.remove('bg-red-500')
    spanItem.classList.add('bg-green-600')
}else{
    spanItem.classList.add('bg-red-500')
    spanItem.classList.remove('bg-green-600')
}
