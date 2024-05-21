import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphaNumeric]'
})
export class AlphaNumericDirective {

  constructor() { }

  @HostListener('keydown', ['$event'])
onKeyDown(event: KeyboardEvent) {
  // Allowed character groups
  const allowedLetters = /[a-zA-Z]/;
  const allowedDigits = /[0-9]/;
  const key = event.key;

  // Check backspace, tab, or enter
  if (event.key === 'Backspace' || event.key === 'Tab' || event.key === 'Enter') {
    return; // Allow these keys
  }

  // Check if first character is a letter
  if (!key || !allowedLetters.test(key)) {
    if (key !== 'Backspace' && !allowedLetters.test(key)) {
      event.preventDefault();
    }
    return;
  }

  // Check if entered character is a digit
  if (!allowedDigits.test(event.key)) {
    event.preventDefault();
  }
}

}
