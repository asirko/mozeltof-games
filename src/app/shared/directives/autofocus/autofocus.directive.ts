import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
})
export class AutofocusDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef, private changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus();
    this.changeDetectorRef.markForCheck();
  }
}
