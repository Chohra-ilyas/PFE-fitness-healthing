import { BadRequestException, Injectable } from '@nestjs/common';
import { TraineeService } from 'src/trainees/trainee.service';
import { FitnessPlanOutputDto } from './dtos/FitnessPlanOutput.dto';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { NutritionPlanOutputDto } from './dtos/NutritionPlanOutput.dto';
import { NutritionService } from 'src/nutrition/nutrition.service';
import { generateNutritionPrompt, generateWorkoutPrompt, nutritionPromptcontent, workoutPromptcontent } from './prompts';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly traineeService: TraineeService,
    private readonly nutritionService: NutritionService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  public async generateMultipleFitnessPlans(
    traineeUserId: number,
  ): Promise<FitnessPlanOutputDto[]> {
    const trainee = await this.traineeService.getTraineeByUserId(traineeUserId);
    const prompt = generateWorkoutPrompt(trainee);
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: workoutPromptcontent,
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
    const prompt = generateNutritionPrompt(trainee);

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: nutritionPromptcontent.trim()
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


  

  public async generateDayMeal(traineeUserId: number) {
    const nutritionPlan =
      await this.nutritionService.getNutritionByTraineeId(traineeUserId);
    const prompt = this.generateDayMealPrompt(nutritionPlan);

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a Nutrition specialist API. Respond ONLY with valid JSON in this exact structure:
                {
                  "breakfast": {
                    "food": "Food Name",
                    "calories": "Calories number",
                    "proteins": "Proteins number",
                  },
                  "lunch": {
                    "food": "Food Name",
                    "calories": "Calories number",
                    "proteins": "Proteins number",
                  },
                  "snack": {
                    "food": "Food Name",
                    "calories": "Calories number",
                    "proteins": "Proteins number",
                  },
                  "dinner": {
                    "food": "Food Name",
                    "calories": "Calories number",
                    "proteins": "Proteins number",
                  },
                }
                Do not include any conversational text or explanations.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
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

  private generateDayMealPrompt(nutritionPlan): string {
    return `you have to provide a meal plan for the day based on the following nutrition plan:
    - Proteins: ${nutritionPlan.proteins} grams
    - Carbs: ${nutritionPlan.carbs} grams
    - Calories: ${nutritionPlan.calories} calories
    - Recommended Foods: ${nutritionPlan.recommendedFoods.map((food) => food.foodName).join(', ')}
    - Not Recommended Foods: ${nutritionPlan.notRecommendedFoods.map((food) => food.foodName).join(', ')}
    - Make sure you take these statistics into consideration.
    - Make sure that can not exceed the daily calories and proteins and carbs.
    `;
  }
}
