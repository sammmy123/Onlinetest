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
  counter = 20;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  interval$: any;
  progress: string = '0';
  isQuizCompleted: boolean = false;
  // Injecting Service to the Quiz component.
  constructor(private quizService: QuizService) {}

  // Intialization before rendering
  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.getAllQuestions();
    this.startCounter();
  }
  // Fetching quiz from the API and adding to array
  getAllQuestions() {
    this.quizService
      .getQuestionJson()
      .subscribe((res: { questions: any }) => {
        this.questionList = res.questions;
      });
  }
  // Next question
  nextQuestion() {
    if(!(this.questionList.length - 1 == this.currentQuestion)){
      this.currentQuestion++;
      this.startCounter();
    }else{

    }

  }
  // Previous question
  previousQuestion() {
    if(this.currentQuestion !== 0){
      this.currentQuestion--;
    }

  }

  // answer with parameter of question and their options.
  answer(currentQno: number, option: any) {
    if (currentQno === this.questionList.length) {
      this.isQuizCompleted = true;
      this.stopCounter();
    }
    // if the answer is correct
    if (option.correct) {
      this.correctAnswer++; // correct answer count + 1
      setTimeout(() => {
        this.currentQuestion++; // increase question count + 1
        this.resetCounter(); // reset timer
        this.getProgressPercent(); // increase progressbar %
      }, 1000);

      this.points += 5; // increase by 5 points
    }
    // if wrong answer selected
    else {
      setTimeout(() => {
        this.currentQuestion++; // move to next question
        this.inCorrectAnswer++; // incorrect count + 1
        this.resetCounter(); // reset time
        this.getProgressPercent(); // increase progressbar %
      }, 1000);

      this.points -= 5; // substract 5 points
    }
  }
  // Start counter
  startCounter() {
    this.interval$ = interval(1000) // interval is 1 sec
      .subscribe((val) => {
        this.counter--; // decrease 20 sec to 0sec
        if (this.counter == 0) {
          this.currentQuestion++; //increase question count + 1
          this.counter = 20; // timer for 20 sec
          this.points -= 5; // if not answered within 20 sec it will take minus points
        }
      });
    setTimeout(() => {
      this.interval$.unsubscribe(); // idle time limit for 10sec
    }, 100000);
  }
  // stop counter
  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }
  // reset counter
  resetCounter() {
    this.stopCounter();
    this.counter = 20;
    this.startCounter();
  }
  // reset question - starts from beginning again
  resetQuiz() {
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.counter = 20;
    this.currentQuestion = 0;
    this.progress = '0';
  }
  // progressbar status
  getProgressPercent() {
    this.progress = (
      (this.currentQuestion / this.questionList.length) *
      100
    ).toString();
    return this.progress;
  }
}
