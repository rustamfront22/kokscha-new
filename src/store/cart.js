import { defineStore } from 'pinia'
import { useStorage} from "@vueuse/core";

export const useCartStore = defineStore('cart', () => {

    const cart = useStorage('cart', [])
    const setCart = async (data) => {
        return cart.value.push({...data, count: 1})
    }
    const setCount = async (data, operator) => {
        const index = cart.value.findIndex(el => el.id === data.id)
        switch (operator) {
            case '+': cart.value.at(index).count++
                break;
            case '-': cart.value.at(index).count--
                break;
        }
        if (!cart.value.at(index).count){
            await deleteCart(data)
            return
        }

        if (cart.value.at(index).count > cart.value.at(index).stock){
            cart.value.at(index).count = cart.value.at(index).stock
        }
    }
    const deleteCart = async (data) => {
        const index = cart.value.findIndex(el => el.id === data.id)
        cart.value.splice(index, 1)
        return index
    }
    return {cart, setCart, deleteCart, setCount}
})