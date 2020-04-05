import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pseudo',
  templateUrl: './pseudo.component.html',
  styleUrls: ['./pseudo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PseudoComponent {
  form = this.fb.group({
    pseudo: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<any>) {}

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.pseudo);
    }
  }
}
