import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div *ngIf="iniciando" class="splash">
      <div class="splash-logo">🛒</div>
      <div class="splash-nombre">Tienda Don Pepe</div>
      <div class="spinner"></div>
    </div>
    <router-outlet *ngIf="!iniciando" />
  `,
  styles: [`
    .splash { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; gap: 1rem; background: #f1f8e9; }
    .splash-logo { font-size: 5rem; }
    .splash-nombre { font-size: 1.5rem; font-weight: 800; color: #1b5e20; }
    .spinner { width: 36px; height: 36px; border: 4px solid #c8e6c9; border-top-color: #1b5e20; border-radius: 50%; animation: spin .8s linear infinite; margin-top: .5rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class AppComponent implements OnInit {
  iniciando = true;

  constructor(private msalService: MsalService) {}

  async ngOnInit(): Promise<void> {
    await this.msalService.instance.initialize();
    const result = await this.msalService.instance.handleRedirectPromise();
    if (result?.account) {
      this.msalService.instance.setActiveAccount(result.account);
    } else {
      const accounts = this.msalService.instance.getAllAccounts();
      if (accounts.length > 0) {
        this.msalService.instance.setActiveAccount(accounts[0]);
      } else {
        await this.msalService.instance.loginRedirect({
          scopes: ['openid', 'profile']
        });
        return;
      }
    }
    this.iniciando = false;
  }
}
