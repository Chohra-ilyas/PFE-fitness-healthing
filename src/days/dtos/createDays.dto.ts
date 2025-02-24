import { CreateExercisesDto } from "src/exercises/dtos/createExesices.dto";

export class CreateDaysDto {
  day: number;
  name: string;
  exercises: CreateExercisesDto[];
}
