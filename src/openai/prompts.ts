export const workoutPromptcontent = `
            You are a fitness‑coach API.  You must respond *only* with a JSON object that VALIDATES against this schema—nothing else, no markdown, no trailing commas, no explanations:

              {
                "type": "object",
                "properties": {
                  "name":   { "type": "string" },
                  "days": {
                    "type": "array",
                    "minItems": 7,
                    "maxItems": 7,
                    "items": {
                      "type": "object",
                      "properties": {
                        "day":       { "type": "integer", "minimum": 1, "maximum": 7 },
                        "name":      { "type": "string" },
                        "exercises": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "exercise": { "type": "string" },
                              "sets":     { "type": "integer", "minimum": 1 },
                              "reps": {
                                "oneOf": [
                                  { "type": "integer", "minimum": 1 },
                                  { "type": "string", "enum": ["failure"] }
                                ]
                              },
                              "duration": { "type": "string" }
                            },
                            "required": ["exercise","sets"]
                          }
                        }
                      },
                      "required": ["day","name","exercises"]
                    }
                  }
                },
                "required": ["name","days"]
              }`;
export const nutritionPromptcontent = `
            You are a Nutrition Specialist API.  You must respond ONLY with a JSON object that *validates* against the following JSON Schema.  Do NOT include any markdown, code fences, comments, explanations or extra fields—just the raw JSON.
            {
              "type": "object",
              "properties": {
                "proteins": { "type": "number" },
                "carbs":    { "type": "number" },
                "calories": { "type": "number" },
                "recommendedFoods": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "foodType": { "type": "string" },
                      "foodName": { "type": "string" }
                    },
                    "required": ["foodType","foodName"],
                    "additionalProperties": false
                  }
                },
                "notRecommendedFoods": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "foodType":                 { "type": "string" },
                      "foodName":                 { "type": "string" },
                      "reasonForNotRecommending": { "type": "string" },
                      "problematicComponent":     { "type": "string" }
                    },
                    "required": ["foodType","foodName","reasonForNotRecommending","problematicComponent"],
                    "additionalProperties": false
                  }
                }
              },
              "required": ["proteins","carbs","calories","recommendedFoods","notRecommendedFoods"],
              "additionalProperties": false
            }
            `;
export function generateNutritionPrompt(trainee): string {
  const chronicDiseases = trainee.chronicDiseaseLinks
    .map((link) => link.chronicDisease.chronicDiseaseName)
    .join(', ');

  return `The user has provided the following details:
                - Height: ${trainee.height} cm
                - Weight: ${trainee.weight} kg
                - Age: ${trainee.age} years
                - Goal: ${trainee.goal}
                - Chronic Diseases: ${chronicDiseases || 'there are no chronic diseases'}
            
                Generate a personalized nutrition plan in JSON format that includes:
                {
                  "proteins": daily protein requirement in grams based on weight and goals,
                  "carbs": daily carbohydrate requirement in grams based on activity level and goals,
                  "calories": total daily calorie target based on TDEE calculation,
                  "recommendedFoods": [
                    {
                      "foodType": "nutritional category",
                      "foodName": "specific food item aligned with goals and health conditions (give me famous food)"
                    }
                  ],
                  "notRecommendedFoods": [
                    {
                      "foodType": "using medical/nutritional risk factors as the primary categorization method",
                      "foodName": "specific food item to avoid",
                      "reasonForNotRecommending": "clear connection to goal/chronic disease",
                      "problematicComponent": "specific nutrient/ingredient of concern"
                    }
                  ]
                }
            
                Requirements:
                1. Calculate protein needs using 1.6-2.2g/kg for muscle gain or 0.8-1g/kg for weight loss and for calories use Calculate Basal Metabolic Rate strategy
                2. Carb recommendations should match activity level and glycemic needs
                3. Calorie calculation must consider BMR and activity level using Mifflin-St Jeor formula
                4. Recommended foods must support the goal (${trainee.goal}) and consider ${chronicDiseases} and based By Nutritional Content(Proteins, Carbs, Fats, vitamins, minerals)
                5. Not recommended foods must specifically conflict with goals or aggravate ${chronicDiseases} 
                6. For chronic diseases: 
                  - Diabetes: focus on glycemic control
                  - Hypertension: limit sodium
                  - Kidney disease: adjust protein
                  - etc. (adapt accordingly)
                7. Macronutrient values must be whole numbers`;
}

export function generateWorkoutPrompt(trainee): string {
    const chronicDiseases = trainee.chronicDiseaseLinks
      .map((link) => link.chronicDisease.chronicDiseaseName)
      .join(', ');

    return `The user has provided the following details:
    - Height: ${trainee.height} cm
    - Weight: ${trainee.weight} kg
    - Age: ${trainee.age} years
    - Goal: ${trainee.goal}
    - Chronic Diseases: ${chronicDiseases || 'there is no chronic diseases'}
    - Make sure you take these statistics into consideration.
    
    Generate workout plan in JSON format. Each plan should include:
    - "name": A descriptive name for the workout plan.
    - "days": An array of 7 objects (one for each day). Each day must include:
        - "day": The day number (1 through 7).
        - "name": A descriptive name for that day.
        - "exercises": An array of exercises. Each exercise should include:
            - "exercise": The name of the exercise.
            - "sets": The number of sets.
            - "reps" (optional):can be to feilure OR The number of repetitions .
            - "duration" (optional): The duration (if applicable).
    
    -Ensure that each workout plan contains exactly 7 days and don't forget the Rest or Active Recovery days and the day 7 is for rest.
    -You cannot make the trainee train 3 days in a row.
    -make sure that have 7 days
    exemple for rest day: 
        "day": day number,
        "name": "Rest or Active Recovery",
        "exercises": []
    .`;
  }
