import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Blog, Category, Status } from '../../../../core/models/blog';

import { FormUtils } from '../../../../shared/utils/form-utils';
import { BlogService } from '../../../../core/services/blog.service';
import { ToastService } from '../../../../core/services/toast.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserService } from '../../../../core/services/user.service';
import { UserRequest, UserResponse } from '../../../../core/interfaces/user-http.interface';

@Component({
  selector: 'user-modal',
  templateUrl: './user-modal.component.html',
  imports: [
    ReactiveFormsModule,
    NgClass
  ]
})
export class UserModalComponent {

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  formUtils = FormUtils;

  user = input<UserResponse | null>(null);
  type = input<'create' | 'edit'>('create');

  reload = output<void>();

  readonly showPassword = signal(false);
  readonly isSubmitting = signal(false);

  readonly title = computed(() =>
    this.type() === 'create' ? 'Crear nuevo usuario' : `Editar ${this.user()?.firstName || 'usuario'}`
  );

  readonly submitButtonText = computed(() =>
    this.type() === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'
  );

  readonly modalId = computed(() =>
    this.type() === 'create' ? 'modal_user_create' : 'modal_user_edit'
  );

  userForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: ['', [Validators.required, Validators.minLength(3)]],
    password: [''],
    roles: ['user', [Validators.required]]
  });

  constructor() {
    effect(() => {
      const passwordControl = this.userForm.get('password');
      if (this.type() === 'create') {
        passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
        passwordControl?.enable();
      } else {
        passwordControl?.clearValidators();
        passwordControl?.disable();
      }
      passwordControl?.updateValueAndValidity();
    });

    effect(() => {
      const userToEdit = this.user();

      if (userToEdit && this.type() === 'edit') {
        this.userForm.patchValue({
          email: userToEdit.email,
          firstName: this.user()?.firstName,
          lastName: this.user()?.lastName,
          password: '',
          roles: userToEdit.roles.includes('admin') ? 'admin' : 'user'
        });
      }
    });

    effect(() => {
      const emailControl = this.userForm.get('email');
      const usernameControl = this.userForm.get('firstName');

      if (emailControl?.value && this.type() === 'create' && !usernameControl?.dirty) {
        const emailPrefix = emailControl.value.split('@')[0];
        usernameControl?.setValue(emailPrefix);
      }
    });
  }


  onSubmit() {
    if (this.userForm.invalid || this.isSubmitting()) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.userForm.getRawValue();

    const operation$ = this.type() === 'create'
      ? this.createUser(formValue)
      : this.updateUser(formValue);

    operation$.subscribe({
      next: () => {
        this.reload.emit();
        this.resetForm();
        this.closeModal();
      },
      error: () => this.isSubmitting.set(false),
      complete: () => this.isSubmitting.set(false)
    });
  }

  private createUser(formValue: any) {
    const request: Omit<UserRequest, 'id'> = {
      username: formValue.firstName.toLowerCase() + formValue.lastName.toLowerCase(),
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
      roles: [formValue.roles]
    };

    return this.userService.create(request);
  }

  private updateUser(formValue: any) {
    const currentUser = this.user();
    if (!currentUser?.id) throw new Error('User ID required');

    let userRoles = currentUser.roles;
    const role = formValue.roles;
    const includeAdmin = userRoles.includes('admin');

    if (includeAdmin && role == "user") {
      userRoles = userRoles.filter(role => role !== 'admin');

      if (!userRoles.includes('user')) {
        userRoles.push('user');
      }
    } else if (!includeAdmin && role == "admin") {
      userRoles.push('admin');
    }

    const request: UserRequest = {
      id: this.user()?.id,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      username: this.user()?.username || formValue.firstName.toLowerCase() + formValue.lastName.toLowerCase(),
      email: formValue.email,
      password: formValue.password,
      roles: userRoles
    };

    if (formValue.password?.trim()) {
      request.password = formValue.password;
    }

    return this.userService.update(request);
  }

  toggleShowPassword() {
    this.showPassword.set(!this.showPassword());
  }

  private resetForm(): void {
    this.userForm.reset({ roles: 'user' });
    this.showPassword.set(false);
    this.isSubmitting.set(false);
  }

  private closeModal(): void {
    const modal = document.getElementById(this.modalId()) as HTMLDialogElement;
    modal?.close();
  }
}
