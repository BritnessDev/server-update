if (document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded',ready)
}else {
    ready()
}
function ready(){
    var removeCartItemsButtons = document.getElementsByClassName('RemoveBtn')
        console.log(removeCartItemsButtons)
    for (var i = 0 ; i < removeCartItemsButtons.length ; i++){
        var button = removeCartItemsButtons[i]
        button.addEventListener('click',removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for(var i = 0 ; i <quantityInputs.length;i++){
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }
    var addToCartBtn = document.getElementsByClassName('add-to-cart-btn')
    for (var i = 0; i < addToCartBtn.length; i++){
        var button = addToCartBtn[i]
        button.addEventListener('click',addToCartClicked)
    }
}

function removeCartItem(event){
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.parentElement.parentElement.remove()
    updateCartTotall()
}

function quantityChanged(event){
    var input=event.target
    if(isNaN(input.value) || input.value <= 0){
        input.value = 1
    }
    updateCartTotall()
}

// function addToCartClicked(event) {
//     var button = event.target
//     var item = button.parentElement
//     var 
// }

function updateCartTotall() {
    var cartitemContainer = document.getElementsByClassName('cart-page')[0]
    var cartRows = cartitemContainer.getElementsByClassName('cart-info')
    for (var i = 0 ; i < cartRows.length ; i++){
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('price')[0]

        // we have a problem finding the quantity vlaue for each product so the total price is not correct 
        var quantityElement = cartRow.getElementsByClassName("cart-quantity-input")[0]
        var quantity = quantityElement.value

        var price = parseFloat(priceElement.innerText.replace('Price: $',''))
        var total = total+ (price * quantity)
    }
    total=math.round(total*100)/100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}