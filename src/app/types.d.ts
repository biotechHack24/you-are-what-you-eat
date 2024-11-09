export type AIResponseData = {
    nutrients         :NutrientsData,
    nutrient_score    :number,
    environment_score :number,
}

export type NutrientsData = {
    carbohydrates :number,
    protein       :number,
    minerals      :number,
    dairy         :number
}
