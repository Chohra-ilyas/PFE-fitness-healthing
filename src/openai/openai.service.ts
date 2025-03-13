import { Injectable } from '@nestjs/common';
import { TraineeService } from 'src/trainees/trainee.service';
import { FitnessPlanOutputDto } from './dtos/FitnessPlanOutput.dto';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

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
    const prompt = this.generatePrompt(trainee);

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
        n:3,
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
          throw new Error('AI returned invalid workout plan format');
        }
      });

      return plans;
    } catch (error) {
      console.error('Error generating the workout plans:', error);
      throw new Error(
        'Failed to generate the workout plans. Please try again.',
      );
    }
  }

  private generatePrompt(trainee): string {
    return `The user has provided the following details:
    - Height: ${trainee.height} cm
    - Weight: ${trainee.weight} kg
    - Age: ${trainee.age} years
    - Goal: ${trainee.goal}
    - Chronic Diseases: ${trainee.chronicDiseases}
    
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
    
    Ensure that each workout plan contains exactly 7 days and don't forget the Rest or Active Recovery days and the day 7 is for rest.
    exemple : 
        "day": 3,
        "name": "Rest or Active Recovery",
        "exercises": []
    .`;
  }
}
