
export const getGuestCart = ()=>{ 
     return(
         JSON.parse(localStorage.getItem("cart") || [])
     )
}


export const addToGuestCart = (product)=>{
      const cart = getGuestCart()

      const existing = cart.items.find( item => item.product === product.product)

      if(existing){
           existing.quantity += product.quantity || 1
      }
      else{
         cart.push({
              product: product.product,
              quantity: product.quantity,
              price: product.price,
              image: product.image,
              name: product.name
         })
      }
      localStorage.setItem( "cart" , JSON.stringify(cart))
}

export const removeFromGuestCart = (productId)=>{
      const cart = getGuestCart().filter(
          item => item.product !== productId
      )
      localStorage.setItem("cart" , JSON.stringify(cart))
}


export const clearGuestCart = ()=>{
      localStorage.removeItem("cart")
}