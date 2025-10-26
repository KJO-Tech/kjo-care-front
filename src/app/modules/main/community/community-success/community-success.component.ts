import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'community-success',
  templateUrl: './community-success.component.html',
  imports: [],
})
export default class CommunitySuccessComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  blogId = signal<string>('');

  constructor() {
    effect(() => {
      this.route.queryParamMap.subscribe(params => {
        this.blogId.set(params.get('id') ?? '');
      });
    });
  }

  redirectToPost() {
    if (this.blogId() !== '') {
      this.router.navigate(['/app/community/post', this.blogId()]);
    } else {
      this.router.navigate(['/app/community']);
    }
  }

}
