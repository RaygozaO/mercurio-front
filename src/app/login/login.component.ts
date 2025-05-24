import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import {AlertaService} from '../services/alerta.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService]
})
export class LoginComponent {
  loginForm: FormGroup;
  registroForm: FormGroup;
  mostrarRegistro = false;

  showCaptchaChallenge = false;
  captcha = { a: 0, b: 0 };
  captchaExpected = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alerta: AlertaService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      clave_log: ['', [Validators.required]],
      captchaAnswer: ['']
    });

    this.registroForm = this.fb.group({
      nombreusuario: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required]]
    });
  }

  toggleCaptcha() {
    this.showCaptchaChallenge = !this.showCaptchaChallenge;
    if (this.showCaptchaChallenge) {
      const a = Math.floor(Math.random() * 10);
      const b = Math.floor(Math.random() * 10);
      this.captcha = { a, b };
      this.captchaExpected = a + b;
    } else {
      this.loginForm.patchValue({ captchaAnswer: '' });
    }
  }

 /* onSubmit() {
    const { email, clave_log, captchaAnswer } = this.loginForm.value;

    if (!this.showCaptchaChallenge || parseInt(captchaAnswer) !== this.captchaExpected) {
      alert('Captcha incorrecto.');
      return;
    }

    this.authService.login(email, clave_log, captchaAnswer, this.captchaExpected.toString())
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role.toString());

          switch (res.role) {
            case 1: this.router.navigate(['/admin']); break;
            case 2: this.router.navigate(['/admin/ventas']); break;
            case 3: this.router.navigate(['/pacientes']); break;
            default: this.router.navigate(['/']);
          }
        },
        error: () => {
          alert('Error en el inicio de sesión. Verifica tus credenciales.');
        }
      });
  }*/
  onSubmit() {
    const { email, clave_log, captchaAnswer } = this.loginForm.value;

    if (!this.showCaptchaChallenge || parseInt(captchaAnswer) !== this.captchaExpected) {
      this.alerta.error('Captcha incorrecto.');
      return;
    }

    this.authService.login(email, clave_log, captchaAnswer, this.captchaExpected.toString())
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role.toString());

          if (res.idusuario) {
            localStorage.setItem('id_usuario', res.idusuario.toString());
          }

          if (res.idcliente) {
            localStorage.setItem('id_cliente', res.idcliente.toString());
          }

          switch (res.role) {
            case 1: this.router.navigate(['/admin']); break;
            case 2: this.router.navigate(['/admin/ventas']); break;
            case 3: this.router.navigate(['/pacientes']); break;
            case 4: this.router.navigate(['/admin/inventario']); break;
            case 5: this.router.navigate(['/admin/citas']); break;
            default: this.router.navigate(['/']);
          }
        },
        error: () => {
          this.alerta.error('Error en el inicio de sesión. Verifica tus credenciales.');
        }
      });
  }


  registrarUsuario() {
    if (this.registroForm.valid) {
      this.authService.register(this.registroForm.value).subscribe({
        next: () => {
          this.alerta.success('Usuario registrado exitosamente');
          this.cerrarRegistro();
        },
        error: () => {
          this.alerta.error('Error al registrar usuario');
        }
      });
    } else {
      this.alerta.warning('Por favor, completa todos los campos del formulario');
    }
  }

  cerrarRegistro() {
    this.mostrarRegistro = false;
    this.registroForm.reset();
  }

  abrirRegistro(event: Event) {
    event.preventDefault();
    this.mostrarRegistro = true;
  }

}




