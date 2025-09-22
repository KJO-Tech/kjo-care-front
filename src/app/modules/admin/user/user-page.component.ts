import { Component, computed, inject, signal } from '@angular/core';
import { ModalOpenButtonComponent } from '../../../shared/components/modal-open-button/modal-open-button.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserService } from '../../../core/services/user.service';
import { UserTableComponent } from './user-table/user-table.component';
import { UserModalComponent } from './user-modal/user-modal.component';
import { UserRequest, UserResponse } from '../../../core/interfaces/user-http.interface';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-user',
  templateUrl: './user-page.component.html',
  imports: [
    DialogComponent,
    ModalOpenButtonComponent,
    UserTableComponent,
    UserModalComponent
  ]
})
export default class UserPageComponent {

  readonly userService = inject(UserService);
  readonly toastService = inject(ToastService);

  search = signal<string>('');
  readonly selectedRole = signal<string>('all');
  readonly showDisabled = signal<boolean>(false);

  users = rxResource({
    loader: () => this.userService.getAll()
  });

  readonly filteredUsers = computed(() => {
    const userList = this.users.value() ?? [];
    const searchTerm = this.search().toLowerCase();
    const selectedRole = this.selectedRole();
    const showDisabled = this.showDisabled();

    return userList
      .filter(user => {
        if (!showDisabled && !user.enabled) return false;

        if (selectedRole !== 'all') {
          if (!user.roles.includes(selectedRole)) return false;
        }

        if (searchTerm) {
          const displayName = `${user.firstName} ${user.lastName}`.toLowerCase() || '';
          const email = user.email?.toLowerCase() || '';
          return displayName.includes(searchTerm) || email.includes(searchTerm);
        }

        return true;
      })
      // .sort((a, b) => {
      //   const dateA = a.createdAt?.toDate?.() || new Date(0);
      //   const dateB = b.createdAt?.toDate?.() || new Date(0);
      //   return dateB.getTime() - dateA.getTime();
      // });
  });

  readonly userStats = computed(() => {
    const allUsers = this.users.value() ?? [];
    return {
      total: allUsers.length,
      enabled: allUsers.filter(u => u.enabled).length,
      disabled: allUsers.filter(u => !u.enabled).length,
      admins: allUsers.filter(u => u.roles.includes('admin')).length,
      users: allUsers.filter(u => u.roles.includes('user')).length
    };
  });

  readonly selectedUser = this.userService.selectedUser;

  deleteUser() {
    this.userService.delete(this.userService.selectedUser()?.id ?? '').subscribe({
      next: () => {
        this.toastService.addToast({
          message: 'User deleted successfully',
          type: 'success',
          duration: 4000
        });

        this.reload();
      },
      error: (error) => {
        this.toastService.addToast({
          message: 'Error deleting user',
          type: 'error',
          duration: 4000
        });
      }
    });
  }

  updateSearch(term: string): void {
    this.search.set(term);
  }

  updateRoleFilter(role: string): void {
    this.selectedRole.set(role);
    this.users.reload();
  }

  toggleShowDisabled(): void {
    this.showDisabled.update(current => !current);
  }

  reload() {
    this.users.reload();
  }
}
