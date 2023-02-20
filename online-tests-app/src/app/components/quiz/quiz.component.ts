import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuizService } from 'src/app/services/quiz-service.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  // variable declartion
  public name: string = '';
  public questionList: any = [];
  public currentQuestion: number = 0;
  public points: number = 0;
  counter = 10;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  interval$: any;
  progress: string = '0';
  isQuizCompleted: boolean = false;
  // Injecting Service
  constructor(private questionService: QuizService) {}

  // before render component it init's (automatically)
  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.getAllQuestions();
    this.startCounter();
  }
  // fetching questions from JSON / API and adding inside array
  getAllQuestions() {
    this.questionService
      .getQuestionJson()
      .subscribe((res: { questions: any }) => {
        this.questionList = res.questions;
      });
  }
  // switching to next question
  nextQuestion() {
    this.currentQuestion++;
  }
  // switch back to previous question (opt)
  previousQuestion() {
    this.currentQuestion--;
  }

  // answer fun() - with parameter of question & their options
  answer(currentQno: number, option: any) {
    if (currentQno === this.questionList.length) {
      this.isQuizCompleted = true;
      this.stopCounter();
    }
    // if the ans is correct !
    if (option.correct) {
      this.points += 10; // increase 10 points
      this.correctAnswer++; // correct ans count + 1
      setTimeout(() => {
        this.currentQuestion++; // increase qst count + 1
        this.resetCounter(); // reset timer
        this.getProgressPercent(); // increase progressbar percentage
      }, 1000);
    }
    // if we selected wrong ans !
    else {
      setTimeout(() => {
        this.currentQuestion++; // move next qst
        this.inCorrectAnswer++; // incorrect count + 1
        this.resetCounter(); // reset time
        this.getProgressPercent(); // increase progressbar percentage
      }, 1000);

      this.points -= 10; // minus points
    }
  }
  // Starting counter
  startCounter() {
    this.interval$ = interval(1000) // interval 1sec
      .subscribe((val) => {
        this.counter--; // decrease 60sec to 0sec
        if (this.counter === 0) {
          this.currentQuestion++; //increase qst count + 1
          this.counter = 10; // timer for 60sec
          this.points -= 10; // if not answered within 60sec it will take minus points
        }
      });
    setTimeout(() => {
      this.interval$.unsubscribe(); // idle time limit for 60sec
    }, 100000);
  }
  // stop counter fun()
  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }
  // reset counter fun()
  resetCounter() {
    this.stopCounter();
    this.counter = 10;
    this.startCounter();
  }
  // reset quiz - starts from begining
  resetQuiz() {
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.counter = 10;
    this.currentQuestion = 0;
    this.progress = '0';
  }
  // progressbar fun()
  getProgressPercent() {
    this.progress = (
      (this.currentQuestion / this.questionList.length) *
      100
    ).toString();
    return this.progress;
  }
}
