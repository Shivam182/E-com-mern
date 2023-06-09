import { ADD_TO_CART , REMOVE_FROM_CART, SAVE_SHIPPING_INFO} from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [],holl:'hello' }, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;
      
      const isItemExist = state.cartItems?.find(
        i => i.product === item.product
      );

      // console.log('state: '+JSON.stringify(state))

      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.product === isItemExist.product ? item : i
          ),
        };
      } else {
        
        return {
          ...state,
          cartItems: [state.cartItems, item],
        };
      }

      case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems?.filter((i) => i.product !== action.payload),
      };

      case SAVE_SHIPPING_INFO:
        return{
          ...state,
          shippingInfo:action.payload,
        }

    default: return state;
      
  }
};
