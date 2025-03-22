import { BadRequestException, Injectable } from '@nestjs/common';
import { TraineeService } from 'src/trainees/trainee.service';
import { FitnessPlanOutputDto } from './dtos/FitnessPlanOutput.dto';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { NutritionPlanOutputDto } from './dtos/NutritionPlanOutput.dto';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly traineeService: TraineeService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  public async generateMultipleFitnessPlans(
    traineeUserId: number,
  ): Promise<FitnessPlanOutputDto[]> {
    const trainee = await this.traineeService.getTraineeByUserId(traineeUserId);
    const prompt = this.generateWorkoutPrompt(trainee);

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a fitness coach API. Respond ONLY with valid JSON in this exact structure:
                {
                  "name": "Plan Name",
                  "days": [
                    {
                      "day": 1,
                      "name": "Day Name",
                      "exercises": [
                        {
                          "exercise": "Exercise Name",
                          "sets": 3,
                          "reps": 12,
                        }
                      ]
                    }
                  ]
                }
                Do not include any conversational text or explanations.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        n: 3,
        response_format: { type: 'json_object' },
      });

      // Parse and return each plan from the response
      const plans = response.choices.map((choice) => {
        try {
          const content = choice.message.content
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

          return JSON.parse(content);
        } catch (error) {
          console.error('Invalid JSON response:', choice.message.content);
          throw new BadRequestException(
            'AI returned invalid workout plan format',
          );
        }
      });
      return plans;
    } catch (error) {
      console.error('Error generating the workout plans:', error);
      throw new BadRequestException(
        'Failed to generate the workout plans. Please try again.',
      );
    }
  }

  public async generateMultipleNutritionPlans(
    traineeUserId: number,
  ): Promise<NutritionPlanOutputDto[]> {
    const trainee = await this.traineeService.getTraineeByUserId(traineeUserId);
    const prompt = this.generateNutritionPrompt(trainee);

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a fitness coach API. Respond ONLY with valid JSON in this exact structure:
                {
                  "proteins": "number representing grams of protein",
                  "carbs": "number representing grams of carbohydrates",
                  "calories": "number representing total calories",
                  "recommendedFoods": [
                    {
                      "foodType": "category of food (e.g., Carbohydrates, Proteins, Fats, etc.)",
                      "foodName": "name of the recommended food"
                    }
                  ],
                  "notRecommendedFoods": [
                    {
                      "foodType": "category of food",
                      "foodName": "name of the not recommended food",
                      "reasonForNotRecommending": "explanation why this food is not recommended",
                      "problematicComponent": "specific component in the food that is problematic"
                    }
                  ]
                }

            Do not include any conversational text or explanations.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        n: 3,
        response_format: { type: 'json_object' },
      });

      // Parse and return each plan from the response
      const plans = response.choices.map((choice) => {
        try {
          const content = choice.message.content
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

          return JSON.parse(content);
        } catch (error) {
          console.error('Invalid JSON response:', choice.message.content);
          throw new BadRequestException(
            'AI returned invalid workout plan format',
          );
        }
      });
      return plans;
    } catch (error) {
      console.error('Error generating the workout plans:', error);
      throw new BadRequestException(
        'Failed to generate the workout plans. Please try again.',
      );
    }
  }

  private generateNutritionPrompt(trainee): string {
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
          "foodName": "specific food item aligned with goals and health conditions"
        }
      ],
      "notRecommendedFoods": [
        {
          "foodType": "nutritional category",
          "foodName": "specific food item to avoid",
          "reasonForNotRecommending": "clear connection to goal/chronic disease",
          "problematicComponent": "specific nutrient/ingredient of concern"
        }
      ]
    }

    Requirements:
    1. Calculate protein needs using 1.6-2.2g/kg for muscle gain or 0.8-1g/kg for weight loss
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

  private generateWorkoutPrompt(trainee): string {
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
    exemple for rest day: 
        "day": day number,
        "name": "Rest or Active Recovery",
        "exercises": []
    .`;
  }
}
