export function GetCart(){
    let cart=localStorage.getItem("cart");
    
    if(cart==null){
        cart=[]
        localStorage.setItem("cart",JSON.stringify(cart));
    }else{
        cart=JSON.parse(cart);
    }
    return cart
}

export function removeFromCart(productId){
    let cart=GetCart();
    const newCart=cart.filter((item)=>{
        return item.productId!=productId
    })
    localStorage.setItem("cart",JSON.stringify(newCart));
}

export function addToCart(product,qty){
    let cart=GetCart();
    
    let index=cart.findIndex((item)=>{
        return item.productId==product.productId
    })

    if(index==-1){
        cart[cart.length]={
            productId:product.productId,
            name:product.name,
            labeledPrice:product.labeledPrice,
            image:product.images[0],
            price:product.price,
            qty:qty
        }
    }else{
        const newQty=cart[index].qty+qty
        if(newQty<=0){
            removeFromCart(product.productId)
            return 
        }else{
            cart[index].qty=newQty
        }
    }

    localStorage.setItem("cart",JSON.stringify(cart));
}

export function getTotal(){
    let cart=GetCart();
    let total=0;
    for(let i=0;i<cart.length;i++){
        total += cart[i].price * cart[i].qty
    }
    return total
}
