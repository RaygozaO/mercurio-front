import {Component, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mercurio-front';
  @ViewChild(ToastContainerDirective, {static: true}) toastContainer!: ToastContainerDirective;
  constructor(private toastrServices: ToastrService) { }

  ngAfterViewInit() {
    this.toastrServices.overlayContainer = this.toastContainer;
  }
}
