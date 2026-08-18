export type KillSwitchScope = 'global' | 'project' | 'agent' | 'resource';

export interface KillSwitchState { engaged: boolean; scope: KillSwitchScope; reason?: string; changedAt?: string; actorId?: string; }

export class KillSwitch {
  private state: KillSwitchState = { engaged: false, scope: 'global' };

  engage(reason = 'emergency-stop', actorId?: string, scope: KillSwitchScope = 'global'): void {
    this.state = { engaged: true, scope, reason, actorId, changedAt: new Date().toISOString() };
  }

  release(actorId?: string): void {
    this.state = { ...this.state, engaged: false, actorId, changedAt: new Date().toISOString() };
  }

  isEngaged(): boolean { return this.state.engaged; }
  snapshot(): KillSwitchState { return { ...this.state }; }

  assertOperational(): void {
    if (this.state.engaged) throw new Error('GLOBAL_KILL_SWITCH_ENGAGED');
  }
}
