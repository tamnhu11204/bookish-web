import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    comparisonItems: [],
    
    
}

export const comparisonSlide = createSlice({
    name: 'comparison',
    initialState,
    reducers: {
        addComparisonProduct: (state, action) => {
            const { comparisonItem } = action.payload
            const itemComparison = state?.comparisonItems?.find((item) => item?.product === comparisonItem.product)
            if (itemComparison) {
                itemComparison.amount += comparisonItem?.amount
            } else {
                state.comparisonItems.push(comparisonItem)
            }
        },
        removeComparisonProduct: (state, action) => {
            const { idProduct } = action.payload
            const itemComparison = state?.comparisonItems?.filter((item) => item?.product !== idProduct)
            state.comparisonItems = itemComparison
            
        },
        
       
    }
})

export const {  addComparisonProduct, removeComparisonProduct } = comparisonSlide.actions
export default comparisonSlide.reducer