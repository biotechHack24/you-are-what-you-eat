export type AIResponseData = {
    nutrients         :NutrientsData,
    nutrient_score    :number,
    environment       :EnvironmentData,
    environment_score :number,
}

export type NutrientsData = {
    carbohydrates :number,
    protein       :number,
    minerals      :number,
    dairy         :number
}

export type EnvironmentData = {
    co2_score      :number,
    water_score    :number,
    land_score     :number
}
