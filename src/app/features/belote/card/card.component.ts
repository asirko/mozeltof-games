import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements OnInit {
  @Input() card: string;
  value: string;
  color: string;

  ngOnInit(): void {
    if (this.card) {
      [this.value, this.color] = this.card.split(' ');
    }
  }
}
