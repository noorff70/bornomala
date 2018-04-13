import {Component, OnInit, OnChanges, Input, ElementRef} from '@angular/core';
// import * as MathJax from 'mathjax/MathJax';


@Component({
  selector: 'app-mathjax',
  templateUrl: './mathjax.component.html',
  styleUrls: ['./mathjax.component.css']
})
export class MathjaxComponent implements OnInit, OnChanges {

  @Input() inputMathJax: any;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.update();
  }

  ngOnChanges() {
    this.update();
  }

  update() {
    this.element.nativeElement.innerHTML = this.inputMathJax;
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.element.nativeElement]);
  }

}
